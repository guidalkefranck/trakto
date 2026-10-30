import { StyleSheet, Text, View } from 'react-native';
import Icone from './Icone.js';
import { STATUS } from '../../constants/negocio.js';
import { cores, raio } from '../../theme/tema.js';

export default function SeloStatus({ status }) {
  const s = STATUS[status] || STATUS.pendente;
  return <View style={[css.selo, { backgroundColor: cores[s.fundo] }]}>
    <Icone nome={s.icone} tamanho={14} cor={cores[s.cor]} />
    <Text style={[css.texto, { color: cores[s.cor] }]}>{s.nome}</Text>
  </View>;
}

const css = StyleSheet.create({
  selo: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: raio.pilula },
  texto: { fontSize: 12, fontWeight: '800' },
});
