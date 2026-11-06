import pool from '../database/conexao.js';
import { idValido } from '../utils/validacoes.js';

// ENTREGA 2 (provisório): o app envia o id de quem está logado no cabeçalho
// "X-Usuario-Id", e a API carrega esse usuário do banco em req.usuario.
//
// ENTREGA 3: este middleware será substituído por autenticarToken.js, que lê
// "Authorization: Bearer <JWT>", valida a assinatura e preenche req.usuario
// do mesmo jeito. Controllers e permissões não precisarão mudar.
export default async function identificarUsuario(req, res, next) {
  const id = req.headers['x-usuario-id'];
  if (!idValido(id)) {
    return res.status(401).json({ mensagem: 'Faça login para continuar.' });
  }
  try {
    const [linhas] = await pool.execute(
      'SELECT id, nome, email, telefone, cidade, nivel FROM usuarios WHERE id = ?',
      [Number(id)],
    );
    if (linhas.length === 0) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado. Faça login novamente.' });
    }
    // O nível vem SEMPRE do banco: rebaixar alguém tem efeito imediato.
    req.usuario = linhas[0];
    return next();
  } catch (erro) {
    return next(erro);
  }
}
