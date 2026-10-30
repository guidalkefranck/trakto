import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Botao, BotaoConfirmar, Cartao, EstadoVazio, Icone, Pagina, estilos } from '../../components/ui/index.js';
import { iconeDoTipo } from '../../constants/negocio.js';
import { NIVEIS, pode, podeAlterarMaquina } from '../../constants/permissoes.js';
import { moeda } from '../../utils/formatadores.js';
import { cores, espaco, raio } from '../../theme/tema.js';

function Especificacao({ icone, rotulo, valor }) {
  return <View style={css.espec}>
    <Icone nome={icone} tamanho={20} cor={cores.verde} />
    <Text style={css.especRotulo}>{rotulo}</Text>
    <Text style={css.especValor}>{valor}</Text>
  </View>;
}

export default function DetalhesMaquina({ navigation, route, usuario, usuarios, maquinas, removerMaquina }) {
  const maquina = maquinas.find(function mesma(m) { return m.id === route.params?.id; });
  if (!maquina) {
    return <Pagina><EstadoVazio icone="alert-circle-outline" titulo="Máquina não encontrada" texto="Este anúncio pode ter sido removido." /></Pagina>;
  }

  const dono = usuarios.find(function mesmo(u) { return u.id === maquina.proprietarioId; });
  const ehDono = maquina.proprietarioId === usuario.id;
  const podeAlterar = podeAlterarMaquina(usuario, maquina);

  function remover() {
    removerMaquina(maquina.id, ehDono ? 'Anúncio excluído.' : 'Anúncio removido pela moderação.');
    navigation.goBack();
  }

  return <Pagina>
    <View style={css.capa}>
      <Icone nome={iconeDoTipo(maquina.tipo)} tamanho={96} cor={cores.terra} />
      <View style={css.capaTipo}><Text style={css.capaTipoTexto}>{maquina.tipo}</Text></View>
      {ehDono && <View style={css.capaDono}><Icone nome="star" tamanho={12} cor={cores.verdeEscuro} /><Text style={css.capaDonoTexto}>Seu anúncio</Text></View>}
    </View>

    <View style={{ gap: 6 }}>
      <Text style={estilos.titulo}>{maquina.nome}</Text>
      <View style={estilos.linha}>
        <Icone nome="map-marker-outline" tamanho={16} cor={cores.textoSuave} />
        <Text style={estilos.subtitulo}>{maquina.cidade}, RS</Text>
      </View>
    </View>

    <View style={css.precoLinha}>
      <View>
        <Text style={css.preco}>{moeda(maquina.precoHora)}</Text>
        <Text style={estilos.pequeno}>por hora de uso</Text>
      </View>
      <View style={[css.situacao, !maquina.disponivel && { backgroundColor: cores.erroClaro }]}>
        <Icone nome={maquina.disponivel ? 'check-circle' : 'close-circle'} tamanho={16} cor={maquina.disponivel ? cores.sucesso : cores.erro} />
        <Text style={{ color: maquina.disponivel ? cores.sucesso : cores.erro, fontWeight: '800' }}>{maquina.disponivel ? 'Disponível' : 'Indisponível'}</Text>
      </View>
    </View>

    <View style={css.especs}>
      <Especificacao icone="engine-outline" rotulo="Potência / porte" valor={maquina.potencia || '—'} />
      <Especificacao icone="account-hard-hat-outline" rotulo="Operador" valor={maquina.comOperador ? 'Incluso' : 'Não incluso'} />
      <Especificacao icone="shape-outline" rotulo="Categoria" valor={maquina.tipo} />
    </View>

    <Cartao>
      <Text style={estilos.etiqueta}>Sobre a máquina</Text>
      <Text style={estilos.texto}>{maquina.descricao || 'Sem descrição.'}</Text>
    </Cartao>

    <Cartao>
      <Text style={estilos.etiqueta}>Anunciante</Text>
      <View style={css.dono}>
        <Avatar nome={dono ? dono.nome : '?'} tamanho={46} />
        <View style={{ flex: 1 }}>
          <Text style={estilos.forte}>{dono ? dono.nome : 'Proprietário'}</Text>
          <Text style={estilos.pequeno}>{dono ? NIVEIS[dono.nivel].nome + ' · ' + dono.cidade : ''}</Text>
        </View>
      </View>
      {pode(usuario, 'solicitarAluguel') && <View style={css.info}>
        <Icone nome="lock-outline" tamanho={16} cor={cores.info} />
        <Text style={[estilos.pequeno, { flex: 1, color: cores.info }]}>O WhatsApp do anunciante é liberado assim que ele aceitar sua solicitação.</Text>
      </View>}
    </Cartao>

    {/* As ações dependem do nível e de quem é o dono do anúncio. */}
    {pode(usuario, 'solicitarAluguel') && <Botao titulo={maquina.disponivel ? 'Solicitar aluguel' : 'Indisponível no momento'} icone="calendar-check-outline"
      disabled={!maquina.disponivel} onPress={function solicitar() { navigation.navigate('SolicitarAluguel', { id: maquina.id }); }} />}
    {podeAlterar && <Botao titulo="Editar anúncio" icone="pencil-outline" variante="secundario"
      onPress={function editar() { navigation.navigate('FormularioMaquina', { id: maquina.id }); }} />}
    {podeAlterar && <BotaoConfirmar titulo={ehDono ? 'Excluir anúncio' : 'Remover anúncio (moderação)'}
      pergunta="Tem certeza? Esta ação não pode ser desfeita." tituloConfirmar="Sim, remover" onConfirmar={remover} />}
  </Pagina>;
}

const css = StyleSheet.create({
  capa: { height: 200, borderRadius: raio.xl, backgroundColor: cores.terraClara, alignItems: 'center', justifyContent: 'center' },
  capaTipo: { position: 'absolute', top: 14, left: 14, backgroundColor: cores.papel, paddingHorizontal: 10, paddingVertical: 5, borderRadius: raio.pilula },
  capaTipoTexto: { color: cores.terra, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  capaDono: { position: 'absolute', top: 14, right: 14, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: cores.trigo, paddingHorizontal: 10, paddingVertical: 5, borderRadius: raio.pilula },
  capaDonoTexto: { color: cores.verdeEscuro, fontSize: 12, fontWeight: '800' },
  precoLinha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: cores.papel, borderRadius: raio.xl, borderWidth: 1, borderColor: cores.borda, padding: espaco.lg },
  preco: { color: cores.verde, fontSize: 28, fontWeight: '900' },
  situacao: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: cores.sucessoClaro, paddingHorizontal: 12, paddingVertical: 8, borderRadius: raio.pilula },
  especs: { flexDirection: 'row', gap: espaco.sm },
  espec: { flex: 1, backgroundColor: cores.papel, borderRadius: raio.lg, borderWidth: 1, borderColor: cores.borda, padding: espaco.md, gap: 4 },
  especRotulo: { color: cores.textoSuave, fontSize: 11, fontWeight: '600' },
  especValor: { color: cores.texto, fontSize: 14, fontWeight: '800' },
  dono: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  info: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, backgroundColor: cores.infoClaro, borderRadius: raio.md, padding: espaco.md },
});
