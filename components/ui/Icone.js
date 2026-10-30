// Ícones vetoriais (Material Community Icons, incluídos no Expo).
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../../theme/tema.js';

export default function Icone({ nome, tamanho = 20, cor = cores.texto, style = undefined }) {
  return <MaterialCommunityIcons name={nome} size={tamanho} color={cor} style={style} />;
}
