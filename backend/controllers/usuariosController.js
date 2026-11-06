import pool from '../database/conexao.js';
import { NIVEIS } from '../../constants/permissoes.js';
import { idValido } from '../utils/validacoes.js';

const CAMPOS = 'id, nome, email, telefone, cidade, nivel, criado_em AS criadoEm';

// GET /usuarios — somente admin.
export async function listar(req, res, next) {
  try {
    const [linhas] = await pool.execute('SELECT ' + CAMPOS + ' FROM usuarios ORDER BY nome');
    return res.json(linhas);
  } catch (e) { return next(e); }
}

// PATCH /usuarios/:id/nivel  { "nivel": "produtor" | "proprietario" | "admin" } — somente admin.
export async function alterarNivel(req, res, next) {
  if (!idValido(req.params.id)) { return res.status(400).json({ mensagem: 'ID de usuário inválido.' }); }
  const nivel = req.body.nivel;
  if (!Object.keys(NIVEIS).includes(nivel)) { return res.status(400).json({ mensagem: 'Nível inválido.' }); }
  const id = Number(req.params.id);
  // RN02: um admin não altera o próprio nível (evita ficar sem nenhum administrador).
  if (id === req.usuario.id) { return res.status(409).json({ mensagem: 'Você não pode alterar o seu próprio nível.' }); }

  try {
    const [resultado] = await pool.execute('UPDATE usuarios SET nivel = ? WHERE id = ?', [nivel, id]);
    if (resultado.affectedRows === 0) { return res.status(404).json({ mensagem: 'Usuário não encontrado.' }); }
    const [linhas] = await pool.execute('SELECT ' + CAMPOS + ' FROM usuarios WHERE id = ?', [id]);
    return res.json({ mensagem: 'Nível atualizado.', usuario: linhas[0] });
  } catch (e) { return next(e); }
}

// GET /usuarios/eu — dados atualizados de quem está logado.
export function eu(req, res) {
  return res.json(req.usuario);
}
