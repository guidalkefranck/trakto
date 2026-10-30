import { StyleSheet, Text, View } from 'react-native';
import Icone from './Icone.js';
import { cores, espaco, raio } from '../../theme/tema.js';

const TIPOS = {
  erro: { fundo: cores.erroClaro, cor: cores.erro, icone: 'alert-circle-outline' },
  sucesso: { fundo: cores.sucessoClaro, cor: cores.sucesso, icone: 'check-circle-outline' },
  info: { fundo: cores.infoClaro, cor: cores.info, icone: 'information-outline' },
};

export default function Aviso({ mensagem, tipo = 'erro' }) {
  if (!mensagem) { return null; }
  const t = TIPOS[tipo] || TIPOS.erro;
  return <View style={[css.aviso, { backgroundColor: t.fundo }]}>
    <Icone nome={t.icone} tamanho={20} cor={t.cor} />
    <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={[css.texto, { color: t.cor }]}>{mensagem}</Text>
  </View>;
}

const css = StyleSheet.create({
  aviso: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, padding: espaco.md + 2, borderRadius: raio.md },
  texto: { flex: 1, lineHeight: 21, fontWeight: '600' },
});
