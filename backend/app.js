import './config/ambiente.js';
import express from 'express';
import cors from 'cors';
import pool from './database/conexao.js';
import authRoutes from './routes/authRoutes.js';
import maquinasRoutes from './routes/maquinasRoutes.js';
import solicitacoesRoutes from './routes/solicitacoesRoutes.js';
import usuariosRoutes from './routes/usuariosRoutes.js';

const app = express();
app.disable('x-powered-by');

// CORS libera o Expo Web (outra porta) a chamar a API.
app.use(cors());
app.use(express.json({ limit: '20kb' }));

// Garante um objeto em req.body e evita cache de respostas com dados pessoais.
app.use(function prepararRequisicao(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) { req.body = {}; }
  next();
});

app.get('/', function apresentar(req, res) {
  res.json({
    api: 'TRAKTO',
    descricao: 'Aluguel de máquinas e serviços agrícolas',
    rotas: ['/saude', '/auth', '/maquinas', '/solicitacoes', '/usuarios'],
    documentacao: 'docs/API.md',
  });
});

// Usada pelo app para saber se a API e o banco estão no ar.
app.get('/saude', async function saude(req, res) {
  try {
    await pool.query('SELECT 1');
    return res.json({ api: 'ok', banco: 'ok' });
  } catch {
    return res.status(503).json({ api: 'ok', banco: 'indisponível', mensagem: 'A API não conseguiu acessar o MySQL.' });
  }
});

app.use('/auth', authRoutes);
app.use('/maquinas', maquinasRoutes);
app.use('/solicitacoes', solicitacoesRoutes);
app.use('/usuarios', usuariosRoutes);

app.use(function rotaNaoEncontrada(req, res) {
  res.status(404).json({ mensagem: 'Rota não encontrada: ' + req.method + ' ' + req.path });
});

// Tratador de erros (4 parâmetros). Nunca devolve SQL, stack trace ou credenciais ao cliente.
app.use(function tratarErro(erro, req, res, next) { // eslint-disable-line no-unused-vars
  if (erro.type === 'entity.parse.failed') { return res.status(400).json({ mensagem: 'JSON inválido no corpo da requisição.' }); }
  if (erro.type === 'entity.too.large') { return res.status(413).json({ mensagem: 'Corpo da requisição muito grande.' }); }
  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno do servidor. Tente novamente.' });
});

export default app;
