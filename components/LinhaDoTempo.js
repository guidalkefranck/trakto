import { StyleSheet, Text, View } from 'react-native';
import { Icone } from './ui/index.js';
import { cores } from '../theme/tema.js';

// Mostra em que etapa a solicitação está: Enviada → Aceita → Concluída.
const ETAPAS = ['Enviada', 'Aceita', 'Concluída'];
const POSICAO = { pendente: 0, aceita: 1, concluida: 2 };

export default function LinhaDoTempo({ status }) {
  const encerrada = status === 'recusada' || status === 'cancelada';
  const atual = encerrada ? 0 : POSICAO[status] ?? 0;
  return <View style={css.linha}>
    {ETAPAS.map(function etapa(nome, i) {
      const feita = i <= atual;
      const falhou = encerrada && i === 1;
      const cor = falhou ? cores.erro : feita ? cores.verde : cores.bordaForte;
      const rotulo = falhou ? (status === 'recusada' ? 'Recusada' : 'Cancelada') : nome;
      return <View key={nome} style={css.etapa}>
        <View style={css.trilho}>
          {i > 0 && <View style={[css.barra, { backgroundColor: i <= atual || falhou ? cor : cores.borda }]} />}
          <View style={[css.ponto, { backgroundColor: feita || falhou ? cor : cores.papel, borderColor: cor }]}>
            {(feita || falhou) && <Icone nome={falhou ? 'close' : 'check'} tamanho={11} cor="#FFFFFF" />}
          </View>
          {i < ETAPAS.length - 1 && <View style={[css.barra, { backgroundColor: i < atual ? cores.verde : cores.borda }]} />}
        </View>
        <Text style={[css.rotulo, { color: feita || falhou ? cor : cores.textoClaro }]}>{rotulo}</Text>
      </View>;
    })}
  </View>;
}

const css = StyleSheet.create({
  linha: { flexDirection: 'row' },
  etapa: { flex: 1, alignItems: 'center', gap: 4 },
  trilho: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch' },
  barra: { flex: 1, height: 2 },
  ponto: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  rotulo: { fontSize: 11, fontWeight: '700' },
});
