// Mapa de navegação da TRAKTO (React Navigation — native stack).
// Cada rota privada declara a permissão necessária; a pilha é montada apenas
// com as telas que o nível do usuário logado pode acessar.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/publico/Login.js';
import CadastroUsuario from '../screens/publico/CadastroUsuario.js';
import Home from '../screens/comum/Home.js';
import Maquinas from '../screens/comum/Maquinas.js';
import DetalhesMaquina from '../screens/comum/DetalhesMaquina.js';
import SolicitarAluguel from '../screens/produtor/SolicitarAluguel.js';
import MinhasSolicitacoes from '../screens/produtor/MinhasSolicitacoes.js';
import MinhasMaquinas from '../screens/proprietario/MinhasMaquinas.js';
import FormularioMaquina from '../screens/proprietario/FormularioMaquina.js';
import SolicitacoesRecebidas from '../screens/proprietario/SolicitacoesRecebidas.js';
import Usuarios from '../screens/admin/Usuarios.js';
import { pode } from '../constants/permissoes.js';
import { cores } from '../theme/tema.js';

const Stack = createNativeStackNavigator();

// permissao: null = qualquer usuário logado; lista = basta ter uma delas.
const ROTAS_PRIVADAS = [
  { nome: 'Home', tela: Home, titulo: 'Início', permissao: null, semCabecalho: true },
  { nome: 'Maquinas', tela: Maquinas, titulo: 'Máquinas', permissao: ['buscarMaquinas'] },
  { nome: 'DetalhesMaquina', tela: DetalhesMaquina, titulo: 'Detalhes', permissao: ['buscarMaquinas'] },
  { nome: 'SolicitarAluguel', tela: SolicitarAluguel, titulo: 'Solicitar aluguel', permissao: ['solicitarAluguel'] },
  { nome: 'MinhasSolicitacoes', tela: MinhasSolicitacoes, titulo: 'Minhas solicitações', permissao: ['verMinhasSolicitacoes'] },
  { nome: 'MinhasMaquinas', tela: MinhasMaquinas, titulo: 'Minhas máquinas', permissao: ['gerenciarMinhasMaquinas'] },
  { nome: 'FormularioMaquina', tela: FormularioMaquina, titulo: 'Máquina', permissao: ['gerenciarMinhasMaquinas', 'moderarAnuncios'] },
  { nome: 'SolicitacoesRecebidas', tela: SolicitacoesRecebidas, titulo: 'Solicitações', permissao: ['responderSolicitacoes', 'verTodasSolicitacoes'] },
  { nome: 'Usuarios', tela: Usuarios, titulo: 'Gerenciar usuários', permissao: ['gerenciarUsuarios'] },
];

function permitida(usuario, rota) {
  return rota.permissao === null || rota.permissao.some(function alguma(acao) { return pode(usuario, acao); });
}

function opcoesDaRota(rota) {
  if (rota.semCabecalho) { return { headerShown: false, title: rota.titulo }; }
  if (rota.nome === 'FormularioMaquina') {
    return function opcoes({ route }) { return { title: route.params?.id ? 'Editar máquina' : 'Nova máquina' }; };
  }
  return { title: rota.titulo };
}

const estiloCabecalho = {
  headerStyle: { backgroundColor: cores.fundo },
  headerTintColor: cores.verdeEscuro,
  headerTitleStyle: { fontWeight: '800' },
  headerShadowVisible: false,
  headerBackTitle: 'Voltar',
  contentStyle: { backgroundColor: cores.fundo },
  animation: 'slide_from_right',
};

// "contexto" leva para as telas os dados (usuário, máquinas, solicitações) e
// as ações (entrar, salvarMaquina, alterarStatus…) controlados pelo App.js.
export default function Rotas({ contexto }) {
  const { usuario } = contexto;
  return <NavigationContainer>
    <Stack.Navigator id="Trakto" screenOptions={estiloCabecalho}>
      {usuario === null ? (
        // Trocar o grupo ao entrar/sair limpa o histórico: "Voltar" não reabre uma sessão encerrada.
        <Stack.Group navigationKey="publico">
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {function telaLogin(props) { return <Login {...props} aoEntrar={contexto.entrar} aviso={contexto.aviso} />; }}
          </Stack.Screen>
          <Stack.Screen name="CadastroUsuario" options={{ title: 'Criar conta' }}>
            {function telaCadastro(props) { return <CadastroUsuario {...props} aoCadastrar={contexto.cadastrarUsuario} />; }}
          </Stack.Screen>
        </Stack.Group>
      ) : (
        <Stack.Group navigationKey={'sessao-' + usuario.id + '-' + usuario.nivel}>
          {ROTAS_PRIVADAS.filter(function filtrar(rota) { return permitida(usuario, rota); }).map(function criarTela(rota) {
            const Tela = rota.tela;
            return <Stack.Screen key={rota.nome} name={rota.nome} options={opcoesDaRota(rota)}>
              {function renderizar(props) { return <Tela {...props} {...contexto} />; }}
            </Stack.Screen>;
          })}
        </Stack.Group>
      )}
    </Stack.Navigator>
  </NavigationContainer>;
}
