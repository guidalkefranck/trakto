// Ponto central da TRAKTO: guarda a sessão e os dados e repassa tudo às telas
// por Props (mesma arquitetura do projeto-modelo, sem Redux ou Context).
//
// ENTREGA 1: os dados vivem em memória (services/dadosFicticios.js).
// ENTREGA 2: cada função abaixo passará a chamar a API com fetch().
// ENTREGA 3: entrar() receberá um JWT da API e o enviará como Bearer Token.
import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Rotas from './navigation/Rotas.js';
import { Toast } from './components/ui/index.js';
import { maquinasIniciais, solicitacoesIniciais, usuariosIniciais } from './services/dadosFicticios.js';

function proximoId(lista) {
  return lista.reduce(function maior(maximo, item) { return Math.max(maximo, item.id); }, 0) + 1;
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [aviso, setAviso] = useState('');
  const [toast, setToast] = useState('');
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [maquinas, setMaquinas] = useState(maquinasIniciais);
  const [solicitacoes, setSolicitacoes] = useState(solicitacoesIniciais);

  const fecharToast = useCallback(function fechar() { setToast(''); }, []);

  // ---------- Sessão (provisória até a Entrega 3: hash + JWT) ----------
  function entrar(email, senha) {
    const encontrado = usuarios.find(function mesmoEmail(u) { return u.email === email; });
    if (!encontrado || encontrado.senha !== senha) { return 'E-mail ou senha inválidos.'; }
    setAviso('');
    setUsuario(encontrado);
    return '';
  }

  function cadastrarUsuario(dados) {
    if (usuarios.some(function mesmoEmail(u) { return u.email === dados.email; })) { return 'Este e-mail já está cadastrado.'; }
    setUsuarios(function adicionar(lista) { return [...lista, { ...dados, id: proximoId(lista) }]; });
    setAviso('Conta criada com sucesso! Agora é só entrar.');
    return '';
  }

  function sair() {
    setUsuario(null);
    setAviso('Você saiu da sua conta.');
  }

  // ---------- Máquinas (entidade principal — CRUD) ----------
  function salvarMaquina(dados) {
    if (dados.id) {
      setMaquinas(function editar(lista) { return lista.map(function trocar(m) { return m.id === dados.id ? { ...m, ...dados } : m; }); });
      setToast('Anúncio atualizado.');
    } else {
      setMaquinas(function adicionar(lista) { return [...lista, { ...dados, id: proximoId(lista), proprietarioId: usuario.id }]; });
      setToast('Máquina anunciada com sucesso!');
    }
  }

  function removerMaquina(id, mensagem = 'Anúncio removido.') {
    setMaquinas(function remover(lista) { return lista.filter(function manter(m) { return m.id !== id; }); });
    setToast(mensagem);
  }

  // ---------- Solicitações de aluguel ----------
  function criarSolicitacao(dados) {
    setSolicitacoes(function adicionar(lista) {
      return [{ ...dados, id: proximoId(lista), produtorId: usuario.id, status: 'pendente' }, ...lista];
    });
    setToast('Solicitação enviada! Aguarde a resposta do proprietário.');
  }

  function alterarStatus(id, status, mensagem = 'Solicitação atualizada.') {
    setSolicitacoes(function atualizar(lista) { return lista.map(function trocar(s) { return s.id === id ? { ...s, status } : s; }); });
    setToast(mensagem);
  }

  // ---------- Usuários (admin) ----------
  function alterarNivel(id, nivel) {
    setUsuarios(function atualizar(lista) { return lista.map(function trocar(u) { return u.id === id ? { ...u, nivel } : u; }); });
    setToast('Nível de acesso atualizado.');
  }

  const contexto = {
    usuario, usuarios, maquinas, solicitacoes, aviso,
    entrar, cadastrarUsuario, sair, salvarMaquina, removerMaquina, criarSolicitacao, alterarStatus, alterarNivel,
  };

  return <SafeAreaProvider>
    <StatusBar style="dark" />
    <Rotas contexto={contexto} />
    <Toast mensagem={toast} aoFechar={fecharToast} />
  </SafeAreaProvider>;
}
