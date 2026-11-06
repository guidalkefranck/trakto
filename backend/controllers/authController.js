import bcrypt from 'bcryptjs';
import pool from '../database/conexao.js';
import { emailValido, validarCadastroUsuario } from '../utils/validacoes.js';

const CUSTO_BCRYPT = 10;

// Nunca devolvemos a senha (nem o hash) para o app.
function publico(u) {
  return { id: u.id, nome: u.nome, email: u.email, telefone: u.telefone, cidade: u.cidade, nivel: u.nivel };
}

// POST /auth/cadastro
export async function cadastrar(req, res, next) {
  const { erro, dados } = validarCadastroUsuario(req.body);
  if (erro) { return res.status(400).json({ mensagem: erro }); }

  try {
    // A senha original nunca vai para o banco: só o hash bcrypt.
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

// POST /auth/login
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
    // Mesma mensagem para e-mail inexistente e senha errada: não revela quem tem conta.
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }
    // ENTREGA 3: aqui será gerado o JWT (jwt.sign) e devolvido junto com o usuário.
    return res.status(200).json({ usuario: publico(usuario) });
  } catch (e) {
    return next(e);
  }
}
