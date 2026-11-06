import pool from '../database/conexao.js';
import { podeAlterarMaquina } from '../../constants/permissoes.js';
import { idValido, validarMaquina } from '../utils/validacoes.js';

// Colunas do banco (snake_case) → campos do app (camelCase), com dados do anunciante.
const SELECT_MAQUINA = `
  SELECT m.id, m.proprietario_id AS proprietarioId, m.nome, m.tipo, m.potencia, m.cidade,
         m.preco_hora AS precoHora, m.disponivel, m.com_operador AS comOperador, m.descricao,
         m.criado_em AS criadoEm,
         u.nome AS proprietarioNome, u.cidade AS proprietarioCidade, u.nivel AS proprietarioNivel
    FROM maquinas m
    JOIN usuarios u ON u.id = m.proprietario_id`;

// MySQL guarda BOOLEAN como 0/1; o app recebe true/false.
function formatar(m) {
  return { ...m, disponivel: Boolean(m.disponivel), comOperador: Boolean(m.comOperador) };
}

async function buscarPorId(id) {
  const [linhas] = await pool.execute(SELECT_MAQUINA + ' WHERE m.id = ?', [id]);
  return linhas[0] ? formatar(linhas[0]) : null;
}

// GET /maquinas?busca=&tipo=&cidade=&disponivel=true&proprietarioId=
export async function listar(req, res, next) {
  const filtros = [];
  const valores = [];
  const { busca, tipo, cidade, disponivel, proprietarioId } = req.query;

  if (typeof busca === 'string' && busca.trim()) {
    filtros.push('(m.nome LIKE ? OR m.cidade LIKE ? OR m.tipo LIKE ?)');
    const termo = '%' + busca.trim() + '%';
    valores.push(termo, termo, termo);
  }
  if (typeof tipo === 'string' && tipo) { filtros.push('m.tipo = ?'); valores.push(tipo); }
  if (typeof cidade === 'string' && cidade) { filtros.push('m.cidade = ?'); valores.push(cidade); }
  if (disponivel === 'true') { filtros.push('m.disponivel = TRUE'); }
  if (proprietarioId !== undefined) {
    if (!idValido(proprietarioId)) { return res.status(400).json({ mensagem: 'proprietarioId inválido.' }); }
    filtros.push('m.proprietario_id = ?'); valores.push(Number(proprietarioId));
  }

  try {
    // Valores sempre como parâmetros "?": nada do usuário é concatenado no SQL.
    const sql = SELECT_MAQUINA + (filtros.length ? ' WHERE ' + filtros.join(' AND ') : '') + ' ORDER BY m.disponivel DESC, m.criado_em DESC';
    const [linhas] = await pool.execute(sql, valores);
    return res.json(linhas.map(formatar));
  } catch (e) { return next(e); }
}

// GET /maquinas/:id
export async function detalhar(req, res, next) {
  if (!idValido(req.params.id)) { return res.status(400).json({ mensagem: 'ID de máquina inválido.' }); }
  try {
    const maquina = await buscarPorId(Number(req.params.id));
    if (!maquina) { return res.status(404).json({ mensagem: 'Máquina não encontrada.' }); }
    return res.json(maquina);
  } catch (e) { return next(e); }
}

// POST /maquinas — o dono é SEMPRE quem está logado (não vem do corpo da requisição).
export async function criar(req, res, next) {
  const { erro, dados } = validarMaquina(req.body);
  if (erro) { return res.status(400).json({ mensagem: erro }); }
  try {
    const [resultado] = await pool.execute(
      `INSERT INTO maquinas (proprietario_id, nome, tipo, potencia, cidade, preco_hora, disponivel, com_operador, descricao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.usuario.id, dados.nome, dados.tipo, dados.potencia, dados.cidade, dados.precoHora, dados.disponivel ? 1 : 0, dados.comOperador ? 1 : 0, dados.descricao],
    );
    const maquina = await buscarPorId(resultado.insertId);
    return res.status(201).json({ mensagem: 'Máquina anunciada com sucesso.', maquina });
  } catch (e) { return next(e); }
}

// PUT /maquinas/:id — só o dono ou o admin (moderação).
export async function atualizar(req, res, next) {
  if (!idValido(req.params.id)) { return res.status(400).json({ mensagem: 'ID de máquina inválido.' }); }
  const { erro, dados } = validarMaquina(req.body);
  if (erro) { return res.status(400).json({ mensagem: erro }); }
  try {
    const atual = await buscarPorId(Number(req.params.id));
    if (!atual) { return res.status(404).json({ mensagem: 'Máquina não encontrada.' }); }
    if (!podeAlterarMaquina(req.usuario, atual)) { return res.status(403).json({ mensagem: 'Você só pode alterar as suas próprias máquinas.' }); }

    await pool.execute(
      `UPDATE maquinas SET nome = ?, tipo = ?, potencia = ?, cidade = ?, preco_hora = ?, disponivel = ?, com_operador = ?, descricao = ?
        WHERE id = ?`,
      [dados.nome, dados.tipo, dados.potencia, dados.cidade, dados.precoHora, dados.disponivel ? 1 : 0, dados.comOperador ? 1 : 0, dados.descricao, atual.id],
    );
    return res.json({ mensagem: 'Anúncio atualizado.', maquina: await buscarPorId(atual.id) });
  } catch (e) { return next(e); }
}

// DELETE /maquinas/:id — bloqueado se houver aluguel pendente ou aceito.
export async function excluir(req, res, next) {
  if (!idValido(req.params.id)) { return res.status(400).json({ mensagem: 'ID de máquina inválido.' }); }
  try {
    const atual = await buscarPorId(Number(req.params.id));
    if (!atual) { return res.status(404).json({ mensagem: 'Máquina não encontrada.' }); }
    if (!podeAlterarMaquina(req.usuario, atual)) { return res.status(403).json({ mensagem: 'Você só pode excluir as suas próprias máquinas.' }); }

    const [[{ ativos }]] = await pool.execute(
      "SELECT COUNT(*) AS ativos FROM solicitacoes WHERE maquina_id = ? AND status IN ('pendente', 'aceita')",
      [atual.id],
    );
    if (ativos > 0) {
      return res.status(409).json({ mensagem: 'Esta máquina tem ' + ativos + ' aluguel(is) pendente(s) ou aceito(s). Finalize-os antes de excluir.' });
    }
    await pool.execute('DELETE FROM maquinas WHERE id = ?', [atual.id]);
    return res.json({ mensagem: 'Anúncio excluído.' });
  } catch (e) { return next(e); }
}
