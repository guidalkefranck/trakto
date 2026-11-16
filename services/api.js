// Comunicação do app com a API TRAKTO usando fetch() (nativo, sem bibliotecas extras).
//
// App (React Native) → fetch() → API Express (backend/) → MySQL
//
// Endereço da API:
//  - padrão: EXPO_PUBLIC_API_URL do .env (ou localhost, que serve no navegador do PC);
//  - no APK/celular: o usuário informa o IP do computador na tela de login
//    ("Servidor da API"), e o endereço fica salvo no aparelho (services/configuracao.js).

export const API_URL_PADRAO = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
let apiUrl = API_URL_PADRAO;

// Sem resposta nesse tempo, desiste (evita o app "travado" com IP errado).
const TEMPO_LIMITE_MS = 15000;

export function obterApiUrl() { return apiUrl; }
export function definirApiUrl(url) { apiUrl = url || API_URL_PADRAO; }

// "192.168.0.15:3000" → "http://192.168.0.15:3000". Devolve '' se for inválido.
export function normalizarApiUrl(texto) {
  let url = String(texto || '').trim().replace(/\/+$/, '');
  if (!url) { return ''; }
  if (!/^https?:\/\//i.test(url)) { url = 'http://' + url; }
  return /^https?:\/\/[a-z0-9.-]+(:\d{1,5})?$/i.test(url) ? url : '';
}

function comTempoLimite(url, opcoes, ms) {
  const controle = new AbortController();
  const timer = setTimeout(function cancelar() { controle.abort(); }, ms);
  return fetch(url, { ...opcoes, signal: controle.signal }).finally(function limpar() { clearTimeout(timer); });
}

// Testa um endereço ANTES de salvá-lo (tela "Servidor da API").
export async function testarApi(url) {
  try {
    const resposta = await comTempoLimite(url + '/saude', { headers: { Accept: 'application/json' } }, 6000);
    const dados = await resposta.json().catch(function semJson() { return null; });
    if (dados && dados.api === 'ok') {
      return dados.banco === 'ok' ? { ok: true } : { ok: false, mensagem: 'A API respondeu, mas não conseguiu acessar o MySQL.' };
    }
    return { ok: false, mensagem: 'Esse endereço respondeu, mas não é a API TRAKTO.' };
  } catch {
    return { ok: false, mensagem: 'Sem resposta em ' + url + '. Confira o IP, a porta, se a API está rodando e se o celular está no mesmo Wi-Fi.' };
  }
}

// Token JWT da sessão atual. Vai em toda requisição como
//   Authorization: Bearer <token>
let tokenAtual = null;
// Chamado quando a API recusa o token (expirado, revogado ou inválido).
let aoSessaoExpirar = null;

export function definirToken(token) {
  tokenAtual = token || null;
}

export function quandoSessaoExpirar(callback) {
  aoSessaoExpirar = callback;
}

// Função central: monta a requisição, trata erros de rede e lê a resposta JSON.
async function requisicao(caminho, { metodo = 'GET', corpo = undefined } = {}) {
  const cabecalhos = { Accept: 'application/json' };
  if (corpo !== undefined) { cabecalhos['Content-Type'] = 'application/json'; }
  if (tokenAtual) { cabecalhos.Authorization = 'Bearer ' + tokenAtual; }

  let resposta;
  try {
    resposta = await comTempoLimite(apiUrl + caminho, {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    }, TEMPO_LIMITE_MS);
  } catch {
    // Só cai aqui quando nem chegou à API (desligada, IP errado, sem rede ou tempo esgotado).
    throw new ErroApi('Não foi possível conectar à API em ' + apiUrl + '. Confira se ela está rodando e o endereço do servidor na tela de login.', 0);
  }

  let dados = null;
  try { dados = await resposta.json(); } catch { dados = null; }

  // 401 com token enviado = sessão não vale mais → o App faz logout e volta ao login.
  if (resposta.status === 401 && tokenAtual && aoSessaoExpirar) {
    aoSessaoExpirar((dados && dados.mensagem) || 'Sua sessão expirou. Entre novamente.');
  }

  if (!resposta.ok) {
    throw new ErroApi((dados && dados.mensagem) || 'A API respondeu com erro ' + resposta.status + '.', resposta.status);
  }
  return dados;
}

export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
  }
}

function query(parametros = {}) {
  const partes = Object.entries(parametros)
    .filter(function preenchido([, v]) { return v !== undefined && v !== null && v !== ''; })
    .map(function par([k, v]) { return encodeURIComponent(k) + '=' + encodeURIComponent(v); });
  return partes.length ? '?' + partes.join('&') : '';
}

// ----- Saúde -----
export function verificarApi() { return requisicao('/saude'); }

// ----- Autenticação -----
export function login(email, senha) { return requisicao('/auth/login', { metodo: 'POST', corpo: { email, senha } }); }
export function cadastrar(dados) { return requisicao('/auth/cadastro', { metodo: 'POST', corpo: dados }); }
export function sessaoAtual() { return requisicao('/auth/me'); }
export function logout() { return requisicao('/auth/logout', { metodo: 'POST' }); }

// ----- Máquinas (CRUD da entidade principal) -----
export function listarMaquinas(filtros) { return requisicao('/maquinas' + query(filtros)); }
export function buscarMaquina(id) { return requisicao('/maquinas/' + id); }
export function criarMaquina(dados) { return requisicao('/maquinas', { metodo: 'POST', corpo: dados }); }
export function atualizarMaquina(id, dados) { return requisicao('/maquinas/' + id, { metodo: 'PUT', corpo: dados }); }
export function excluirMaquina(id) { return requisicao('/maquinas/' + id, { metodo: 'DELETE' }); }

// ----- Solicitações de aluguel -----
export function listarSolicitacoes() { return requisicao('/solicitacoes'); }
export function criarSolicitacao(dados) { return requisicao('/solicitacoes', { metodo: 'POST', corpo: dados }); }
export function alterarStatusSolicitacao(id, status) { return requisicao('/solicitacoes/' + id + '/status', { metodo: 'PATCH', corpo: { status } }); }

// ----- Usuários (admin) -----
export function listarUsuarios() { return requisicao('/usuarios'); }
export function alterarNivelUsuario(id, nivel) { return requisicao('/usuarios/' + id + '/nivel', { metodo: 'PATCH', corpo: { nivel } }); }
