// Teste de ponta a ponta da API TRAKTO: CADASTRO → LOGIN → JWT → NÍVEL → PERMISSÃO → CRUD.
//
// Como usar (com o MySQL ligado e o banco populado):
//   Terminal 1:  npm run api
//   Terminal 2:  npm run test:api
//
// O teste usa a API de verdade (fetch → Express → MySQL) e cria/remove os
// próprios dados, então pode ser executado várias vezes.
import '../config/ambiente.js';

const API = process.env.API_URL || 'http://localhost:' + (process.env.PORT || 3000);
const SENHA_DEMO = process.env.SENHA_DEMO || 'trakto123';
let ok = 0;
let falhas = 0;

async function chamar(metodo, caminho, { token, corpo, bearer } = {}) {
  const cabecalhos = { Accept: 'application/json' };
  if (corpo !== undefined) { cabecalhos['Content-Type'] = 'application/json'; }
  if (token) { cabecalhos.Authorization = 'Bearer ' + token; }
  if (bearer !== undefined) { cabecalhos.Authorization = bearer; }
  const resposta = await fetch(API + caminho, { method: metodo, headers: cabecalhos, body: corpo === undefined ? undefined : JSON.stringify(corpo) });
  let dados = null;
  try { dados = await resposta.json(); } catch { dados = null; }
  return { status: resposta.status, dados };
}

function conferir(descricao, condicao, detalhe = '') {
  if (condicao) { ok += 1; console.log('  ✔ ' + descricao); }
  else { falhas += 1; console.log('  ✖ ' + descricao + (detalhe ? '  → ' + detalhe : '')); }
}

function secao(titulo) { console.log('\n' + titulo); }

