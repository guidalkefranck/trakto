import { Text } from 'react-native';
import CartaoMaquina from '../components/CartaoMaquina.js';
import { Botao, Pagina, Vazio, estilos } from '../components/ui.js';

// Proprietário gerencia somente as máquinas que ele mesmo anunciou.
export default function MinhasMaquinas({ navigation, usuario, maquinas }) {
  const minhas = maquinas.filter(function minha(m) { return m.proprietarioId === usuario.id; });

  return <Pagina>
    <Botao titulo="+ Anunciar nova máquina" variante="destaque" onPress={function nova() { navigation.navigate('FormularioMaquina'); }} />
    <Text style={estilos.subtitulo}>Toque em uma máquina para ver, editar ou excluir o anúncio.</Text>
    {minhas.length === 0 && <Vazio titulo="Você ainda não anunciou máquinas" texto="Máquina parada não gera renda. Anuncie a primeira!" />}
    {minhas.map(function cartao(m) {
      return <CartaoMaquina key={m.id} maquina={m} onPress={function abrir() { navigation.navigate('DetalhesMaquina', { id: m.id }); }} />;
    })}
  </Pagina>;
}
