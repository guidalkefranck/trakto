// Ponto central da TRAKTO: guarda a sessão e os dados, conversa com a API e
// repassa tudo às telas por Props (mesma arquitetura do projeto-modelo).
//
// Fluxo de sessão (Entrega 3):
//   LOGIN → API devolve o JWT → salvo no AsyncStorage (services/sessao.js)
//   → enviado em toda requisição como "Authorization: Bearer <token>"
//   → ao reabrir o app, o token salvo é validado em GET /auth/me
//   → LOGOUT revoga o token na API e apaga a sessão do aparelho.
import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Rotas from './navigation/Rotas.js';
import TelaAbertura from './components/TelaAbertura.js';
import { Toast } from './components/ui/index.js';
import { pode } from './constants/permissoes.js';
import * as api from './services/api.js';
import { lerSessao, limparSessao, salvarSessao } from './services/sessao.js';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [expiraEm, setExpiraEm] = useState(null);
  const [restaurando, setRestaurando] = useState(true);
  const [aviso, setAviso] = useState('');
  const [toast, setToast] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erroCarga, setErroCarga] = useState('');

  const fecharToast = useCallback(function fechar() { setToast(''); }, []);

  // Busca na API tudo o que o usuário logado pode ver (GET em paralelo).
  const carregarDados = useCallback(async function carregar(quem) {
    setCarregando(true);
    setErroCarga('');
    try {
      const [listaMaquinas, listaSolicitacoes, listaUsuarios] = await Promise.all([
        api.listarMaquinas(),
        api.listarSolicitacoes(),
        pode(quem, 'gerenciarUsuarios') ? api.listarUsuarios() : Promise.resolve([]),
      ]);
      setMaquinas(listaMaquinas);
      setSolicitacoes(listaSolicitacoes);
      setUsuarios(listaUsuarios);
    } catch (erro) {
      setErroCarga(erro.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const recarregar = useCallback(function recarregarDados() {
    return usuario ? carregarDados(usuario) : Promise.resolve();
  }, [usuario, carregarDados]);

  // Encerra a sessão só no aparelho (usado no logout e quando o token expira).
  const encerrarSessaoLocal = useCallback(async function encerrar(mensagem) {
    api.definirToken(null);
    await limparSessao();
    setUsuario(null); setExpiraEm(null);
    setMaquinas([]); setSolicitacoes([]); setUsuarios([]);
    setAviso(mensagem);
  }, []);

  // Ao abrir o app: tenta restaurar a sessão salva e confere o token na API.
  useEffect(function restaurarSessao() {
    api.quandoSessaoExpirar(function expirou(mensagem) { encerrarSessaoLocal(mensagem); });
    let ativo = true;
    (async function restaurar() {
      const salva = await lerSessao();
      if (salva) {
        api.definirToken(salva.token);
        try {
          const { usuario: atual, expiraEm: validade } = await api.sessaoAtual();
          if (!ativo) { return; }
          await salvarSessao({ ...salva, usuario: atual, expiraEm: validade });
          setUsuario(atual); setExpiraEm(validade);
          carregarDados(atual);
        } catch (erro) {
          if (!ativo) { return; }
          if (erro.status === 0) {
            // Sem conexão com a API: mantém a sessão salva e mostra o erro com "Tentar novamente".
            setUsuario(salva.usuario); setExpiraEm(salva.expiraEm);
            setErroCarga(erro.message);
          } else {
            await encerrarSessaoLocal('Sua sessão expirou. Entre novamente.');
          }
        }
      }
      if (ativo) { setRestaurando(false); }
    })();
    return function cancelar() { ativo = false; };
  }, [carregarDados, encerrarSessaoLocal]);

  // ---------- Sessão ----------
  // Retorna '' em caso de sucesso ou a mensagem de erro para a tela mostrar.
  async function entrar(email, senha) {
    try {
      const { token, usuario: logado, expiraEm: validade } = await api.login(email, senha);
      api.definirToken(token);
      await salvarSessao({ token, usuario: logado, expiraEm: validade });
      setAviso('');
      setUsuario(logado); setExpiraEm(validade);
      carregarDados(logado);
      return '';
    } catch (erro) {
      return erro.message;
    }
  }

  async function cadastrarUsuario(dados) {
    try {
      await api.cadastrar(dados);
      setAviso('Conta criada com sucesso! Agora é só entrar.');
      return '';
    } catch (erro) {
      return erro.message;
    }
  }

  // LOGOUT: revoga o token na API (ele deixa de valer) e apaga a sessão do aparelho.
  async function sair() {
    try { await api.logout(); } catch { /* sem conexão: a sessão local é apagada mesmo assim */ }
    await encerrarSessaoLocal('Você saiu da sua conta.');
  }

  // ---------- Ações: chamam a API e recarregam os dados. ----------
  // Em caso de erro, lançam a exceção para a tela mostrar a mensagem da API.
  async function salvarMaquina(dados) {
    const { id, ...campos } = dados;
    const resposta = id ? await api.atualizarMaquina(id, campos) : await api.criarMaquina(campos);
    await carregarDados(usuario);
    setToast(resposta.mensagem);
  }

  async function removerMaquina(id) {
    const resposta = await api.excluirMaquina(id);
    await carregarDados(usuario);
    setToast(resposta.mensagem);
  }

  async function criarSolicitacao(dados) {
    await api.criarSolicitacao(dados);
    await carregarDados(usuario);
    setToast('Solicitação enviada! Aguarde a resposta do proprietário.');
  }

  async function alterarStatus(id, status, mensagem = 'Solicitação atualizada.') {
    await api.alterarStatusSolicitacao(id, status);
    await carregarDados(usuario);
    setToast(mensagem);
  }

  async function alterarNivel(id, nivel) {
    await api.alterarNivelUsuario(id, nivel);
    await carregarDados(usuario);
    setToast('Nível de acesso atualizado.');
  }

  const contexto = {
    usuario, usuarios, maquinas, solicitacoes, aviso, carregando, erroCarga, expiraEm,
    entrar, cadastrarUsuario, sair, recarregar,
    salvarMaquina, removerMaquina, criarSolicitacao, alterarStatus, alterarNivel,
    mostrarToast: setToast,
  };

  return <SafeAreaProvider>
    <StatusBar style="dark" />
    {restaurando ? <TelaAbertura /> : <Rotas contexto={contexto} />}
    <Toast mensagem={toast} aoFechar={fecharToast} />
  </SafeAreaProvider>;
}
