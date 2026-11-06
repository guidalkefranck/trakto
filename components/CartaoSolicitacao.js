import { StyleSheet, Text, View } from 'react-native';
import LinhaDoTempo from './LinhaDoTempo.js';
import { Avatar, Cartao, Icone, SeloStatus } from './ui/index.js';
import { iconeDoTipo } from '../constants/negocio.js';
import { dataDaApi, moeda } from '../utils/formatadores.js';
import { cores, espaco, raio } from '../theme/tema.js';

// Uma solicitação de aluguel, como vem da API (com máquina, produtor e proprietário).
// Os botões de ação chegam como children porque mudam conforme quem está vendo.
// O telefone só vem preenchido da API depois do aceite (regra garantida no servidor).
export default function CartaoSolicitacao({ solicitacao, pessoa, rotuloPessoa, children = null }) {
  const maquina = solicitacao.maquina;
  const contatoLiberado = Boolean(pessoa && pessoa.telefone);
  return <Cartao>
    <View style={css.topo}>
      <View style={css.icone}><Icone nome={maquina ? iconeDoTipo(maquina.tipo) : 'tractor'} tamanho={24} cor={cores.terra} /></View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={css.nome} numberOfLines={1}>{maquina ? maquina.nome : 'Máquina removida'}</Text>
        <Text style={css.pedido}>Pedido #{String(solicitacao.id).padStart(4, '0')}</Text>
      </View>
      <SeloStatus status={solicitacao.status} />
    </View>

    <View style={css.dados}>
      <Dado icone="calendar-blank-outline" texto={dataDaApi(solicitacao.dataServico)} />
      <Dado icone="timer-outline" texto={solicitacao.horas + ' h'} />
      <Dado icone="cash" texto={moeda(solicitacao.valorTotal)} destaque />
    </View>

    {!!solicitacao.observacao && <Text style={css.obs}>“{solicitacao.observacao}”</Text>}

    <LinhaDoTempo status={solicitacao.status} />

    {pessoa && <View style={css.pessoa}>
      <Avatar nome={pessoa.nome} tamanho={34} />
      <View style={{ flex: 1 }}>
        <Text style={css.pessoaRotulo}>{rotuloPessoa}</Text>
        <Text style={css.pessoaNome}>{pessoa.nome} · {pessoa.cidade}</Text>
      </View>
      {contatoLiberado
        ? <View style={css.contato}><Icone nome="whatsapp" tamanho={16} cor={cores.sucesso} /><Text style={css.contatoTexto}>{pessoa.telefone}</Text></View>
        : <Icone nome="lock-outline" tamanho={18} cor={cores.textoClaro} />}
    </View>}

    {children}
  </Cartao>;
}

function Dado({ icone, texto, destaque = false }) {
  return <View style={css.dado}>
    <Icone nome={icone} tamanho={16} cor={destaque ? cores.verde : cores.textoSuave} />
    <Text style={[css.dadoTexto, destaque && { color: cores.verde, fontWeight: '900' }]}>{texto}</Text>
  </View>;
}

const css = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  icone: { width: 46, height: 46, borderRadius: 14, backgroundColor: cores.terraClara, alignItems: 'center', justifyContent: 'center' },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '800' },
  pedido: { color: cores.textoClaro, fontSize: 12, fontWeight: '600' },
  dados: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.lg, paddingVertical: 2 },
  dado: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dadoTexto: { color: cores.texto, fontSize: 14, fontWeight: '600' },
  obs: { backgroundColor: cores.fundo, borderRadius: raio.md, padding: espaco.md, color: cores.textoSuave, fontStyle: 'italic', lineHeight: 20 },
  pessoa: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm + 2, paddingTop: espaco.md, borderTopWidth: 1, borderTopColor: cores.borda },
  pessoaRotulo: { color: cores.textoClaro, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  pessoaNome: { color: cores.texto, fontSize: 14, fontWeight: '700' },
  contato: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: cores.sucessoClaro, paddingHorizontal: 8, paddingVertical: 4, borderRadius: raio.pilula },
  contatoTexto: { color: cores.sucesso, fontSize: 12, fontWeight: '800' },
});
