import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// Lê backend/.env a partir do caminho deste arquivo, em qualquer pasta que o Node rode.
dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });

// Falha cedo e com mensagem clara se faltar configuração do banco.
export function validarBanco() {
  for (const nome of ['DB_HOST', 'DB_USER', 'DB_NAME']) {
    if (!process.env[nome]?.trim()) {
      throw new Error('Configuração ausente: preencha ' + nome + ' em backend/.env (veja backend/.env.example).');
    }
  }
  // Senha vazia é válida em um MySQL local, mas a variável precisa existir.
  if (process.env.DB_PASSWORD === undefined) {
    throw new Error('Defina DB_PASSWORD em backend/.env, mesmo que fique vazia.');
  }
  validarPorta('DB_PORT', process.env.DB_PORT || 3306);
}

// O segredo do JWT é obrigatório: sem ele qualquer um poderia forjar tokens.
export function validarJwt() {
  const segredo = process.env.JWT_SECRET || '';
  if (segredo.length < 32 || segredo.startsWith('troque-por')) {
    throw new Error('Defina JWT_SECRET em backend/.env com pelo menos 32 caracteres aleatórios (veja backend/.env.example).');
  }
  if (!/^\d+[smhd]$/.test(process.env.JWT_EXPIRA_EM || '8h')) {
    throw new Error('JWT_EXPIRA_EM deve ser algo como 30m, 8h ou 1d.');
  }
}

export default function validarAmbiente() {
  validarBanco();
  validarJwt();
  validarPorta('PORT', process.env.PORT || 3000);
}

function validarPorta(nome, valor) {
  const porta = Number(valor);
  if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
    throw new Error(nome + ' deve ser uma porta válida (1 a 65535).');
  }
}
