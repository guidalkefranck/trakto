import { StyleSheet, Text, View } from 'react-native';
import Icone from './Icone.js';
import { cores, espaco, raio } from '../../theme/tema.js';

export default function EstadoVazio({ icone = 'sprout-outline', titulo, texto = '', children = null }) {
  return <View style={css.caixa}>
    <View style={css.circulo}><Icone nome={icone} tamanho={34} cor={cores.verde} /></View>
    <Text style={css.titulo}>{titulo}</Text>
    {!!texto && <Text style={css.texto}>{texto}</Text>}
    {children}
  </View>;
}

const css = StyleSheet.create({
  caixa: { alignItems: 'center', gap: espaco.sm, paddingVertical: espaco.xxl, paddingHorizontal: espaco.xl, borderRadius: raio.xl, borderWidth: 1.5, borderStyle: 'dashed', borderColor: cores.bordaForte },
  circulo: { width: 68, height: 68, borderRadius: 34, backgroundColor: cores.verdeClaro, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  titulo: { color: cores.texto, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  texto: { color: cores.textoSuave, textAlign: 'center', lineHeight: 21 },
});
