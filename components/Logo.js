// Marca da TRAKTO: símbolo com sulcos de lavoura + nome.
import { StyleSheet, Text, View } from 'react-native';
import { cores } from './ui.js';

export default function Logo({ tamanho = 48, mostrarNome = true, claro = false }) {
  const sulco = { height: Math.max(3, tamanho * 0.08), borderRadius: 4, backgroundColor: cores.trigo };
  return <View style={css.linha}>
    <View style={[css.simbolo, { width: tamanho, height: tamanho, borderRadius: tamanho * 0.3 }]}>
      <Text style={[css.letra, { fontSize: tamanho * 0.5 }]}>T</Text>
      <View style={[css.sulcos, { gap: tamanho * 0.05, bottom: tamanho * 0.12 }]}>
        <View style={[sulco, { width: tamanho * 0.55 }]} />
        <View style={[sulco, { width: tamanho * 0.4, opacity: 0.7 }]} />
      </View>
    </View>
    {mostrarNome && <View>
      <Text style={[css.nome, { fontSize: tamanho * 0.48, color: claro ? '#FFFFFF' : cores.verdeEscuro }]}>TRAKTO</Text>
      <Text style={[css.slogan, { color: claro ? cores.trigo : cores.terra }]}>Conectando quem precisa com quem tem</Text>
    </View>}
  </View>;
}

const css = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  simbolo: { backgroundColor: cores.verde, alignItems: 'center', paddingTop: '8%', overflow: 'hidden' },
  letra: { color: '#FFFFFF', fontWeight: '900', lineHeight: undefined },
  sulcos: { position: 'absolute', alignItems: 'center' },
  nome: { fontWeight: '900', letterSpacing: 2 },
  slogan: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});
