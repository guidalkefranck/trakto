import { StyleSheet, Text, View } from 'react-native';
import CartaoMaquina from '../../components/CartaoMaquina.js';
import { Botao, EstadoVazio, Pagina, estilos } from '../../components/ui/index.js';
import { cores, espaco, raio } from '../../theme/tema.js';

// O proprietário gerencia somente as máquinas que ele mesmo anunciou.
export default function MinhasMaquinas({ navigation, usuario, maquinas }) {
  const minhas = maquinas.filter(function minha(m) { return m.proprietarioId === usuario.id; });
  const disponiveis = minhas.filter(function d(m) { return m.disponivel; }).length;

  function abrirFormulario() { navigation.navigate('FormularioMaquina'); }

  return <Pagina>
    <View style={css.resumo}>
      <View style={{ flex: 1 }}>
        <Text style={css.numero}>{minhas.length}</Text>
        <Text style={estilos.pequeno}>{minhas.length === 1 ? 'máquina anunciada' : 'máquinas anunciadas'} · {disponiveis} {disponiveis === 1 ? 'disponível' : 'disponíveis'}</Text>
      </View>
      <Botao titulo="Anunciar" icone="plus" variante="destaque" compacto onPress={abrirFormulario} />
    </View>

    {minhas.length === 0 && <EstadoVazio icone="tractor-variant" titulo="Você ainda não anunciou máquinas"
      texto="Máquina parada não gera renda. Anuncie a primeira e receba pedidos de produtores da região.">
      <Botao titulo="Anunciar minha primeira máquina" icone="plus" compacto onPress={abrirFormulario} />
    </EstadoVazio>}

    {minhas.map(function cartao(m) {
      return <CartaoMaquina key={m.id} maquina={m} onPress={function abrir() { navigation.navigate('DetalhesMaquina', { id: m.id }); }} />;
    })}
  </Pagina>;
}

const css = StyleSheet.create({
  resumo: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, backgroundColor: cores.papel, borderRadius: raio.xl, borderWidth: 1, borderColor: cores.borda, padding: espaco.lg },
  numero: { color: cores.verdeEscuro, fontSize: 28, fontWeight: '900' },
});
