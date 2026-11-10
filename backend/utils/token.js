import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';

const ALGORITMO = 'HS256';

// Gera o JWT da sessão.
// Payload: só o mínimo para identificar a sessão (nunca senha ou hash).
//  - sub: id do usuário   - nivel: nível no momento do login
//  - jti: id único do token (permite revogar este token no logout)
export function gerarToken(usuario) {
  const jti = randomUUID();
  const token = jwt.sign(
    { sub: String(usuario.id), nivel: usuario.nivel },
    process.env.JWT_SECRET,
    { algorithm: ALGORITMO, expiresIn: process.env.JWT_EXPIRA_EM || '8h', jwtid: jti },
  );
  const { exp } = jwt.decode(token);
  return { token, jti, expiraEm: new Date(exp * 1000).toISOString() };
}

// Confere assinatura e validade. Lança erro se o token for inválido ou expirado.
// "decode" sozinho NÃO autentica: só "verify" confere a assinatura com o segredo.
export function validarToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: [ALGORITMO] });
}

// Lê "Authorization: Bearer <token>". Devolve o token ou null.
export function extrairBearer(cabecalho) {
  if (typeof cabecalho !== 'string') { return null; }
  const partes = cabecalho.trim().split(/\s+/);
  if (partes.length !== 2 || partes[0].toLowerCase() !== 'bearer' || !partes[1]) { return null; }
  return partes[1];
}
