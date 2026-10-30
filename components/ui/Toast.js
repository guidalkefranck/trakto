import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icone from './Icone.js';
import { cores, espaco, raio, sombra } from '../../theme/tema.js';

// Mensagem flutuante de confirmação ("Solicitação enviada!"). Some sozinha.
export default function Toast({ mensagem, aoFechar, duracao = 3200 }) {
  const insets = useSafeAreaInsets();
  useEffect(function agendarFechamento() {
    if (!mensagem) { return undefined; }
    const timer = setTimeout(aoFechar, duracao);
    return function limpar() { clearTimeout(timer); };
  }, [mensagem, aoFechar, duracao]);

  if (!mensagem) { return null; }
  return <View pointerEvents="none" style={[css.posicao, { bottom: insets.bottom + espaco.xl }]}>
    <View style={css.toast}>
      <Icone nome="check-circle" tamanho={20} cor={cores.trigo} />
      <Text accessibilityLiveRegion="polite" style={css.texto}>{mensagem}</Text>
    </View>
  </View>;
}

const css = StyleSheet.create({
  posicao: { position: 'absolute', left: espaco.xl, right: espaco.xl, alignItems: 'center' },
  toast: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, maxWidth: 520, backgroundColor: cores.verdeEscuro, paddingVertical: espaco.md + 2, paddingHorizontal: espaco.lg + 2, borderRadius: raio.lg, ...sombra.media },
  texto: { color: '#FFFFFF', fontWeight: '700', flexShrink: 1 },
});
