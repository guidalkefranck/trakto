import { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import CartaoMaquina from '../components/CartaoMaquina.js';
import { TIPOS_MAQUINA } from '../services/dadosFicticios.js';
import { Campo, Chip, Pagina, Vazio, estilos } from '../components/ui.js';

export default function Maquinas({ navigation, maquinas }) {
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);

  const termo = busca.trim().toLowerCase();
  const filtradas = maquinas.filter(function filtrar(m) {
    const casaBusca = !termo || m.nome.toLowerCase().includes(termo) || m.cidade.toLowerCase().includes(termo);
    const casaTipo = tipo === 'Todos' || m.tipo === tipo;
    return casaBusca && casaTipo && (!somenteDisponiveis || m.disponivel);
  });

  return <Pagina>
    <Campo rotulo="Buscar" value={busca} onChangeText={setBusca} placeholder="Nome da máquina ou cidade…" autoCorrect={false} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {['Todos', ...TIPOS_MAQUINA].map(function chip(t) {
        return <Chip key={t} titulo={t} ativo={tipo === t} onPress={function escolher() { setTipo(t); }} />;
      })}
    </ScrollView>
    <Chip titulo={somenteDisponiveis ? '✓ Somente disponíveis' : 'Somente disponíveis'} ativo={somenteDisponiveis}
      onPress={function alternar() { setSomenteDisponiveis(!somenteDisponiveis); }} />

    <Text style={estilos.subtitulo}>{filtradas.length} {filtradas.length === 1 ? 'máquina encontrada' : 'máquinas encontradas'}</Text>
    {filtradas.length === 0 && <Vazio titulo="Nenhuma máquina encontrada" texto="Tente outro termo de busca ou outro tipo." />}
    {filtradas.map(function cartao(m) {
      return <CartaoMaquina key={m.id} maquina={m} onPress={function abrir() { navigation.navigate('DetalhesMaquina', { id: m.id }); }} />;
    })}
  </Pagina>;
}
