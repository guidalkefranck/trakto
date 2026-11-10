import bcrypt from 'bcryptjs';
import pool from '../database/conexao.js';
import { emailValido, validarCadastroUsuario } from '../utils/validacoes.js';
import { gerarToken } from '../utils/token.js';
import { limparFalhas, registrarFalha } from '../middlewares/limitarTentativas.js';

const CUSTO_BCRYPT = 10;

// Nunca devolvemos a senha (nem o hash) para o app.
function publico(u) {
  return { id: u.id, nome: u.nome, email: u.email, telefone: u.telefone, cidade: u.cidade, nivel: u.nivel };
}

// POST /auth/cadastro — CADASTRO
export async function cadastrar(req, res, next) {
  const { erro, dados } = validarCadastroUsuario(req.body);
  if (erro) { return res.status(400).json({ mensagem: erro }); }

  try {
    // HASH: a senha original nunca vai para o banco. bcrypt gera um "sal"
    // aleatório e só o resultado ($2b$10$...) é gravado.
    const hash = await bcrypt.hash(dados.senha, CUSTO_BCRYPT);
    const [resultado] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha, telefone, cidade, nivel) VALUES (?, ?, ?, ?, ?, ?)',
      [dados.nome, dados.email, hash, dados.telefone, dados.cidade, dados.nivel],
    );
    return res.status(201).json({
      mensagem: 'Conta criada com sucesso.',
      usuario: publico({ id: resultado.insertId, ...dados }),
    });
  } catch (e) {
    // O UNIQUE do banco protege até contra dois cadastros simultâneos.
    if (e.code === 'ER_DUP_ENTRY') { return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' }); }
    return next(e);
  }
}

// POST /auth/login — LOGIN → JWT
export async function login(req, res, next) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const senha = req.body.senha;
  if (!emailValido(email) || typeof senha !== 'string' || !senha || Buffer.byteLength(senha, 'utf8') > 72) {
    return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
  }

  try {
    const [linhas] = await pool.execute(
      'SELECT id, nome, email, senha, telefone, cidade, nivel FROM usuarios WHERE email = ?',
      [email],
    );
    const usuario = linhas[0];
    // VALIDAÇÃO DAS CREDENCIAIS: bcrypt.compare refaz o hash e compara.
    // Mesma mensagem para e-mail inexistente e senha errada: não revela quem tem conta.
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      registrarFalha(req);
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    limparFalhas(req);
    const { token, expiraEm } = gerarToken(usuario);
    return res.status(200).json({ token, tipo: 'Bearer', expiraEm, usuario: publico(usuario) });
  } catch (e) {
    return next(e);
  }
}

// GET /auth/me — confere o token e devolve os dados atuais (usado ao reabrir o app).
export function eu(req, res) {
  return res.json({ usuario: publico(req.usuario), expiraEm: req.sessao.expiraEm.toISOString() });
}

// POST /auth/logout — LOGOUT: revoga este token no servidor.
export async function logout(req, res, next) {
  try {
    await pool.execute(
      'INSERT IGNORE INTO tokens_revogados (jti, usuario_id, expira_em) VALUES (?, ?, ?)',
      [req.sessao.jti, req.usuario.id, req.sessao.expiraEm],
    );
    // Faxina: tokens vencidos já não valem mesmo; não precisam ficar na tabela.
    await pool.execute('DELETE FROM tokens_revogados WHERE expira_em < NOW()');
    return res.json({ mensagem: 'Você saiu da sua conta.' });
  } catch (e) {
    return next(e);
  }
}
