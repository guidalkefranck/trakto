import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CartaoMaquina from '../../components/CartaoMaquina.js';
import { Campo, Chip, EstadoVazio, Pagina, Botao } from '../../components/ui/index.js';
import { TIPOS_MAQUINA } from '../../constants/negocio.js';
import { cores } from '../../theme/tema.js';

const ORDENS = [
  { valor: 'relevancia', titulo: 'Relevância' },
  { valor: 'menorPreco', titulo: 'Menor preço' },
  { valor: 'maiorPreco', titulo: 'Maior preço' },
];

export default function Maquinas({ navigation, maquinas, recarregar, carregando, erroCarga }) {
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);
  const [ordem, setOrdem] = useState('relevancia');

  const termo = busca.trim().toLowerCase();
  const filtradas = maquinas
    .filter(function filtrar(m) {
      const casaBusca = !termo || m.nome.toLowerCase().includes(termo) || m.cidade.toLowerCase().includes(termo) || m.tipo.toLowerCase().includes(termo);
      const casaTipo = tipo === 'Todos' || m.tipo === tipo;
      return casaBusca && casaTipo && (!somenteDisponiveis || m.disponivel);
    })
    .sort(function ordenar(a, b) {
      if (ordem === 'menorPreco') { return a.precoHora - b.precoHora; }
      if (ordem === 'maiorPreco') { return b.precoHora - a.precoHora; }
      return Number(b.disponivel) - Number(a.disponivel);
    });

  function limparFiltros() { setBusca(''); setTipo('Todos'); setSomenteDisponiveis(false); setOrdem('relevancia'); }

  return <Pagina aoAtualizar={recarregar} atualizando={carregando} erro={erroCarga}>
    <Campo icone="magnify" value={busca} onChangeText={setBusca} placeholder="Buscar por máquina, tipo ou cidade…"
      autoCorrect={false} returnKeyType="search" />

    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={css.chips}>
      <Chip titulo="Todos" icone="view-grid-outline" ativo={tipo === 'Todos'} onPress={function todos() { setTipo('Todos'); }} />
      {TIPOS_MAQUINA.map(function chip(t) {
        return <Chip key={t.nome} titulo={t.nome} icone={t.icone} ativo={tipo === t.nome} onPress={function escolher() { setTipo(t.nome); }} />;
      })}
    </ScrollView>

    <View style={css.barra}>
      <Chip titulo="Só disponíveis" icone={somenteDisponiveis ? 'checkbox-marked' : 'checkbox-blank-outline'} ativo={somenteDisponiveis}
        onPress={function alternar() { setSomenteDisponiveis(!somenteDisponiveis); }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={css.chips}>
        {ORDENS.map(function chip(o) {
          return <Chip key={o.valor} titulo={o.titulo} ativo={ordem === o.valor} onPress={function escolher() { setOrdem(o.valor); }} />;
        })}
      </ScrollView>
    </View>

    <Text style={css.contagem}>{filtradas.length} {filtradas.length === 1 ? 'máquina encontrada' : 'máquinas encontradas'}</Text>

    {filtradas.length === 0 && !carregando && <EstadoVazio icone="tractor-variant" titulo="Nenhuma máquina encontrada" texto="Tente outro termo de busca ou remova os filtros.">
      <Botao titulo="Limpar filtros" icone="filter-remove-outline" variante="secundario" compacto onPress={limparFiltros} />
    </EstadoVazio>}

    {filtradas.map(function cartao(m) {
      return <CartaoMaquina key={m.id} maquina={m} onPress={function abrir() { navigation.navigate('DetalhesMaquina', { id: m.id }); }} />;
    })}
  </Pagina>;
}

const css = StyleSheet.create({
  chips: { gap: 8, paddingRight: 8 },
  barra: { gap: 10 },
  contagem: { color: cores.textoSuave, fontSize: 13, fontWeight: '700' },
});
