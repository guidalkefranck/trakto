import { StyleSheet, Text, View } from 'react-native';
import { ICONES_TIPO } from '../services/dadosFicticios.js';
import { Botao, Pagina, Painel, Vazio, cores, estilos, moeda } from '../components/ui.js';

function Info({ rotulo, valor }) {
  return <View style={css.info}><Text style={css.infoRotulo}>{rotulo}</Text><Text style={css.infoValor}>{valor}</Text></View>;
}

export default function DetalhesMaquina({ navigation, route, usuario, usuarios, maquinas, removerMaquina }) {
  const maquina = maquinas.find(function mesma(m) { return m.id === route.params?.id; });
  if (!maquina) { return <Pagina><Vazio titulo="Máquina não encontrada" texto="Ela pode ter sido removida." /></Pagina>; }

  const dono = usuarios.find(function mesmo(u) { return u.id === maquina.proprietarioId; });
  const ehDono = maquina.proprietarioId === usuario.id;
  const ehAdmin = usuario.nivel === 'admin';

  function remover() {
    removerMaquina(maquina.id);
    navigation.goBack();
  }

  return <Pagina>
    <View style={css.capa}><Text style={{ fontSize: 72 }}>{ICONES_TIPO[maquina.tipo] || '🚜'}</Text></View>
    <View style={{ gap: 6 }}>
      <Text style={estilos.etiqueta}>{maquina.tipo}</Text>
      <Text style={estilos.titulo}>{maquina.nome}</Text>
      <Text style={estilos.subtitulo}>📍 {maquina.cidade}, RS</Text>
    </View>

    <Painel>
      <View style={estilos.linha}>
        <Info rotulo="Preço" valor={moeda(maquina.precoHora) + ' / h'} />
        <Info rotulo="Potência / porte" valor={maquina.potencia || '—'} />
        <Info rotulo="Situação" valor={maquina.disponivel ? 'Disponível' : 'Indisponível'} />
      </View>
      <View style={estilos.separador} />
      <Text style={estilos.texto}>{maquina.descricao}</Text>
    </Painel>

    <Painel>
      <Text style={estilos.etiqueta}>Anunciante</Text>
      <Text style={[estilos.texto, { fontWeight: '800' }]}>{dono ? dono.nome : 'Proprietário'}</Text>
      <Text style={estilos.subtitulo}>{dono ? dono.cidade + ', RS' : ''}</Text>
      <Text style={estilos.subtitulo}>O contato (WhatsApp) é liberado depois que o proprietário aceita a solicitação.</Text>
    </Painel>

    {/* Ações variam conforme o nível de usuário e o dono do anúncio. */}
    {usuario.nivel === 'produtor' && <Botao titulo={maquina.disponivel ? 'Solicitar aluguel' : 'Indisponível no momento'}
      disabled={!maquina.disponivel} onPress={function solicitar() { navigation.navigate('SolicitarAluguel', { id: maquina.id }); }} />}
    {(ehDono || ehAdmin) && <Botao titulo="Editar anúncio" variante="secundario"
      onPress={function editar() { navigation.navigate('FormularioMaquina', { id: maquina.id }); }} />}
    {(ehDono || ehAdmin) && <Botao titulo={ehAdmin && !ehDono ? 'Remover anúncio (moderação)' : 'Excluir anúncio'} variante="perigo" onPress={remover} />}
  </Pagina>;
}

const css = StyleSheet.create({
  capa: { height: 170, borderRadius: 22, backgroundColor: cores.terraClara, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, minWidth: 100, gap: 2 },
  infoRotulo: { color: cores.muted, fontSize: 12, fontWeight: '600' },
  infoValor: { color: cores.texto, fontSize: 15, fontWeight: '800' },
});
