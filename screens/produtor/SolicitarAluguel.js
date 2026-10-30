import { useState } from 'react';
import { Text, View } from 'react-native';
import { Aviso, Botao, Campo, Pagina, Painel, Vazio, cores, estilos, moeda } from '../components/ui.js';

// Formata a data enquanto o usuário digita: 05112026 → 05/11/2026.
function mascaraData(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  return [numeros.slice(0, 2), numeros.slice(2, 4), numeros.slice(4, 8)].filter(Boolean).join('/');
}

export default function SolicitarAluguel({ navigation, route, maquinas, criarSolicitacao }) {
  const maquina = maquinas.find(function mesma(m) { return m.id === route.params?.id; });
  const [data, setData] = useState('');
  const [horas, setHoras] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erro, setErro] = useState('');

  if (!maquina) { return <Pagina><Vazio titulo="Máquina não encontrada" texto="Volte e escolha outra máquina." /></Pagina>; }

  const qtdHoras = Number(horas.replace(',', '.')) || 0;
  const total = qtdHoras * maquina.precoHora;

  function enviar() {
    setErro('');
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) { setErro('Informe a data no formato dd/mm/aaaa.'); return; }
    if (qtdHoras <= 0 || qtdHoras > 200) { setErro('Informe uma quantidade de horas entre 1 e 200.'); return; }
    criarSolicitacao({ maquinaId: maquina.id, data, horas: qtdHoras, valorTotal: total, observacao: observacao.trim() });
    navigation.replace('MinhasSolicitacoes');
  }

  return <Pagina>
    <Painel>
      <Text style={estilos.etiqueta}>Você está solicitando</Text>
      <Text style={[estilos.texto, { fontWeight: '800', fontSize: 18 }]}>{maquina.nome}</Text>
      <Text style={estilos.subtitulo}>📍 {maquina.cidade} • {moeda(maquina.precoHora)} por hora</Text>
    </Painel>

    <Painel>
      <Aviso mensagem={erro} />
      <Campo rotulo="Data desejada" value={data} onChangeText={function v(t) { setData(mascaraData(t)); }} placeholder="dd/mm/aaaa" keyboardType="number-pad" />
      <Campo rotulo="Quantidade de horas" value={horas} onChangeText={setHoras} placeholder="Ex.: 6" keyboardType="decimal-pad" />
      <Campo rotulo="Observações (opcional)" value={observacao} onChangeText={setObservacao}
        placeholder="Ex.: preparo de solo, 3 hectares, precisa de operador" multiline style={{ minHeight: 90, textAlignVertical: 'top' }} maxLength={300} />
    </Painel>

    <Painel style={{ backgroundColor: cores.verdeClaro, borderColor: '#D3E0CB' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={estilos.subtitulo}>Valor estimado</Text>
        <Text style={{ color: cores.verdeEscuro, fontSize: 24, fontWeight: '900' }}>{moeda(total)}</Text>
      </View>
      <Text style={estilos.subtitulo}>O pagamento é combinado diretamente com o proprietário após a confirmação.</Text>
    </Painel>

    <Botao titulo="Enviar solicitação" onPress={enviar} />
  </Pagina>;
}
