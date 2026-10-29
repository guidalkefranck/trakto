// App controla a sessão e os dados; as telas recebem tudo por Props (mesma
// arquitetura do projeto-modelo, sem Redux ou Context).
// ENTREGA 1: os dados ficam em memória (services/dadosFicticios.js).
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './screens/Login.js';
import CadastroUsuario from './screens/CadastroUsuario.js';
import Home from './screens/Home.js';
import Maquinas from './screens/Maquinas.js';
import DetalhesMaquina from './screens/DetalhesMaquina.js';
import SolicitarAluguel from './screens/SolicitarAluguel.js';
import MinhasSolicitacoes from './screens/MinhasSolicitacoes.js';
import MinhasMaquinas from './screens/MinhasMaquinas.js';
import FormularioMaquina from './screens/FormularioMaquina.js';
import SolicitacoesRecebidas from './screens/SolicitacoesRecebidas.js';
import Usuarios from './screens/Usuarios.js';
import { maquinasIniciais, solicitacoesIniciais, usuariosIniciais } from './services/dadosFicticios.js';
import { cores } from './components/ui.js';

const Stack = createNativeStackNavigator();

function proximoId(lista) {
  return lista.reduce(function maior(maximo, item) { return Math.max(maximo, item.id); }, 0) + 1;
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [aviso, setAviso] = useState('');
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [maquinas, setMaquinas] = useState(maquinasIniciais);
  const [solicitacoes, setSolicitacoes] = useState(solicitacoesIniciais);

  // ---------- Sessão (provisória até a Entrega 3: JWT) ----------
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
    setAviso('Conta criada! Agora é só entrar com seu e-mail e senha.');
    return '';
  }

  function sair() {
    setUsuario(null);
    setAviso('Você saiu da sua conta.');
  }

  // ---------- Máquinas ----------
  function salvarMaquina(dados) {
    if (dados.id) {
      setMaquinas(function editar(lista) { return lista.map(function trocar(m) { return m.id === dados.id ? { ...m, ...dados } : m; }); });
    } else {
      setMaquinas(function adicionar(lista) { return [...lista, { ...dados, id: proximoId(lista), proprietarioId: usuario.id }]; });
    }
  }

  function removerMaquina(id) {
    setMaquinas(function remover(lista) { return lista.filter(function manter(m) { return m.id !== id; }); });
  }

  // ---------- Solicitações de aluguel ----------
  function criarSolicitacao(dados) {
    setSolicitacoes(function adicionar(lista) {
      return [{ ...dados, id: proximoId(lista), produtorId: usuario.id, status: 'pendente' }, ...lista];
    });
  }

  function alterarStatus(id, status) {
    setSolicitacoes(function atualizar(lista) { return lista.map(function trocar(s) { return s.id === id ? { ...s, status } : s; }); });
  }

  // ---------- Usuários (admin) ----------
  function alterarNivel(id, nivel) {
    setUsuarios(function atualizar(lista) { return lista.map(function trocar(u) { return u.id === id ? { ...u, nivel } : u; }); });
  }

  // Pacote de dados repassado às telas que precisam deles.
  const dados = { usuario, usuarios, maquinas, solicitacoes };

  return <SafeAreaProvider>
    <StatusBar style="dark" />
    <NavigationContainer>
      <Stack.Navigator id="Trakto" screenOptions={{
        headerStyle: { backgroundColor: cores.fundo }, headerTintColor: cores.verdeEscuro,
        headerTitleStyle: { fontWeight: '800' }, contentStyle: { backgroundColor: cores.fundo },
        headerShadowVisible: false, headerBackTitle: 'Voltar',
      }}>
        {usuario === null ? (
          <Stack.Group navigationKey="publico">
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {function telaLogin(props) { return <Login {...props} aoEntrar={entrar} aviso={aviso} />; }}
            </Stack.Screen>
            <Stack.Screen name="CadastroUsuario" options={{ title: 'Criar conta' }}>
              {function telaCadastro(props) { return <CadastroUsuario {...props} aoCadastrar={cadastrarUsuario} />; }}
            </Stack.Screen>
          </Stack.Group>
        ) : (
          <Stack.Group navigationKey={'sessao-' + usuario.id}>
            <Stack.Screen name="Home" options={{ title: 'TRAKTO' }}>
              {function telaHome(props) { return <Home {...props} {...dados} sair={sair} />; }}
            </Stack.Screen>
            <Stack.Screen name="Maquinas" options={{ title: 'Máquinas disponíveis' }}>
              {function telaMaquinas(props) { return <Maquinas {...props} {...dados} />; }}
            </Stack.Screen>
            <Stack.Screen name="DetalhesMaquina" options={{ title: 'Detalhes da máquina' }}>
              {function telaDetalhes(props) { return <DetalhesMaquina {...props} {...dados} removerMaquina={removerMaquina} />; }}
            </Stack.Screen>

            {/* As rotas abaixo aparecem conforme o nível. Na Entrega 3 a permissão
                também será validada no back-end (middleware JWT + nível). */}
            {usuario.nivel === 'produtor' && <Stack.Group>
              <Stack.Screen name="SolicitarAluguel" options={{ title: 'Solicitar aluguel' }}>
                {function telaSolicitar(props) { return <SolicitarAluguel {...props} {...dados} criarSolicitacao={criarSolicitacao} />; }}
              </Stack.Screen>
              <Stack.Screen name="MinhasSolicitacoes" options={{ title: 'Minhas solicitações' }}>
                {function telaMinhas(props) { return <MinhasSolicitacoes {...props} {...dados} alterarStatus={alterarStatus} />; }}
              </Stack.Screen>
            </Stack.Group>}

            {(usuario.nivel === 'proprietario' || usuario.nivel === 'admin') && <Stack.Group>
              <Stack.Screen name="MinhasMaquinas" options={{ title: 'Minhas máquinas' }}>
                {function telaMinhasMaquinas(props) { return <MinhasMaquinas {...props} {...dados} />; }}
              </Stack.Screen>
              <Stack.Screen name="FormularioMaquina" options={{ title: 'Máquina' }}>
                {function telaFormulario(props) { return <FormularioMaquina {...props} {...dados} salvarMaquina={salvarMaquina} />; }}
              </Stack.Screen>
              <Stack.Screen name="SolicitacoesRecebidas" options={{ title: 'Solicitações recebidas' }}>
                {function telaRecebidas(props) { return <SolicitacoesRecebidas {...props} {...dados} alterarStatus={alterarStatus} />; }}
              </Stack.Screen>
            </Stack.Group>}

            {usuario.nivel === 'admin' && <Stack.Screen name="Usuarios" options={{ title: 'Gerenciar usuários' }}>
              {function telaUsuarios(props) { return <Usuarios {...props} {...dados} alterarNivel={alterarNivel} />; }}
            </Stack.Screen>}
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>;
}
