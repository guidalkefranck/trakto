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

export default function validarAmbiente() {
  validarBanco();
  validarPorta('PORT', process.env.PORT || 3000);
}

function validarPorta(nome, valor) {
  const porta = Number(valor);
  if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
    throw new Error(nome + ' deve ser uma porta válida (1 a 65535).');
  }
}
