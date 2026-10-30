import { StyleSheet, Text, View } from 'react-native';
import { Icone } from './ui/index.js';
import { cores, espaco, raio } from '../theme/tema.js';

// Número de destaque usado nos painéis da tela inicial.
export default function Indicador({ numero, rotulo, icone }) {
  return <View style={css.caixa}>
    <View style={css.icone}><Icone nome={icone} tamanho={18} cor={cores.verde} /></View>
    <Text style={css.numero}>{numero}</Text>
    <Text style={css.rotulo}>{rotulo}</Text>
  </View>;
}

const css = StyleSheet.create({
  caixa: { flex: 1, minWidth: 96, backgroundColor: cores.papel, borderRadius: raio.lg, borderWidth: 1, borderColor: cores.borda, padding: espaco.md + 2, gap: 2 },
  icone: { width: 32, height: 32, borderRadius: 10, backgroundColor: cores.verdeClaro, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  numero: { color: cores.verdeEscuro, fontSize: 26, fontWeight: '900' },
  rotulo: { color: cores.textoSuave, fontSize: 12, fontWeight: '600', lineHeight: 16 },
});
