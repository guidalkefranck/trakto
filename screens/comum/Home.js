import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AcaoRapida from '../../components/AcaoRapida.js';
import CartaoMaquina from '../../components/CartaoMaquina.js';
import Indicador from '../../components/Indicador.js';
import { Avatar, Botao, CabecalhoSecao, Icone, Pagina, estilos } from '../../components/ui/index.js';
import { NIVEIS, pode } from '../../constants/permissoes.js';
import { COMISSAO_TRAKTO } from '../../constants/negocio.js';
import { moeda, primeiroNome } from '../../utils/formatadores.js';
import { cores, espaco, raio } from '../../theme/tema.js';

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) { return 'Bom dia'; }
  if (hora < 18) { return 'Boa tarde'; }
  return 'Boa noite';
}

export default function Home({ navigation, usuario, usuarios, maquinas, solicitacoes, sair, recarregar, carregando, erroCarga }) {
  const insets = useSafeAreaInsets();
  function ir(tela, params = undefined) { return function navegar() { navigation.navigate(tela, params); }; }

  // ----- Números de cada perfil -----
  const disponiveis = maquinas.filter(function livre(m) { return m.disponivel; });
  const minhasMaquinas = maquinas.filter(function minha(m) { return m.proprietarioId === usuario.id; });
  const idsMinhas = minhasMaquinas.map(function id(m) { return m.id; });
  const recebidas = solicitacoes.filter(function daMinha(s) { return idsMinhas.includes(s.maquinaId); });
  const recebidasPendentes = recebidas.filter(function p(s) { return s.status === 'pendente'; }).length;
  const ganhos = recebidas.filter(function c(s) { return s.status === 'concluida'; })
    .reduce(function soma(total, s) { return total + s.valorTotal * (1 - COMISSAO_TRAKTO); }, 0);
  const minhasSolicitacoes = solicitacoes.filter(function minha(s) { return s.produtorId === usuario.id; });
  const emAndamento = minhasSolicitacoes.filter(function a(s) { return s.status === 'pendente' || s.status === 'aceita'; }).length;
  const pendentesGerais = solicitacoes.filter(function p(s) { return s.status === 'pendente'; }).length;
  // Recomendadas: disponíveis, primeiro as da cidade do usuário.
  const recomendadas = [...disponiveis].sort(function ordenar(a, b) {
    return Number(b.cidade === usuario.cidade) - Number(a.cidade === usuario.cidade);
  }).slice(0, 3);

  return <Pagina semPadding aoAtualizar={recarregar} atualizando={carregando} erro={erroCarga}>
    {/* Cabeçalho com saudação, perfil e sair */}
    <View style={[css.topo, { paddingTop: insets.top + espaco.lg }]}>
      <View style={css.topoInterno}>
      <View style={css.linhaTopo}>
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir meu perfil" onPress={ir('Perfil')}>
          <Avatar nome={usuario.nome} tamanho={46} claro />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={css.saudacao}>{saudacao()},</Text>
          <Text style={css.nome}>{primeiroNome(usuario.nome)}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Sair da conta" onPress={sair} hitSlop={8} style={css.sair}>
          <Icone nome="logout" tamanho={20} cor="#FFFFFF" />
        </Pressable>
      </View>
      <View style={css.nivel}>
        <Icone nome={NIVEIS[usuario.nivel].icone} tamanho={14} cor={cores.verdeEscuro} />
        <Text style={css.nivelTexto}>{NIVEIS[usuario.nivel].nome}</Text>
        <Text style={css.nivelCidade}>· {usuario.cidade}</Text>
      </View>

      {pode(usuario, 'solicitarAluguel') && <Pressable accessibilityRole="search" onPress={ir('Maquinas')} style={css.busca}>
        <Icone nome="magnify" tamanho={22} cor={cores.textoClaro} />
        <Text style={css.buscaTexto}>Buscar tratores, implementos…</Text>
      </Pressable>}
      </View>
    </View>

    <View style={css.corpo}>
      {/* ================= PRODUTOR ================= */}
      {usuario.nivel === 'produtor' && <>
        <View style={estilos.linha}>
          <Indicador numero={disponiveis.length} rotulo="máquinas disponíveis" icone="tractor" />
          <Indicador numero={emAndamento} rotulo="aluguéis em andamento" icone="progress-clock" />
        </View>
        <View style={css.grade}>
          <AcaoRapida icone="magnify" titulo="Buscar máquinas" descricao="Filtre por tipo, cidade e disponibilidade" onPress={ir('Maquinas')} />
          <AcaoRapida icone="clipboard-text-clock-outline" titulo="Minhas solicitações" descricao="Acompanhe seus pedidos" onPress={ir('MinhasSolicitacoes')} contador={emAndamento} />
        </View>
        <CabecalhoSecao titulo="Recomendadas para você" acao="Ver todas" onAcao={ir('Maquinas')} />
        {recomendadas.map(function cartao(m) {
          return <CartaoMaquina key={m.id} maquina={m} onPress={ir('DetalhesMaquina', { id: m.id })} />;
        })}
      </>}

      {/* ================= PROPRIETÁRIO ================= */}
      {usuario.nivel === 'proprietario' && <>
        {recebidasPendentes > 0 && <Pressable onPress={ir('SolicitacoesRecebidas')} style={css.alerta}>
          <View style={css.alertaIcone}><Icone nome="bell-ring-outline" tamanho={22} cor={cores.verdeEscuro} /></View>
          <View style={{ flex: 1 }}>
            <Text style={css.alertaTitulo}>{recebidasPendentes} {recebidasPendentes === 1 ? 'pedido aguardando' : 'pedidos aguardando'} resposta</Text>
            <Text style={css.alertaTexto}>Responda rápido para fechar o aluguel.</Text>
          </View>
          <Icone nome="chevron-right" tamanho={24} cor="#FFFFFF" />
        </Pressable>}
        <View style={estilos.linha}>
          <Indicador numero={minhasMaquinas.length} rotulo="máquinas anunciadas" icone="tractor-variant" />
          <Indicador numero={recebidas.length} rotulo="pedidos recebidos" icone="inbox-arrow-down-outline" />
        </View>
        <View style={css.ganhos}>
          <Text style={css.ganhosRotulo}>Renda gerada com aluguéis concluídos</Text>
          <Text style={css.ganhosValor}>{moeda(ganhos)}</Text>
          <Text style={estilos.pequeno}>Já descontada a comissão TRAKTO de {Math.round(COMISSAO_TRAKTO * 100)}%.</Text>
        </View>
        <View style={css.grade}>
          <AcaoRapida icone="tractor-variant" titulo="Minhas máquinas" descricao="Edite ou exclua anúncios" onPress={ir('MinhasMaquinas')} />
          <AcaoRapida icone="inbox-arrow-down-outline" titulo="Solicitações" descricao="Aceite ou recuse pedidos" onPress={ir('SolicitacoesRecebidas')} contador={recebidasPendentes} />
          <AcaoRapida icone="plus-circle-outline" titulo="Anunciar máquina" descricao="Coloque sua máquina para render" onPress={ir('FormularioMaquina')} />
          <AcaoRapida icone="magnify" titulo="Ver mercado" descricao="Veja outros anúncios da região" onPress={ir('Maquinas')} />
        </View>
      </>}

      {/* ================= ADMIN ================= */}
      {usuario.nivel === 'admin' && <>
        <View style={estilos.linha}>
          <Indicador numero={usuarios.length} rotulo="usuários" icone="account-group-outline" />
          <Indicador numero={maquinas.length} rotulo="anúncios" icone="tractor" />
          <Indicador numero={pendentesGerais} rotulo="pedidos pendentes" icone="clock-outline" />
        </View>
        <View style={css.grade}>
          <AcaoRapida icone="account-cog-outline" titulo="Usuários" descricao="Gerencie níveis de acesso" onPress={ir('Usuarios')} />
          <AcaoRapida icone="shield-check-outline" titulo="Moderar anúncios" descricao="Edite ou remova anúncios" onPress={ir('Maquinas')} />
          <AcaoRapida icone="clipboard-list-outline" titulo="Solicitações" descricao="Acompanhe todos os pedidos" onPress={ir('SolicitacoesRecebidas')} contador={pendentesGerais} />
        </View>
      </>}

      <Botao titulo="Meu perfil e sessão" icone="account-circle-outline" variante="secundario" onPress={ir('Perfil')} />
      <Botao titulo="Sair da conta" icone="logout" variante="secundario" onPress={sair} />
    </View>
  </Pagina>;
}

