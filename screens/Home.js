import { StyleSheet, Text, View } from 'react-native';
import { NIVEIS } from '../services/dadosFicticios.js';
import { Botao, Pagina, Painel, cores, estilos } from '../components/ui.js';

function Indicador({ numero, rotulo }) {
  return <View style={css.indicador}>
    <Text style={css.numero}>{numero}</Text>
    <Text style={css.rotuloIndicador}>{rotulo}</Text>
  </View>;
}

export default function Home({ navigation, usuario, maquinas, solicitacoes, usuarios, sair }) {
  function ir(tela) { return function navegar() { navigation.navigate(tela); }; }

  const disponiveis = maquinas.filter(function livre(m) { return m.disponivel; }).length;
  const minhasMaquinas = maquinas.filter(function minha(m) { return m.proprietarioId === usuario.id; });
  const idsMinhas = minhasMaquinas.map(function id(m) { return m.id; });
  const recebidasPendentes = solicitacoes.filter(function pendente(s) { return idsMinhas.includes(s.maquinaId) && s.status === 'pendente'; }).length;
  const minhasSolicitacoes = solicitacoes.filter(function minha(s) { return s.produtorId === usuario.id; });
  const ativas = minhasSolicitacoes.filter(function ativa(s) { return s.status === 'pendente' || s.status === 'aceita'; }).length;

  return <Pagina>
    <View style={css.boasVindas}>
      <Text style={estilos.etiqueta}>{NIVEIS[usuario.nivel]}</Text>
      <Text style={estilos.titulo}>Olá, {usuario.nome.split(' ')[0]} 👋</Text>
      <Text style={estilos.subtitulo}>{usuario.cidade} • {usuario.email}</Text>
    </View>

    {usuario.nivel === 'produtor' && <>
      <Painel style={css.cartaoVerde}>
        <Text style={[estilos.etiqueta, { color: cores.trigo }]}>Precisa de máquina?</Text>
        <Text style={css.tituloClaro}>{disponiveis} máquinas disponíveis na região</Text>
        <Botao titulo="Buscar máquinas" variante="destaque" onPress={ir('Maquinas')} />
      </Painel>
      <Painel>
        <View style={estilos.linha}>
          <Indicador numero={ativas} rotulo="aluguéis em andamento" />
          <Indicador numero={minhasSolicitacoes.length} rotulo="solicitações no total" />
        </View>
        <Botao titulo="Minhas solicitações" variante="secundario" onPress={ir('MinhasSolicitacoes')} />
      </Painel>
    </>}

    {usuario.nivel === 'proprietario' && <>
      <Painel style={css.cartaoVerde}>
        <Text style={[estilos.etiqueta, { color: cores.trigo }]}>Sua máquina gerando renda</Text>
        <Text style={css.tituloClaro}>{recebidasPendentes} {recebidasPendentes === 1 ? 'pedido aguardando' : 'pedidos aguardando'} sua resposta</Text>
        <Botao titulo="Ver solicitações recebidas" variante="destaque" onPress={ir('SolicitacoesRecebidas')} />
      </Painel>
      <Painel>
        <View style={estilos.linha}>
          <Indicador numero={minhasMaquinas.length} rotulo="máquinas anunciadas" />
          <Indicador numero={minhasMaquinas.filter(function livre(m) { return m.disponivel; }).length} rotulo="disponíveis agora" />
        </View>
        <Botao titulo="Minhas máquinas" variante="secundario" onPress={ir('MinhasMaquinas')} />
        <Botao titulo="Anunciar nova máquina" variante="secundario" onPress={ir('FormularioMaquina')} />
        <Botao titulo="Ver todas as máquinas" variante="secundario" onPress={ir('Maquinas')} />
      </Painel>
    </>}

    {usuario.nivel === 'admin' && <Painel>
      <Text style={estilos.etiqueta}>Painel administrativo</Text>
      <View style={estilos.linha}>
        <Indicador numero={usuarios.length} rotulo="usuários" />
        <Indicador numero={maquinas.length} rotulo="máquinas" />
        <Indicador numero={solicitacoes.length} rotulo="solicitações" />
      </View>
      <Botao titulo="Gerenciar usuários" onPress={ir('Usuarios')} />
      <Botao titulo="Moderar anúncios de máquinas" variante="secundario" onPress={ir('Maquinas')} />
      <Botao titulo="Acompanhar solicitações" variante="secundario" onPress={ir('SolicitacoesRecebidas')} />
    </Painel>}

    <Botao titulo="Sair" variante="perigo" onPress={sair} />
  </Pagina>;
}

const css = StyleSheet.create({
  boasVindas: { gap: 4, paddingTop: 4 },
  cartaoVerde: { backgroundColor: cores.verde, borderColor: cores.verde },
  tituloClaro: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', lineHeight: 29 },
  indicador: { flex: 1, minWidth: 90, backgroundColor: cores.fundo, borderRadius: 14, padding: 14, gap: 2 },
  numero: { color: cores.verdeEscuro, fontSize: 28, fontWeight: '900' },
  rotuloIndicador: { color: cores.muted, fontSize: 12, fontWeight: '600' },
});
