// Popula o banco com dados de demonstração:  npm run db:popular
// Pré-requisito: ter executado database/trakto.sql no MySQL.
// As senhas são gravadas com hash bcrypt (o valor original fica só no .env).
import bcrypt from 'bcryptjs';
import pool from '../database/conexao.js';
import { explicarErroBanco, validarBanco } from '../config/ambiente.js';

const USUARIOS = [
  { nome: 'João Schneider', email: 'produtor@trakto.com', telefone: '(51) 99999-1001', cidade: 'Lajeado', nivel: 'produtor' },
  { nome: 'Marta Kunz', email: 'proprietario@trakto.com', telefone: '(51) 99999-2002', cidade: 'Estrela', nivel: 'proprietario' },
  { nome: 'Equipe TRAKTO', email: 'admin@trakto.com', telefone: '(51) 99999-3003', cidade: 'Lajeado', nivel: 'admin' },
  { nome: 'Paulo Hammes', email: 'paulo@trakto.com', telefone: '(51) 99999-4004', cidade: 'Teutônia', nivel: 'proprietario' },
  { nome: 'Ana Weber', email: 'ana@trakto.com', telefone: '(51) 99999-5005', cidade: 'Arroio do Meio', nivel: 'produtor' },
];

// dono = e-mail do proprietário
const MAQUINAS = [
  ['proprietario@trakto.com', 'Trator Valtra A750', 'Trator', '75 cv', 'Lajeado', 150, 1, 1, 'Trator 4x4 revisado, ideal para preparo de solo e transporte em pequenas propriedades.'],
  ['proprietario@trakto.com', 'Semeadeira Múltipla 7 linhas', 'Semeadeira', 'Tração 60 cv+', 'Estrela', 80, 1, 0, 'Semeadeira para milho, soja e feijão. Regulagem de espaçamento inclusa na entrega.'],
  ['paulo@trakto.com', 'Pulverizador Jacto 600 L', 'Pulverizador', 'Barras de 12 m', 'Teutônia', 95, 1, 1, 'Pulverizador de barras com bicos novos. Indicado para lavouras de até 20 hectares.'],
  ['paulo@trakto.com', 'Colheitadeira New Holland TC5070', 'Colheitadeira', '175 cv', 'Teutônia', 420, 0, 1, 'Colheitadeira para grãos com plataforma de 17 pés. Alugada sempre com operador experiente.'],
  ['proprietario@trakto.com', 'Grade Aradora 14 discos', 'Implemento', 'Tração 75 cv+', 'Estrela', 60, 1, 0, 'Grade aradora para preparo de solo e incorporação de restos culturais.'],
  ['paulo@trakto.com', 'Caminhão Ford Cargo 816', 'Transporte', 'Carga de 4 t', 'Teutônia', 110, 1, 1, 'Transporte de safra, insumos e pequenos implementos na região do Vale do Taquari.'],
  ['proprietario@trakto.com', 'Trator Massey Ferguson 275', 'Trator', '75 cv', 'Lajeado', 130, 1, 0, 'Trator clássico, econômico e de manutenção simples. Ótimo para serviços leves.'],
];

// [máquina, produtor, dias a partir de hoje, horas, status, observação]
const SOLICITACOES = [
  ['Trator Valtra A750', 'produtor@trakto.com', 6, 6, 'pendente', 'Preparo de solo para plantio de milho, 3 hectares.'],
  ['Pulverizador Jacto 600 L', 'produtor@trakto.com', -14, 4, 'concluida', 'Aplicação na lavoura de soja.'],
  ['Semeadeira Múltipla 7 linhas', 'produtor@trakto.com', 10, 5, 'aceita', null],
  ['Grade Aradora 14 discos', 'ana@trakto.com', 3, 3, 'pendente', 'Gradear área de 2 hectares antes do plantio.'],
];

function dataRelativa(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

async function popular() {
  validarBanco();
  const senha = process.env.SENHA_DEMO || '';
  if (senha.length < 8) { throw new Error('Defina SENHA_DEMO (mínimo 8 caracteres) em backend/.env.'); }

  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
  if (total > 0 && !process.argv.includes('--forcar')) {
    console.log('O banco já tem ' + total + ' usuário(s). Nada foi alterado.');
    console.log('Para apagar tudo e recriar os dados de demonstração: npm run db:popular -- --forcar');
    return;
  }

  const conexao = await pool.getConnection();
  try {
    if (total > 0) {
      // TRUNCATE zera também os IDs (usuário 1 = produtor, 2 = proprietária, 3 = admin...).
      await conexao.query('SET FOREIGN_KEY_CHECKS = 0');
      for (const tabela of ['tokens_revogados', 'solicitacoes', 'maquinas', 'usuarios']) { await conexao.query('TRUNCATE TABLE ' + tabela); }
      await conexao.query('SET FOREIGN_KEY_CHECKS = 1');
    }
    // Transação: ou entra tudo, ou nada.
    await conexao.beginTransaction();

    const hash = await bcrypt.hash(senha, 10);
    const idsUsuarios = {};
    for (const u of USUARIOS) {
      const [r] = await conexao.execute(
        'INSERT INTO usuarios (nome, email, senha, telefone, cidade, nivel) VALUES (?, ?, ?, ?, ?, ?)',
        [u.nome, u.email, hash, u.telefone, u.cidade, u.nivel],
      );
      idsUsuarios[u.email] = r.insertId;
    }

    const maquinas = {};
    for (const [dono, nome, tipo, potencia, cidade, preco, disponivel, operador, descricao] of MAQUINAS) {
      const [r] = await conexao.execute(
        `INSERT INTO maquinas (proprietario_id, nome, tipo, potencia, cidade, preco_hora, disponivel, com_operador, descricao)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [idsUsuarios[dono], nome, tipo, potencia, cidade, preco, disponivel, operador, descricao],
      );
      maquinas[nome] = { id: r.insertId, preco };
    }

    for (const [nomeMaquina, produtor, dias, horas, status, obs] of SOLICITACOES) {
      const m = maquinas[nomeMaquina];
      await conexao.execute(
        'INSERT INTO solicitacoes (maquina_id, produtor_id, data_servico, horas, valor_total, status, observacao) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [m.id, idsUsuarios[produtor], dataRelativa(dias), horas, m.preco * horas, status, obs],
      );
    }

    await conexao.commit();
    console.log('✅ Banco populado: ' + USUARIOS.length + ' usuários, ' + MAQUINAS.length + ' máquinas, ' + SOLICITACOES.length + ' solicitações.');
    console.log('   Entre com produtor@trakto.com, proprietario@trakto.com ou admin@trakto.com e a senha SENHA_DEMO do backend/.env.');
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

popular()
  .catch(function falhou(erro) {
    console.error('❌ Não foi possível popular o banco: ' + explicarErroBanco(erro));
    process.exitCode = 1;
  })
  .finally(function encerrar() { return pool.end(); });
