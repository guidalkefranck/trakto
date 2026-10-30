import { StyleSheet } from 'react-native';
import { cores, fonte } from '../../theme/tema.js';

// Estilos de texto padronizados para todas as telas.
export const estilos = StyleSheet.create({
  hero: { color: cores.texto, fontSize: fonte.hero, fontWeight: '900', lineHeight: 42, letterSpacing: -1 },
  titulo: { color: cores.texto, fontSize: fonte.titulo, fontWeight: '800', lineHeight: 31, letterSpacing: -0.4 },
  subtitulo: { color: cores.textoSuave, fontSize: fonte.corpo, lineHeight: 22 },
  texto: { color: cores.texto, fontSize: fonte.corpo, lineHeight: 23 },
  forte: { color: cores.texto, fontSize: fonte.corpo, fontWeight: '700' },
  pequeno: { color: cores.textoSuave, fontSize: fonte.pequena, lineHeight: 19 },
  etiqueta: { color: cores.terra, fontSize: fonte.legenda, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
  linha: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  separador: { height: 1, backgroundColor: cores.borda },
});
