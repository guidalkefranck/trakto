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

// Explica em português os erros mais comuns de conexão com o MySQL.
export function explicarErroBanco(erro) {
  const dicas = {
    ECONNREFUSED: 'o MySQL recusou a conexão em ' + process.env.DB_HOST + ':' + (process.env.DB_PORT || 3306) + '. Confira se o MySQL está ligado, a porta (DB_PORT) e use DB_HOST=127.0.0.1 no backend/.env.',
    ER_ACCESS_DENIED_ERROR: 'usuário ou senha do MySQL incorretos. Confira DB_USER e DB_PASSWORD no backend/.env.',
    ER_BAD_DB_ERROR: 'o banco "' + process.env.DB_NAME + '" não existe. Execute database/trakto.sql no MySQL Workbench.',
    ER_NO_SUCH_TABLE: 'faltam tabelas. Execute database/trakto.sql no MySQL Workbench.',
    ETIMEDOUT: 'o MySQL não respondeu. Confira DB_HOST e DB_PORT no backend/.env.',
  };
  return dicas[erro && erro.code] || (erro && (erro.code || erro.message)) || 'erro desconhecido';
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
