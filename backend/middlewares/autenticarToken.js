import pool from '../database/conexao.js';
import { extrairBearer, validarToken } from '../utils/token.js';

// Protege as rotas: só passa quem envia um JWT válido no cabeçalho
//   Authorization: Bearer <token>
// e preenche req.usuario com os dados ATUAIS do banco.
export default async function autenticarToken(req, res, next) {
  const token = extrairBearer(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ mensagem: 'Faça login para continuar (token não enviado).' });
  }

  let payload;
  try {
    payload = validarToken(token);
  } catch (erro) {
    const expirou = erro.name === 'TokenExpiredError';
    return res.status(401).json({ mensagem: expirou ? 'Sua sessão expirou. Entre novamente.' : 'Sessão inválida. Entre novamente.' });
  }

  const id = Number(payload.sub);
  if (!Number.isInteger(id) || id < 1 || typeof payload.jti !== 'string') {
    return res.status(401).json({ mensagem: 'Sessão inválida. Entre novamente.' });
  }

  try {
    // Token de quem já fez logout não vale mais.
    const [revogados] = await pool.execute('SELECT 1 FROM tokens_revogados WHERE jti = ?', [payload.jti]);
    if (revogados.length > 0) {
      return res.status(401).json({ mensagem: 'Você saiu desta sessão. Entre novamente.' });
    }

    const [linhas] = await pool.execute(
      'SELECT id, nome, email, telefone, cidade, nivel FROM usuarios WHERE id = ?',
      [id],
    );
    if (linhas.length === 0) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado. Entre novamente.' });
    }

    // O NÍVEL vem do banco, não do token: se o admin rebaixar alguém,
    // a mudança vale na hora, mesmo com um token antigo ainda válido.
    req.usuario = linhas[0];
    req.sessao = { jti: payload.jti, expiraEm: new Date(payload.exp * 1000) };
    return next();
  } catch (erro) {
    return next(erro);
  }
}
