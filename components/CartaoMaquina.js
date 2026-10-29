import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ICONES_TIPO } from '../services/dadosFicticios.js';
import { cores, moeda } from './ui.js';

export default function CartaoMaquina({ maquina, onPress }) {
  return <Pressable accessibilityRole="button" onPress={onPress}
    style={function estilo({ pressed }) { return [css.cartao, pressed && { opacity: 0.7 }]; }}>
    <View style={css.icone}><Text style={{ fontSize: 30 }}>{ICONES_TIPO[maquina.tipo] || '🚜'}</Text></View>
    <View style={{ flex: 1, gap: 3 }}>
      <Text style={css.nome} numberOfLines={1}>{maquina.nome}</Text>
      <Text style={css.local}>📍 {maquina.cidade}, RS • {maquina.tipo}</Text>
      <View style={css.rodape}>
        <Text style={css.preco}>{moeda(maquina.precoHora)}<Text style={css.porHora}> / hora</Text></Text>
        <Text style={[css.disponivel, !maquina.disponivel && { color: cores.vermelho }]}>
          {maquina.disponivel ? '● Disponível' : '● Indisponível'}
        </Text>
      </View>
    </View>
  </Pressable>;
}

const css = StyleSheet.create({
  cartao: { flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: cores.papel, borderWidth: 1, borderColor: cores.borda, borderRadius: 18, padding: 14 },
  icone: { width: 64, height: 64, borderRadius: 16, backgroundColor: cores.terraClara, alignItems: 'center', justifyContent: 'center' },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '800' },
  local: { color: cores.muted, fontSize: 13 },
  rodape: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, flexWrap: 'wrap', gap: 6 },
  preco: { color: cores.verde, fontSize: 16, fontWeight: '900' },
  porHora: { color: cores.muted, fontSize: 12, fontWeight: '600' },
  disponivel: { color: cores.verde, fontSize: 12, fontWeight: '700' },
});
