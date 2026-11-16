// Preferências do aparelho que não dependem de login.
// Hoje: o endereço da API escolhido na tela de login (útil no APK, em que o
// celular precisa do IP do computador que roda a API).
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_SERVIDOR = '@trakto:servidor';

export async function lerServidor() {
  try { return (await AsyncStorage.getItem(CHAVE_SERVIDOR)) || null; } catch { return null; }
}

export async function salvarServidor(url) {
  try { await AsyncStorage.setItem(CHAVE_SERVIDOR, url); } catch { /* segue com o endereço em memória */ }
}

export async function esquecerServidor() {
  try { await AsyncStorage.removeItem(CHAVE_SERVIDOR); } catch { /* nada a remover */ }
}
