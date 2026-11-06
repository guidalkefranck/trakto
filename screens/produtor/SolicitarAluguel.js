import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Aviso, Botao, Campo, Cartao, Chip, EstadoVazio, Icone, Pagina, estilos } from '../../components/ui/index.js';
import { LIMITE_HORAS, iconeDoTipo } from '../../constants/negocio.js';
import { dataParaApi, dataValidaFutura, mascaraData, moeda, numero } from '../../utils/formatadores.js';
import { cores, espaco, raio } from '../../theme/tema.js';

const HORAS_RAPIDAS = [2, 4, 6, 8];

export default function SolicitarAluguel({ navigation, route, maquinas, criarSolicitacao }) {
  const maquina = maquinas.find(function mesma(m) { return m.id === route.params?.id; });
  const [data, setData] = useState('');
  const [horas, setHoras] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!maquina) {
    return <Pagina><EstadoVazio icone="alert-circle-outline" titulo="Máquina não encontrada" texto="Volte e escolha outra máquina." /></Pagina>;
  }

  const qtdHoras = numero(horas);
  const total = qtdHoras * maquina.precoHora;

  async function enviar() {
    setErroGeral('');
    const e = {};
    if (!dataValidaFutura(data)) { e.data = 'Informe uma data válida, de hoje em diante (dd/mm/aaaa).'; }
    if (qtdHoras < LIMITE_HORAS.minimo || qtdHoras > LIMITE_HORAS.maximo) { e.horas = 'Informe entre ' + LIMITE_HORAS.minimo + ' e ' + LIMITE_HORAS.maximo + ' horas.'; }
    setErros(e);
    if (Object.keys(e).length > 0) { setErroGeral('Confira os campos destacados.'); return; }
    setEnviando(true);
    try {
      // O valor total NÃO é enviado: a API calcula com o preço gravado no banco.
      await criarSolicitacao({ maquinaId: maquina.id, dataServico: dataParaApi(data), horas: qtdHoras, observacao: observacao.trim() });
      navigation.replace('MinhasSolicitacoes');
    } catch (e) {
      setErroGeral(e.message);
      setEnviando(false);
    }
  }

  return <Pagina>
    <Cartao style={css.resumo}>
      <View style={css.resumoIcone}><Icone nome={iconeDoTipo(maquina.tipo)} tamanho={30} cor={cores.terra} /></View>
      <View style={{ flex: 1 }}>
        <Text style={estilos.etiqueta}>Você está solicitando</Text>
        <Text style={css.resumoNome} numberOfLines={2}>{maquina.nome}</Text>
        <Text style={estilos.pequeno}>{maquina.cidade} · {moeda(maquina.precoHora)}/hora{maquina.comOperador ? ' · com operador' : ''}</Text>
      </View>
    </Cartao>

    <Cartao>
      <Text style={estilos.etiqueta}>Detalhes do serviço</Text>
      <Aviso mensagem={erroGeral} />
      <Campo rotulo="Data desejada" icone="calendar-blank-outline" value={data} erro={erros.data}
        onChangeText={function v(t) { setData(mascaraData(t)); setErros({ ...erros, data: '' }); }} placeholder="dd/mm/aaaa" keyboardType="number-pad" />
      <Campo rotulo="Quantidade de horas" icone="timer-outline" value={horas} erro={erros.horas}
        onChangeText={function v(t) { setHoras(t.replace(/[^0-9,.]/g, '')); setErros({ ...erros, horas: '' }); }} placeholder="Ex.: 6" keyboardType="decimal-pad" />
      <View style={estilos.linha}>
        {HORAS_RAPIDAS.map(function chip(h) {
          return <Chip key={h} titulo={h + ' h'} ativo={qtdHoras === h} onPress={function escolher() { setHoras(String(h)); setErros({ ...erros, horas: '' }); }} />;
        })}
      </View>
      <Campo rotulo="Observações (opcional)" icone="text-box-outline" value={observacao} onChangeText={setObservacao} multiline maxLength={300}
        placeholder="Ex.: preparo de solo, 3 hectares, acesso por estrada de chão" />
    </Cartao>

    <View style={css.total}>
      <View style={css.totalLinha}><Text style={css.totalRotulo}>Valor por hora</Text><Text style={css.totalValorPequeno}>{moeda(maquina.precoHora)}</Text></View>
      <View style={css.totalLinha}><Text style={css.totalRotulo}>Horas</Text><Text style={css.totalValorPequeno}>× {qtdHoras || 0}</Text></View>
      <View style={css.divisor} />
      <View style={css.totalLinha}><Text style={css.totalTitulo}>Total estimado</Text><Text style={css.totalValor}>{moeda(total)}</Text></View>
      <Text style={css.totalNota}>O pagamento é combinado com o proprietário depois que ele aceitar o pedido.</Text>
    </View>

    <Botao titulo="Enviar solicitação" icone="send-outline" onPress={enviar} carregando={enviando} />
  </Pagina>;
}

const css = StyleSheet.create({
  resumo: { flexDirection: 'row', alignItems: 'center', gap: espaco.md + 2 },
  resumoIcone: { width: 60, height: 60, borderRadius: raio.lg, backgroundColor: cores.terraClara, alignItems: 'center', justifyContent: 'center' },
  resumoNome: { color: cores.texto, fontSize: 17, fontWeight: '800', marginVertical: 2 },
  total: { backgroundColor: cores.verdeEscuro, borderRadius: raio.xl, padding: espaco.xl, gap: espaco.sm },
  totalLinha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalRotulo: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  totalValorPequeno: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  divisor: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 4 },
  totalTitulo: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  totalValor: { color: cores.trigo, fontSize: 28, fontWeight: '900' },
  totalNota: { color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 17 },
});
