// Testes das regras de validação (não precisam do MySQL): npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dataServicoValida, idValido, senhaValida, validarCadastroUsuario, validarMaquina, validarSolicitacao } from '../utils/validacoes.js';

const HOJE = new Date(2026, 10, 6); // 06/11/2026

test('idValido aceita apenas inteiros positivos', function () {
  assert.equal(idValido('7'), true);
  for (const v of ['0', '-1', '1.5', 'abc', '', '1;DROP']) { assert.equal(idValido(v), false, v); }
});

test('senhaValida exige de 8 a 72 bytes', function () {
  assert.equal(senhaValida('trakto123'), true);
  assert.equal(senhaValida('1234567'), false);
  assert.equal(senhaValida('        '), false);
  assert.equal(senhaValida('a'.repeat(73)), false);
});

test('cadastro público nunca cria administrador (RN01)', function () {
  const { dados } = validarCadastroUsuario({ nome: 'Ana Weber', email: 'ANA@X.COM ', telefone: '(51) 99999-0000', cidade: 'Lajeado', senha: 'segura123', nivel: 'admin' });
  assert.equal(dados.nivel, 'produtor');
  assert.equal(dados.email, 'ana@x.com');
});

test('validarMaquina rejeita tipo e preço inválidos', function () {
  const base = { nome: 'Trator Valtra', tipo: 'Trator', cidade: 'Lajeado', precoHora: 150 };
  assert.ok(validarMaquina(base).dados);
  assert.match(validarMaquina({ ...base, tipo: 'Foguete' }).erro, /Tipo inválido/);
  assert.match(validarMaquina({ ...base, precoHora: 0 }).erro, /preço/);
  assert.equal(validarMaquina({ ...base, precoHora: '99.999' }).dados.precoHora, 100);
});

test('dataServicoValida recusa datas inexistentes e passadas (RN04)', function () {
  assert.equal(dataServicoValida('2026-11-06', HOJE), true);
  assert.equal(dataServicoValida('2026-11-05', HOJE), false);
  assert.equal(dataServicoValida('2026-02-30', HOJE), false);
  assert.equal(dataServicoValida('06/11/2026', HOJE), false);
});

test('validarSolicitacao limita as horas entre 1 e 200', function () {
  const base = { maquinaId: 1, dataServico: '2026-11-20', horas: 6 };
  assert.ok(validarSolicitacao(base, HOJE).dados);
  assert.ok(validarSolicitacao({ ...base, horas: 0 }, HOJE).erro);
  assert.ok(validarSolicitacao({ ...base, horas: 201 }, HOJE).erro);
});
