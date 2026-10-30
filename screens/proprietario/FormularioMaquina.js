import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { TIPOS_MAQUINA } from '../services/dadosFicticios.js';
import { Aviso, Botao, Campo, Chip, Pagina, Painel, estilos } from '../components/ui.js';

// Uma única tela para CADASTRAR (sem id) e EDITAR (com id) uma máquina.
export default function FormularioMaquina({ navigation, route, usuario, maquinas, salvarMaquina }) {
  const existente = maquinas.find(function mesma(m) { return m.id === route.params?.id; });
  const [form, setForm] = useState({
    nome: existente?.nome || '',
    tipo: existente?.tipo || 'Trator',
    potencia: existente?.potencia || '',
    cidade: existente?.cidade || usuario.cidade || '',
    precoHora: existente ? String(existente.precoHora) : '',
    descricao: existente?.descricao || '',
    disponivel: existente ? existente.disponivel : true,
  });
  const [erro, setErro] = useState('');

  function alterar(campo, valor) { setForm(function atualizar(atual) { return { ...atual, [campo]: valor }; }); }

  function salvar() {
    setErro('');
    const preco = Number(form.precoHora.replace(',', '.'));
    if (!form.nome.trim() || !form.cidade.trim()) { setErro('Informe o nome da máquina e a cidade.'); return; }
    if (!(preco > 0)) { setErro('Informe um preço por hora maior que zero.'); return; }
    salvarMaquina({ ...(existente ? { id: existente.id } : {}), ...form, nome: form.nome.trim(), cidade: form.cidade.trim(), precoHora: preco });
    navigation.goBack();
  }

  return <Pagina>
    <Text style={estilos.titulo}>{existente ? 'Editar anúncio' : 'Anunciar máquina'}</Text>
    <Painel>
      <Aviso mensagem={erro} />
      <Campo rotulo="Nome da máquina" value={form.nome} onChangeText={function v(t) { alterar('nome', t); }} placeholder="Ex.: Trator Massey Ferguson 275" maxLength={120} />
      <Text style={[estilos.texto, { fontWeight: '700' }]}>Tipo</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {TIPOS_MAQUINA.map(function chip(t) {
          return <Chip key={t} titulo={t} ativo={form.tipo === t} onPress={function escolher() { alterar('tipo', t); }} />;
        })}
      </ScrollView>
      <Campo rotulo="Potência / porte" value={form.potencia} onChangeText={function v(t) { alterar('potencia', t); }} placeholder="Ex.: 75 cv" />
      <Campo rotulo="Cidade" value={form.cidade} onChangeText={function v(t) { alterar('cidade', t); }} placeholder="Ex.: Estrela" />
      <Campo rotulo="Preço por hora (R$)" value={form.precoHora} onChangeText={function v(t) { alterar('precoHora', t); }} placeholder="Ex.: 150" keyboardType="decimal-pad" />
      <Campo rotulo="Descrição" value={form.descricao} onChangeText={function v(t) { alterar('descricao', t); }}
        placeholder="Estado de conservação, se vai com operador, área recomendada…" multiline style={{ minHeight: 100, textAlignVertical: 'top' }} maxLength={500} />
      <View style={estilos.linha}>
        <Chip titulo="Disponível" ativo={form.disponivel} onPress={function sim() { alterar('disponivel', true); }} />
        <Chip titulo="Indisponível" ativo={!form.disponivel} onPress={function nao() { alterar('disponivel', false); }} />
      </View>
    </Painel>
    <Botao titulo={existente ? 'Salvar alterações' : 'Publicar anúncio'} onPress={salvar} />
  </Pagina>;
}
