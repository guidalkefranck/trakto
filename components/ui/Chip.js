import { Pressable, StyleSheet, Text } from 'react-native';
import Icone from './Icone.js';
import { cores, espaco, fonte, raio } from '../../theme/tema.js';

// Opção selecionável para filtros e escolhas (tipo de máquina, perfil, nível).
export default function Chip({ titulo, ativo = false, onPress, icone = undefined }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: ativo }} onPress={onPress}
    style={function estilo({ pressed }) { return [css.chip, ativo && css.ativo, pressed && { opacity: 0.75 }]; }}>
    {icone && <Icone nome={icone} tamanho={16} cor={ativo ? '#FFFFFF' : cores.verde} />}
    <Text style={[css.texto, ativo && { color: '#FFFFFF' }]}>{titulo}</Text>
  </Pressable>;
}

const css = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: espaco.md + 2, paddingVertical: espaco.sm, borderRadius: raio.pilula, borderWidth: 1, borderColor: cores.bordaForte, backgroundColor: cores.papel },
  ativo: { backgroundColor: cores.verde, borderColor: cores.verde },
  texto: { color: cores.texto, fontSize: fonte.pequena, fontWeight: '700' },
});
