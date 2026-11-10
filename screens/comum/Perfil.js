import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Botao, Cartao, Icone, Pagina, estilos } from '../../components/ui/index.js';
import { NIVEIS, PERMISSOES } from '../../constants/permissoes.js';
import { cores, espaco, raio } from '../../theme/tema.js';

// Descrição amigável de cada permissão da matriz (constants/permissoes.js).
const DESCRICOES = {
  buscarMaquinas: 'Buscar e ver máquinas',
  solicitarAluguel: 'Solicitar aluguel',
  verMinhasSolicitacoes: 'Acompanhar e cancelar seus pedidos',
  gerenciarMinhasMaquinas: 'Anunciar, editar e excluir suas máquinas',
  responderSolicitacoes: 'Aceitar, recusar e concluir pedidos',
  verTodasSolicitacoes: 'Ver todos os pedidos da plataforma',
  moderarAnuncios: 'Moderar qualquer anúncio',
  gerenciarUsuarios: 'Gerenciar usuários e níveis',
};

function formatarValidade(iso) {
  if (!iso) { return '—'; }
  const d = new Date(iso);
  const p = function dois(n) { return String(n).padStart(2, '0'); };
  return p(d.getDate()) + '/' + p(d.getMonth() + 1) + ' às ' + p(d.getHours()) + ':' + p(d.getMinutes());
}

export default function Perfil({ usuario, expiraEm, sair }) {
  const nivel = NIVEIS[usuario.nivel];
  const acoes = Object.keys(PERMISSOES);

  return <Pagina>
    <View style={css.topo}>
      <Avatar nome={usuario.nome} tamanho={76} />
      <Text style={estilos.titulo}>{usuario.nome}</Text>
      <View style={css.nivel}>
        <Icone nome={nivel.icone} tamanho={15} cor={cores.verdeEscuro} />
        <Text style={css.nivelTexto}>{nivel.nome}</Text>
      </View>
    </View>

    <Cartao>
      <Text style={estilos.etiqueta}>Seus dados</Text>
      <Linha icone="email-outline" texto={usuario.email} />
      <Linha icone="whatsapp" texto={usuario.telefone} />
      <Linha icone="map-marker-outline" texto={usuario.cidade + ', RS'} />
    </Cartao>

    <Cartao>
      <Text style={estilos.etiqueta}>Sessão</Text>
      <Linha icone="shield-check-outline" texto="Autenticado com token JWT (Bearer)" cor={cores.sucesso} />
      <Linha icone="clock-outline" texto={'Válida até ' + formatarValidade(expiraEm)} />
      <Linha icone="cellphone-lock" texto="Sessão salva neste aparelho com segurança" />
    </Cartao>

    <Cartao>
      <Text style={estilos.etiqueta}>O que você pode fazer</Text>
      {acoes.map(function permissao(acao) {
        const liberada = PERMISSOES[acao].includes(usuario.nivel);
        return <Linha key={acao} icone={liberada ? 'check-circle' : 'close-circle-outline'}
          cor={liberada ? cores.sucesso : cores.textoClaro} texto={DESCRICOES[acao]} apagado={!liberada} />;
      })}
      <Text style={estilos.pequeno}>Essas mesmas regras são conferidas pela API em cada requisição.</Text>
    </Cartao>

    <Botao titulo="Sair da conta" icone="logout" variante="perigo" onPress={sair} />
  </Pagina>;
}

function Linha({ icone, texto, cor = cores.textoSuave, apagado = false }) {
  return <View style={css.linha}>
    <Icone nome={icone} tamanho={18} cor={cor} />
    <Text style={[estilos.texto, { flex: 1 }, apagado && { color: cores.textoClaro, textDecorationLine: 'line-through' }]}>{texto}</Text>
  </View>;
}

const css = StyleSheet.create({
  topo: { alignItems: 'center', gap: espaco.sm, paddingVertical: espaco.md },
  nivel: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: cores.trigo, paddingHorizontal: 12, paddingVertical: 6, borderRadius: raio.pilula },
  nivelTexto: { color: cores.verdeEscuro, fontWeight: '800' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm + 2 },
});
