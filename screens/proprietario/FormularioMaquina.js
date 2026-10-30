import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Aviso, Botao, Campo, Cartao, Chip, Pagina, estilos } from '../../components/ui/index.js';
import { TIPOS_MAQUINA } from '../../constants/negocio.js';
import { moeda, numero } from '../../utils/formatadores.js';
import { cores, espaco } from '../../theme/tema.js';

// Uma única tela para CADASTRAR (sem id) e EDITAR (com id) uma máquina — o "C" e o "U" do CRUD.
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
    comOperador: existente ? Boolean(existente.comOperador) : false,
  });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');

  function alterar(campo, valor) {
    setForm(function atualizar(atual) { return { ...atual, [campo]: valor }; });
    setErros(function limpar(atual) { return { ...atual, [campo]: '' }; });
  }

  function salvar() {
    setErroGeral('');
    const preco = numero(form.precoHora);
    const e = {};
    if (form.nome.trim().length < 3) { e.nome = 'Informe o nome da máquina (mínimo 3 letras).'; }
    if (!form.cidade.trim()) { e.cidade = 'Informe a cidade onde a máquina está.'; }
    if (!(preco > 0)) { e.precoHora = 'Informe um preço por hora maior que zero.'; }
    setErros(e);
    if (Object.keys(e).length > 0) { setErroGeral('Confira os campos destacados.'); return; }
    salvarMaquina({
      ...(existente ? { id: existente.id } : {}), ...form,
      nome: form.nome.trim(), cidade: form.cidade.trim(), potencia: form.potencia.trim(), descricao: form.descricao.trim(), precoHora: preco,
    });
    navigation.goBack();
  }

  return <Pagina>
    <View style={{ gap: 4 }}>
      <Text style={estilos.titulo}>{existente ? 'Editar anúncio' : 'Anunciar máquina'}</Text>
      <Text style={estilos.subtitulo}>{existente ? 'Atualize as informações e salve.' : 'Preencha os dados para produtores da região encontrarem sua máquina.'}</Text>
    </View>

    <Aviso mensagem={erroGeral} />

    <Cartao>
      <Text style={estilos.etiqueta}>Identificação</Text>
      <Campo rotulo="Nome da máquina" icone="tag-outline" value={form.nome} erro={erros.nome}
        onChangeText={function v(t) { alterar('nome', t); }} placeholder="Ex.: Trator Massey Ferguson 275" maxLength={120} />
      <Text style={css.rotulo}>Tipo</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {TIPOS_MAQUINA.map(function chip(t) {
          return <Chip key={t.nome} titulo={t.nome} icone={t.icone} ativo={form.tipo === t.nome} onPress={function escolher() { alterar('tipo', t.nome); }} />;
        })}
      </ScrollView>
      <Campo rotulo="Potência / porte" icone="engine-outline" value={form.potencia} onChangeText={function v(t) { alterar('potencia', t); }} placeholder="Ex.: 75 cv" maxLength={40} />
      <Campo rotulo="Descrição" icone="text-box-outline" value={form.descricao} multiline maxLength={500}
        onChangeText={function v(t) { alterar('descricao', t); }} placeholder="Estado de conservação, área recomendada, condições…"
        dica={form.descricao.length + '/500 caracteres'} />
    </Cartao>

    <Cartao>
      <Text style={estilos.etiqueta}>Preço e localização</Text>
      <Campo rotulo="Preço por hora (R$)" icone="cash" value={form.precoHora} erro={erros.precoHora}
        onChangeText={function v(t) { alterar('precoHora', t.replace(/[^0-9,.]/g, '')); }} placeholder="Ex.: 150" keyboardType="decimal-pad"
        dica={numero(form.precoHora) > 0 ? 'Uma diária de 8 h sai por ' + moeda(numero(form.precoHora) * 8) + '.' : ''} />
      <Campo rotulo="Cidade" icone="map-marker-outline" value={form.cidade} erro={erros.cidade}
        onChangeText={function v(t) { alterar('cidade', t); }} placeholder="Ex.: Estrela" />
    </Cartao>

    <Cartao>
      <Text style={estilos.etiqueta}>Condições</Text>
      <Opcao titulo="Disponível para aluguel" descricao="Desligue quando a máquina estiver em uso ou manutenção."
        valor={form.disponivel} aoMudar={function v(x) { alterar('disponivel', x); }} />
      <View style={estilos.separador} />
      <Opcao titulo="Vai com operador" descricao="Você ou alguém de confiança opera a máquina."
        valor={form.comOperador} aoMudar={function v(x) { alterar('comOperador', x); }} />
    </Cartao>

    <Botao titulo={existente ? 'Salvar alterações' : 'Publicar anúncio'} icone={existente ? 'content-save-outline' : 'check'} onPress={salvar} />
  </Pagina>;
}

function Opcao({ titulo, descricao, valor, aoMudar }) {
  return <View style={css.opcao}>
    <View style={{ flex: 1 }}>
      <Text style={estilos.forte}>{titulo}</Text>
      <Text style={estilos.pequeno}>{descricao}</Text>
    </View>
    <Switch value={valor} onValueChange={aoMudar} trackColor={{ true: cores.verdeMedio, false: cores.bordaForte }} thumbColor={valor ? cores.verde : '#FFFFFF'} accessibilityLabel={titulo} />
  </View>;
}

const css = StyleSheet.create({
  rotulo: { fontSize: 13, fontWeight: '700', color: cores.texto },
  opcao: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
});
