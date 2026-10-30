import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, fonte } from '../../theme/tema.js';

// Título de seção com link opcional à direita ("Ver todas").
export default function CabecalhoSecao({ titulo, acao = '', onAcao = undefined }) {
  return <View style={css.linha}>
    <Text style={css.titulo}>{titulo}</Text>
    {!!acao && <Pressable accessibilityRole="link" onPress={onAcao} hitSlop={8}><Text style={css.acao}>{acao}</Text></Pressable>}
  </View>;
}

const css = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  titulo: { color: cores.texto, fontSize: fonte.destaque, fontWeight: '800' },
  acao: { color: cores.verde, fontSize: fonte.pequena, fontWeight: '800' },
});
