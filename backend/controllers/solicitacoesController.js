import pool from '../database/conexao.js';
import { pode } from '../../constants/permissoes.js';
import { idValido, TRANSICOES, validarSolicitacao } from '../utils/validacoes.js';

// Junta solicitação + máquina + produtor + proprietário em uma consulta só.
const SELECT_SOLICITACAO = `
  SELECT s.id, s.maquina_id AS maquinaId, s.produtor_id AS produtorId, s.data_servico AS dataServico,
         s.horas, s.valor_total AS valorTotal, s.status, s.observacao, s.criado_em AS criadoEm,
         m.nome AS maquinaNome, m.tipo AS maquinaTipo, m.proprietario_id AS proprietarioId,
         p.nome AS produtorNome, p.cidade AS produtorCidade, p.telefone AS produtorTelefone,
         d.nome AS proprietarioNome, d.cidade AS proprietarioCidade, d.telefone AS proprietarioTelefone
    FROM solicitacoes s
    JOIN maquinas m ON m.id = s.maquina_id
    JOIN usuarios p ON p.id = s.produtor_id
    JOIN usuarios d ON d.id = m.proprietario_id`;

// Monta a resposta. O telefone das partes só é enviado depois do aceite (RN07):
// a regra é garantida aqui no servidor, não apenas escondida na tela.
function formatar(l) {
  const liberado = l.status === 'aceita' || l.status === 'concluida';
  return {
    id: l.id, maquinaId: l.maquinaId, produtorId: l.produtorId, proprietarioId: l.proprietarioId,
    dataServico: l.dataServico, horas: l.horas, valorTotal: l.valorTotal, status: l.status,
    observacao: l.observacao, criadoEm: l.criadoEm,
    maquina: { id: l.maquinaId, nome: l.maquinaNome, tipo: l.maquinaTipo },
    produtor: { id: l.produtorId, nome: l.produtorNome, cidade: l.produtorCidade, telefone: liberado ? l.produtorTelefone : null },
    proprietario: { id: l.proprietarioId, nome: l.proprietarioNome, cidade: l.proprietarioCidade, telefone: liberado ? l.proprietarioTelefone : null },
  };
}

async function buscarPorId(id) {
  const [linhas] = await pool.execute(SELECT_SOLICITACAO + ' WHERE s.id = ?', [id]);
  return linhas[0] ? formatar(linhas[0]) : null;
}

// GET /solicitacoes — cada nível enxerga só o que pode:
// produtor → as que ele fez | proprietário → as das máquinas dele | admin → todas.
export async function listar(req, res, next) {
  let filtro = '';
  const valores = [];
  if (pode(req.usuario, 'verTodasSolicitacoes')) {
    filtro = '';
  } else if (pode(req.usuario, 'responderSolicitacoes')) {
    filtro = ' WHERE m.proprietario_id = ?'; valores.push(req.usuario.id);
  } else {
    filtro = ' WHERE s.produtor_id = ?'; valores.push(req.usuario.id);
  }
  try {
    const [linhas] = await pool.execute(SELECT_SOLICITACAO + filtro + ' ORDER BY s.criado_em DESC, s.id DESC', valores);
    return res.json(linhas.map(formatar));
  } catch (e) { return next(e); }
}

// POST /solicitacoes — produtor pede o aluguel; o VALOR é calculado no servidor (RN05).
export async function criar(req, res, next) {
  const { erro, dados } = validarSolicitacao(req.body);
  if (erro) { return res.status(400).json({ mensagem: erro }); }
  try {
    const [maquinas] = await pool.execute('SELECT id, preco_hora AS precoHora, disponivel FROM maquinas WHERE id = ?', [dados.maquinaId]);
    const maquina = maquinas[0];
    if (!maquina) { return res.status(404).json({ mensagem: 'Máquina não encontrada.' }); }
    if (!maquina.disponivel) { return res.status(409).json({ mensagem: 'Esta máquina não está disponível no momento.' }); }

    const valorTotal = Math.round(maquina.precoHora * dados.horas * 100) / 100;
    const [resultado] = await pool.execute(
      'INSERT INTO solicitacoes (maquina_id, produtor_id, data_servico, horas, valor_total, observacao) VALUES (?, ?, ?, ?, ?, ?)',
      [maquina.id, req.usuario.id, dados.dataServico, dados.horas, valorTotal, dados.observacao],
    );
    return res.status(201).json({ mensagem: 'Solicitação enviada.', solicitacao: await buscarPorId(resultado.insertId) });
  } catch (e) { return next(e); }
}

// PATCH /solicitacoes/:id/status  { "status": "aceita" | "recusada" | "concluida" | "cancelada" }
export async function alterarStatus(req, res, next) {
  if (!idValido(req.params.id)) { return res.status(400).json({ mensagem: 'ID de solicitação inválido.' }); }
  const novo = req.body.status;
  const regra = TRANSICOES[novo];
  if (!regra) { return res.status(400).json({ mensagem: 'Status inválido. Use: ' + Object.keys(TRANSICOES).join(', ') + '.' }); }

  try {
    const atual = await buscarPorId(Number(req.params.id));
    if (!atual) { return res.status(404).json({ mensagem: 'Solicitação não encontrada.' }); }

    // Quem pode mudar: o dono da máquina (aceitar/recusar/concluir) ou o produtor (cancelar).
    const autorizado = regra.quem === 'dono'
      ? atual.proprietarioId === req.usuario.id && pode(req.usuario, 'responderSolicitacoes')
      : atual.produtorId === req.usuario.id;
    if (!autorizado) { return res.status(403).json({ mensagem: 'Você não pode alterar esta solicitação.' }); }

    if (!regra.de.includes(atual.status)) {
      return res.status(409).json({ mensagem: 'Não é possível mudar de "' + atual.status + '" para "' + novo + '".' });
    }

    await pool.execute('UPDATE solicitacoes SET status = ? WHERE id = ?', [novo, atual.id]);
    return res.json({ mensagem: 'Solicitação atualizada.', solicitacao: await buscarPorId(atual.id) });
  } catch (e) { return next(e); }
}
