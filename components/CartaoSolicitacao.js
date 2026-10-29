import { StyleSheet, Text, View } from 'react-native';
import { ICONES_TIPO } from '../services/dadosFicticios.js';
import { Painel, SeloStatus, cores, estilos, moeda } from './ui.js';

// Mostra uma solicitação de aluguel. As ações (botões) chegam como children,
// porque mudam conforme quem está vendo: produtor ou proprietário.
export default function CartaoSolicitacao({ solicitacao, maquina, pessoa, rotuloPessoa, children = null }) {
  return <Painel>
    <View style={css.topo}>
      <Text style={{ fontSize: 26 }}>{maquina ? ICONES_TIPO[maquina.tipo] : '🚜'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={css.nome} numberOfLines={1}>{maquina ? maquina.nome : 'Máquina removida'}</Text>
        <Text style={estilos.subtitulo}>📅 {solicitacao.data} • {solicitacao.horas} h • {moeda(solicitacao.valorTotal)}</Text>
      </View>
      <SeloStatus status={solicitacao.status} />
    </View>
    {pessoa && <Text style={estilos.subtitulo}>{rotuloPessoa}: <Text style={{ color: cores.texto, fontWeight: '700' }}>{pessoa.nome}</Text> ({pessoa.cidade})</Text>}
    {!!solicitacao.observacao && <Text style={[estilos.texto, css.obs]}>“{solicitacao.observacao}”</Text>}
    {solicitacao.status === 'aceita' && pessoa && <Text style={css.contato}>📞 Contato liberado: {pessoa.telefone}</Text>}
    {children}
  </Painel>;
}

const css = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '800' },
  obs: { backgroundColor: cores.fundo, borderRadius: 10, padding: 10, fontStyle: 'italic' },
  contato: { color: cores.verde, fontWeight: '800' },
});
