import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Icone from './Icone.js';
import { cores, espaco, fonte, raio } from '../../theme/tema.js';

// Campo de formulário com rótulo, ícone opcional, dica, erro e "mostrar senha".
export default function Campo({ rotulo = '', icone = undefined, dica = '', erro = '', senha = false, multiline = false, style = undefined, ...props }) {
  const [focado, setFocado] = useState(false);
  const [visivel, setVisivel] = useState(false);
  return <View style={css.campo}>
    {!!rotulo && <Text style={css.rotulo}>{rotulo}</Text>}
    <View style={[css.caixa, multiline && css.caixaMulti, focado && css.focado, !!erro && css.comErro]}>
      {icone && <Icone nome={icone} tamanho={20} cor={focado ? cores.verde : cores.textoClaro} style={multiline ? { marginTop: 14 } : undefined} />}
      <TextInput accessibilityLabel={rotulo} placeholderTextColor={cores.textoClaro}
        style={[css.input, multiline && css.inputMulti, style]} multiline={multiline}
        secureTextEntry={senha && !visivel}
        onFocus={function f() { setFocado(true); }} onBlur={function b() { setFocado(false); }} {...props} />
      {senha && <Pressable accessibilityRole="button" accessibilityLabel={visivel ? 'Ocultar senha' : 'Mostrar senha'} hitSlop={10}
        onPress={function alternar() { setVisivel(!visivel); }}>
        <Icone nome={visivel ? 'eye-off-outline' : 'eye-outline'} tamanho={20} cor={cores.textoClaro} />
      </Pressable>}
    </View>
    {!!erro && <Text style={css.erro}>{erro}</Text>}
    {!erro && !!dica && <Text style={css.dica}>{dica}</Text>}
  </View>;
}

const css = StyleSheet.create({
  campo: { gap: 6 },
  rotulo: { fontSize: fonte.pequena, fontWeight: '700', color: cores.texto },
  caixa: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, minHeight: 52, paddingHorizontal: espaco.md + 2, borderRadius: raio.md, borderWidth: 1.5, borderColor: cores.borda, backgroundColor: '#FCFBF7' },
  caixaMulti: { alignItems: 'flex-start' },
  focado: { borderColor: cores.verde, backgroundColor: cores.papel },
  comErro: { borderColor: cores.erro },
  input: { flex: 1, color: cores.texto, fontSize: 16, paddingVertical: 14, outlineStyle: 'none' },
  inputMulti: { minHeight: 96, textAlignVertical: 'top' },
  dica: { fontSize: fonte.legenda, color: cores.textoSuave },
  erro: { fontSize: fonte.legenda, color: cores.erro, fontWeight: '600' },
});
