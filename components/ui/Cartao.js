import { Pressable, StyleSheet, View } from 'react-native';
import { cores, espaco, raio, sombra } from '../../theme/tema.js';

// Superfície branca padrão. Se receber onPress, vira um cartão tocável.
export default function Cartao({ children, onPress = undefined, style = undefined, rotulo = undefined }) {
  if (onPress) {
    return <Pressable accessibilityRole="button" accessibilityLabel={rotulo} onPress={onPress}
      style={function estilo({ pressed }) { return [css.cartao, style, pressed && css.pressionado]; }}>
      {children}
    </Pressable>;
  }
  return <View style={[css.cartao, style]}>{children}</View>;
}

const css = StyleSheet.create({
  cartao: { backgroundColor: cores.papel, borderWidth: 1, borderColor: cores.borda, borderRadius: raio.xl, padding: espaco.xl, gap: espaco.md, ...sombra.leve },
  pressionado: { opacity: 0.75, transform: [{ scale: 0.99 }] },
});
