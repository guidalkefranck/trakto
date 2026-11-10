// Testes do JWT (geração, validação e leitura do Bearer): npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extrairBearer, gerarToken, validarToken } from '../utils/token.js';

process.env.JWT_SECRET = 'segredo-apenas-para-testes-com-mais-de-32-caracteres';
process.env.JWT_EXPIRA_EM = '1h';

test('extrairBearer aceita só "Bearer <token>"', function () {
  assert.equal(extrairBearer('Bearer abc.def.ghi'), 'abc.def.ghi');
  assert.equal(extrairBearer('bearer abc'), 'abc');
  for (const v of [undefined, '', 'abc.def.ghi', 'Basic abc', 'Bearer', 'Bearer a b']) { assert.equal(extrairBearer(v), null, String(v)); }
});

test('gerarToken cria JWT com id, nível e jti, sem dados sensíveis', function () {
  const { token, jti, expiraEm } = gerarToken({ id: 7, nivel: 'proprietario', senha: 'hash-secreto' });
  const payload = validarToken(token);
  assert.equal(payload.sub, '7');
  assert.equal(payload.nivel, 'proprietario');
  assert.equal(payload.jti, jti);
  assert.equal(payload.senha, undefined);
  assert.ok(new Date(expiraEm) > new Date());
});

test('validarToken recusa token adulterado ou assinado com outro segredo', function () {
  const { token } = gerarToken({ id: 1, nivel: 'produtor' });
  const [cab, , assinatura] = token.split('.');
  const falso = Buffer.from(JSON.stringify({ sub: '3', nivel: 'admin' })).toString('base64url');
  assert.throws(function () { validarToken(cab + '.' + falso + '.' + assinatura); });
  process.env.JWT_SECRET = 'outro-segredo-totalmente-diferente-com-32-caracteres';
  assert.throws(function () { validarToken(token); });
});