const css = StyleSheet.create({
  topo: { backgroundColor: cores.verde, paddingHorizontal: espaco.xl, paddingBottom: espaco.xxl, gap: espaco.md, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  topoInterno: { width: '100%', maxWidth: 680, alignSelf: 'center', gap: espaco.md },
  linhaTopo: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  saudacao: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  nome: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  sair: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  nivel: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', backgroundColor: cores.trigo, paddingHorizontal: 10, paddingVertical: 5, borderRadius: raio.pilula },
  nivelTexto: { color: cores.verdeEscuro, fontSize: 12, fontWeight: '800' },
  nivelCidade: { color: cores.verdeEscuro, fontSize: 12, fontWeight: '600' },
  busca: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, backgroundColor: cores.papel, borderRadius: raio.lg, paddingHorizontal: espaco.lg, minHeight: 52, marginTop: 4 },
  buscaTexto: { color: cores.textoClaro, fontSize: 15 },
  corpo: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: espaco.xl, gap: espaco.lg },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.md },
  alerta: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, backgroundColor: cores.verdeEscuro, borderRadius: raio.xl, padding: espaco.lg },
  alertaIcone: { width: 44, height: 44, borderRadius: 14, backgroundColor: cores.trigo, alignItems: 'center', justifyContent: 'center' },
  alertaTitulo: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  alertaTexto: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  ganhos: { backgroundColor: cores.trigoClaro, borderRadius: raio.xl, padding: espaco.lg, gap: 2, borderWidth: 1, borderColor: '#F0DDB3' },
  ganhosRotulo: { color: cores.trigoEscuro, fontSize: 13, fontWeight: '700' },
  ganhosValor: { color: cores.verdeEscuro, fontSize: 30, fontWeight: '900' },
});
