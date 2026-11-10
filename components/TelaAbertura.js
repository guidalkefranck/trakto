import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Logo from './Logo.js';
import { cores } from '../theme/tema.js';

// Exibida enquanto o app confere se há uma sessão salva (token JWT) no aparelho.
export default function TelaAbertura() {
  return <View style={css.tela}>
    <Logo tamanho={64} claro />
    <ActivityIndicator color={cores.trigo} size="large" />
    <Text style={css.texto}>Verificando sua sessão…</Text>
  </View>;
}

const css = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.verde, alignItems: 'center', justifyContent: 'center', gap: 28, padding: 24 },
  texto: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
});
