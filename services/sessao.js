// Guarda a sessão (JWT + dados do usuário) no armazenamento do aparelho.
// AsyncStorage persiste mesmo fechando o app: ao reabrir, o usuário continua
// logado até o token expirar ou ele sair (logout).
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@trakto:sessao';

export async function salvarSessao(sessao) {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(sessao));
}

export async function lerSessao() {
  try {
    const texto = await AsyncStorage.getItem(CHAVE);
    const sessao = texto ? JSON.parse(texto) : null;
    return sessao && typeof sessao.token === 'string' ? sessao : null;
  } catch {
    return null;
  }
}

export async function limparSessao() {
  try { await AsyncStorage.removeItem(CHAVE); } catch { /* nada a limpar */ }
}
