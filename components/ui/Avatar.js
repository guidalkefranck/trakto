import { StyleSheet, Text, View } from 'react-native';
import { iniciais } from '../../utils/formatadores.js';
import { cores } from '../../theme/tema.js';

export default function Avatar({ nome, tamanho = 44, claro = false }) {
  return <View style={[css.avatar, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }, claro && css.claro]}>
    <Text style={[css.texto, { fontSize: tamanho * 0.38 }, claro && { color: cores.verdeEscuro }]}>{iniciais(nome)}</Text>
  </View>;
}

const css = StyleSheet.create({
  avatar: { backgroundColor: cores.verde, alignItems: 'center', justifyContent: 'center' },
  claro: { backgroundColor: cores.trigo },
  texto: { color: '#FFFFFF', fontWeight: '800' },
});
