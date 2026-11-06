// Ponto central da TRAKTO: guarda a sessão e os dados, conversa com a API e
// repassa tudo às telas por Props (mesma arquitetura do projeto-modelo).
//
// ENTREGA 2: todos os dados vêm do MySQL através da API (services/api.js → fetch()).
// ENTREGA 3: entrar() receberá um JWT, guardado no AsyncStorage e enviado como Bearer Token.
import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Rotas from './navigation/Rotas.js';
import { Toast } from './components/ui/index.js';
import { pode } from './constants/permissoes.js';
import * as api from './services/api.js';

export default function App() {
  const [usuario, setUsuario] = useState(null);
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

  // ---------- Sessão ----------
  // Retorna '' em caso de sucesso ou a mensagem de erro para a tela mostrar.
  async function entrar(email, senha) {
    try {
      const { usuario: logado } = await api.login(email, senha);
      api.definirSessao(logado);
      setAviso('');
      setUsuario(logado);
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

  function sair() {
    api.definirSessao(null);
    setUsuario(null);
    setMaquinas([]); setSolicitacoes([]); setUsuarios([]);
    setAviso('Você saiu da sua conta.');
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
    usuario, usuarios, maquinas, solicitacoes, aviso, carregando, erroCarga,
    entrar, cadastrarUsuario, sair, recarregar,
    salvarMaquina, removerMaquina, criarSolicitacao, alterarStatus, alterarNivel,
    mostrarToast: setToast,
  };

  return <SafeAreaProvider>
    <StatusBar style="dark" />
    <Rotas contexto={contexto} />
    <Toast mensagem={toast} aoFechar={fecharToast} />
  </SafeAreaProvider>;
}
