import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Icone from './Icone.js';
import { cores, espaco, fonte, raio } from '../../theme/tema.js';

const VARIANTES = {
  primario: { fundo: cores.verde, texto: '#FFFFFF', borda: cores.verde },
  destaque: { fundo: cores.trigo, texto: cores.verdeEscuro, borda: cores.trigo },
  secundario: { fundo: cores.papel, texto: cores.verde, borda: cores.bordaForte },
  suave: { fundo: cores.verdeClaro, texto: cores.verde, borda: cores.verdeClaro },
  perigo: { fundo: cores.erroClaro, texto: cores.erro, borda: '#EDCFC7' },
  claro: { fundo: 'rgba(255,255,255,0.14)', texto: '#FFFFFF', borda: 'rgba(255,255,255,0.28)' },
};

export default function Botao({ titulo, onPress, icone = undefined, variante = 'primario', disabled = false, carregando = false, compacto = false }) {
  const v = VARIANTES[variante] || VARIANTES.primario;
  const bloqueado = disabled || carregando;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={titulo} accessibilityState={{ disabled: bloqueado, busy: carregando }}
      disabled={bloqueado} onPress={onPress}
      style={function estilo({ pressed }) {
        return [css.botao, compacto && css.compacto, { backgroundColor: v.fundo, borderColor: v.borda },
          pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }, bloqueado && { opacity: 0.45 }];
      }}>
      {carregando ? <ActivityIndicator size="small" color={v.texto} /> : (icone && <Icone nome={icone} tamanho={compacto ? 18 : 20} cor={v.texto} />)}
      <Text style={[css.texto, compacto && { fontSize: fonte.pequena }, { color: v.texto }]}>{titulo}</Text>
    </Pressable>
  );
}

const css = StyleSheet.create({
  botao: { minHeight: 52, paddingHorizontal: espaco.xl, borderRadius: raio.lg, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: espaco.sm },
  compacto: { minHeight: 40, paddingHorizontal: espaco.lg, borderRadius: raio.md },
  texto: { fontSize: fonte.corpo, fontWeight: '800' },
});