function dataFutura(dias) {
  const d = new Date(); d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

async function entrar(email, senha = SENHA_DEMO) {
  const r = await chamar('POST', '/auth/login', { corpo: { email, senha } });
  if (r.status !== 200) { throw new Error('Login de ' + email + ' falhou (' + r.status + '): ' + (r.dados && r.dados.mensagem) + '. Rode "npm run db:popular -- --forcar".'); }
  return r.dados.token;
}

async function executar() {
  console.log('🚜 Testando a API TRAKTO em ' + API);

  secao('0. API e banco');
  const saude = await chamar('GET', '/saude').catch(function semApi() { return null; });
  if (!saude) { throw new Error('A API não respondeu. Rode "npm run api" em outro terminal.'); }
  conferir('GET /saude responde 200 com banco ok', saude.status === 200 && saude.dados.banco === 'ok', JSON.stringify(saude.dados));

  secao('1. Cadastro e proteção da senha');
  const email = 'teste' + Date.now() + '@trakto.com';
  const cadastro = await chamar('POST', '/auth/cadastro', { corpo: { nome: 'Usuário de Teste', email, telefone: '(51) 98888-0000', cidade: 'Lajeado', senha: 'senhaTeste1', nivel: 'admin' } });
  conferir('POST /auth/cadastro cria a conta (201)', cadastro.status === 201, JSON.stringify(cadastro.dados));
  conferir('cadastro público nunca cria admin (vira produtor)', cadastro.dados?.usuario?.nivel === 'produtor');
  conferir('resposta não expõe senha nem hash', !JSON.stringify(cadastro.dados).includes('senha'));
  const repetido = await chamar('POST', '/auth/cadastro', { corpo: { nome: 'Outro', email, telefone: '(51) 98888-0000', cidade: 'Lajeado', senha: 'senhaTeste1' } });
  conferir('e-mail repetido é recusado (409)', repetido.status === 409);
  const senhaCurta = await chamar('POST', '/auth/cadastro', { corpo: { nome: 'Fulano Teste', email: 'x' + email, telefone: '(51) 98888-0000', cidade: 'Lajeado', senha: '123' } });
  conferir('senha curta é recusada (400)', senhaCurta.status === 400);

  secao('2. Login e JWT');
  const errada = await chamar('POST', '/auth/login', { corpo: { email, senha: 'senhaErrada9' } });
  conferir('senha errada → 401', errada.status === 401);
  const loginNovo = await chamar('POST', '/auth/login', { corpo: { email, senha: 'senhaTeste1' } });
  conferir('login correto → 200 com token', loginNovo.status === 200 && typeof loginNovo.dados?.token === 'string');
  conferir('token tem o formato JWT (3 partes)', String(loginNovo.dados?.token).split('.').length === 3);
  conferir('login informa tipo Bearer e validade', loginNovo.dados?.tipo === 'Bearer' && Boolean(loginNovo.dados?.expiraEm));

  const produtor = await entrar('produtor@trakto.com');
  const proprietaria = await entrar('proprietario@trakto.com');
  const outroDono = await entrar('paulo@trakto.com');
  const admin = await entrar('admin@trakto.com');
  const me = await chamar('GET', '/auth/me', { token: produtor });
  conferir('GET /auth/me valida o token e devolve o usuário', me.status === 200 && me.dados.usuario.email === 'produtor@trakto.com');

  secao('3. Rotas protegidas');
  conferir('sem token → 401', (await chamar('GET', '/maquinas')).status === 401);
  conferir('token inválido → 401', (await chamar('GET', '/maquinas', { token: 'abc.def.ghi' })).status === 401);
  conferir('cabeçalho sem "Bearer" → 401', (await chamar('GET', '/maquinas', { bearer: produtor })).status === 401);
  // Adultera o payload (tenta virar admin) mantendo a assinatura antiga.
  const [cab, , assinatura] = produtor.split('.');
  const falso = Buffer.from(JSON.stringify({ sub: '3', nivel: 'admin', jti: 'x', exp: 9999999999 })).toString('base64url');
  conferir('token adulterado (virar admin) → 401', (await chamar('GET', '/usuarios', { token: cab + '.' + falso + '.' + assinatura })).status === 401);

  secao('4. Níveis e permissões no back-end');
  const novaMaquina = { nome: 'Máquina de Teste E2E', tipo: 'Trator', potencia: '80 cv', cidade: 'Lajeado', precoHora: 100, disponivel: true, comOperador: false, descricao: 'Criada pelo teste automático.' };
  conferir('produtor NÃO anuncia máquina → 403', (await chamar('POST', '/maquinas', { token: produtor, corpo: novaMaquina })).status === 403);
  conferir('produtor NÃO lista usuários → 403', (await chamar('GET', '/usuarios', { token: produtor })).status === 403);
  conferir('admin lista usuários → 200', (await chamar('GET', '/usuarios', { token: admin })).status === 200);
  const meuId = (await chamar('GET', '/auth/me', { token: admin })).dados.usuario.id;
  conferir('admin não altera o próprio nível → 409', (await chamar('PATCH', '/usuarios/' + meuId + '/nivel', { token: admin, corpo: { nivel: 'produtor' } })).status === 409);

  secao('5. CRUD de máquinas (entidade principal)');
  const criada = await chamar('POST', '/maquinas', { token: proprietaria, corpo: novaMaquina });
  conferir('CREATE: proprietária anuncia (201)', criada.status === 201, JSON.stringify(criada.dados));
  const id = criada.dados?.maquina?.id;
  const lida = await chamar('GET', '/maquinas/' + id, { token: produtor });
  conferir('READ: produtor vê o anúncio (200)', lida.status === 200 && lida.dados.nome === novaMaquina.nome);
  const lista = await chamar('GET', '/maquinas?tipo=Trator', { token: produtor });
  conferir('READ: lista com filtro devolve o anúncio', lista.status === 200 && lista.dados.some(function m(x) { return x.id === id; }));
  conferir('UPDATE por outro proprietário → 403 (não é o dono)', (await chamar('PUT', '/maquinas/' + id, { token: outroDono, corpo: novaMaquina })).status === 403);
  const editada = await chamar('PUT', '/maquinas/' + id, { token: proprietaria, corpo: { ...novaMaquina, precoHora: 120 } });
  conferir('UPDATE pelo dono (200) grava o novo preço', editada.status === 200 && editada.dados.maquina.precoHora === 120);

  secao('6. Solicitação de aluguel e ciclo de status');
  const pedido = await chamar('POST', '/solicitacoes', { token: produtor, corpo: { maquinaId: id, dataServico: dataFutura(7), horas: 5, observacao: 'Teste automático' } });
  conferir('produtor solicita (201)', pedido.status === 201, JSON.stringify(pedido.dados));
  const sid = pedido.dados?.solicitacao?.id;
  conferir('valor calculado pela API (120 × 5 = 600)', pedido.dados?.solicitacao?.valorTotal === 600);
  conferir('telefone do dono oculto antes do aceite', pedido.dados?.solicitacao?.proprietario?.telefone === null);
  conferir('produtor NÃO aceita o próprio pedido → 403', (await chamar('PATCH', '/solicitacoes/' + sid + '/status', { token: produtor, corpo: { status: 'aceita' } })).status === 403);
  const aceita = await chamar('PATCH', '/solicitacoes/' + sid + '/status', { token: proprietaria, corpo: { status: 'aceita' } });
  conferir('dona aceita (200) e o telefone é liberado', aceita.status === 200 && Boolean(aceita.dados.solicitacao.produtor.telefone));
  conferir('DELETE com aluguel aceito → 409', (await chamar('DELETE', '/maquinas/' + id, { token: proprietaria })).status === 409);
  conferir('não volta de "aceita" para "aceita" → 409', (await chamar('PATCH', '/solicitacoes/' + sid + '/status', { token: proprietaria, corpo: { status: 'aceita' } })).status === 409);
  conferir('dona conclui (200)', (await chamar('PATCH', '/solicitacoes/' + sid + '/status', { token: proprietaria, corpo: { status: 'concluida' } })).status === 200);
  const doProdutor = await chamar('GET', '/solicitacoes', { token: produtor });
  conferir('produtor só vê as próprias solicitações', doProdutor.status === 200 && doProdutor.dados.every(function s(x) { return x.produtor.email === undefined && x.produtorId === me.dados.usuario.id; }));

  secao('7. DELETE e logout');
  conferir('DELETE pelo dono (200)', (await chamar('DELETE', '/maquinas/' + id, { token: proprietaria })).status === 200);
  conferir('máquina excluída → 404', (await chamar('GET', '/maquinas/' + id, { token: proprietaria })).status === 404);
  const tokenSair = loginNovo.dados.token;
  conferir('POST /auth/logout (200)', (await chamar('POST', '/auth/logout', { token: tokenSair })).status === 200);
  conferir('token usado após o logout → 401', (await chamar('GET', '/auth/me', { token: tokenSair })).status === 401);

  console.log('\n' + (falhas === 0 ? '✅' : '❌') + ' ' + ok + ' verificações passaram, ' + falhas + ' falharam.');
  process.exitCode = falhas === 0 ? 0 : 1;
}

executar().catch(function erro(e) {
  console.error('\n❌ ' + e.message);
  process.exitCode = 1;
});
