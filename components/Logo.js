// Marca da TRAKTO: um "T" com dois sulcos de lavoura em amarelo trigo.
import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme/tema.js';

export default function Logo({ tamanho = 48, mostrarNome = true, claro = false, slogan = true }) {
  const sulco = { height: Math.max(3, tamanho * 0.075), borderRadius: tamanho, backgroundColor: cores.trigo };
  return <View style={css.linha} accessibilityRole="image" accessibilityLabel="TRAKTO">
    <View style={[css.simbolo, { width: tamanho, height: tamanho, borderRadius: tamanho * 0.28 },
      claro && { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }]}>
      <Text style={[css.letra, { fontSize: tamanho * 0.5, lineHeight: tamanho * 0.56 }]}>T</Text>
      <View style={{ alignItems: 'center', gap: tamanho * 0.06, marginTop: tamanho * 0.04 }}>
        <View style={[sulco, { width: tamanho * 0.54 }]} />
        <View style={[sulco, { width: tamanho * 0.38, opacity: 0.75 }]} />
      </View>
    </View>
    {mostrarNome && <View>
      <Text style={[css.nome, { fontSize: tamanho * 0.46, color: claro ? '#FFFFFF' : cores.verdeEscuro }]}>TRAKTO</Text>
      {slogan && <Text style={[css.slogan, { color: claro ? cores.trigo : cores.terra }]}>Conectando quem precisa com quem tem</Text>}
    </View>}
  </View>;
}

const css = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  simbolo: { backgroundColor: cores.verde, alignItems: 'center', justifyContent: 'center' },
  letra: { color: '#FFFFFF', fontWeight: '900' },
  nome: { fontWeight: '900', letterSpacing: 2.5 },
  slogan: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
});
