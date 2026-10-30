import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icone } from './ui/index.js';
import { cores, espaco, raio, sombra } from '../theme/tema.js';

// Atalho em formato de bloco na tela inicial (ícone + título + descrição).
export default function AcaoRapida({ icone, titulo, descricao, onPress, contador = 0 }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={titulo} onPress={onPress}
    style={function estilo({ pressed }) { return [css.bloco, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]; }}>
    <View style={css.topo}>
      <View style={css.icone}><Icone nome={icone} tamanho={22} cor={cores.verde} /></View>
      {contador > 0 && <View style={css.badge}><Text style={css.badgeTexto}>{contador}</Text></View>}
    </View>
    <Text style={css.titulo}>{titulo}</Text>
    <Text style={css.descricao} numberOfLines={2}>{descricao}</Text>
  </Pressable>;
}

const css = StyleSheet.create({
  bloco: { flexGrow: 1, flexBasis: '45%', minWidth: 140, backgroundColor: cores.papel, borderRadius: raio.xl, borderWidth: 1, borderColor: cores.borda, padding: espaco.lg, gap: 4, ...sombra.leve },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  icone: { width: 42, height: 42, borderRadius: 13, backgroundColor: cores.verdeClaro, alignItems: 'center', justifyContent: 'center' },
  badge: { minWidth: 24, height: 24, paddingHorizontal: 6, borderRadius: 12, backgroundColor: cores.trigo, alignItems: 'center', justifyContent: 'center' },
  badgeTexto: { color: cores.verdeEscuro, fontWeight: '900', fontSize: 12 },
  titulo: { color: cores.texto, fontSize: 15, fontWeight: '800' },
  descricao: { color: cores.textoSuave, fontSize: 12, lineHeight: 17 },
});
