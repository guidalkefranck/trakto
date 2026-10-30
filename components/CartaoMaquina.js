import { StyleSheet, Text, View } from 'react-native';
import { Cartao, Icone } from './ui/index.js';
import { iconeDoTipo } from '../constants/negocio.js';
import { moeda } from '../utils/formatadores.js';
import { cores, espaco, raio } from '../theme/tema.js';

export default function CartaoMaquina({ maquina, onPress }) {
  return <Cartao onPress={onPress} rotulo={'Ver ' + maquina.nome} style={css.cartao}>
    <View style={css.imagem}>
      <Icone nome={iconeDoTipo(maquina.tipo)} tamanho={34} cor={cores.terra} />
    </View>
    <View style={css.info}>
      <Text style={css.tipo}>{maquina.tipo}</Text>
      <Text style={css.nome} numberOfLines={1}>{maquina.nome}</Text>
      <View style={css.local}>
        <Icone nome="map-marker-outline" tamanho={14} cor={cores.textoSuave} />
        <Text style={css.localTexto} numberOfLines={1}>{maquina.cidade}, RS</Text>
        {maquina.comOperador && <><Text style={css.ponto}>•</Text><Text style={css.localTexto}>com operador</Text></>}
      </View>
      <View style={css.rodape}>
        <Text style={css.preco}>{moeda(maquina.precoHora)}<Text style={css.porHora}> /hora</Text></Text>
        <View style={[css.situacao, !maquina.disponivel && { backgroundColor: cores.erroClaro }]}>
          <View style={[css.bolinha, !maquina.disponivel && { backgroundColor: cores.erro }]} />
          <Text style={[css.situacaoTexto, !maquina.disponivel && { color: cores.erro }]}>{maquina.disponivel ? 'Disponível' : 'Indisponível'}</Text>
        </View>
      </View>
    </View>
  </Cartao>;
}

const css = StyleSheet.create({
  cartao: { flexDirection: 'row', alignItems: 'center', padding: espaco.md + 2, gap: espaco.md + 2 },
  imagem: { width: 78, height: 78, borderRadius: raio.lg, backgroundColor: cores.terraClara, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  tipo: { color: cores.terra, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '800' },
  local: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  localTexto: { color: cores.textoSuave, fontSize: 13 },
  ponto: { color: cores.textoClaro, marginHorizontal: 2 },
  rodape: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, gap: 6, flexWrap: 'wrap' },
  preco: { color: cores.verde, fontSize: 17, fontWeight: '900' },
  porHora: { color: cores.textoSuave, fontSize: 12, fontWeight: '600' },
  situacao: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: cores.sucessoClaro, paddingHorizontal: 8, paddingVertical: 3, borderRadius: raio.pilula },
  bolinha: { width: 7, height: 7, borderRadius: 4, backgroundColor: cores.sucesso },
  situacaoTexto: { color: cores.sucesso, fontSize: 11, fontWeight: '800' },
});
