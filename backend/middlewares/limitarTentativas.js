// Proteção contra força bruta no login: no máximo 5 tentativas erradas
// por e-mail + IP a cada 15 minutos. (Em memória: zera quando a API reinicia.)
const LIMITE = 5;
const JANELA_MS = 15 * 60 * 1000;
const tentativas = new Map();

function chave(req) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  return (req.ip || '') + '|' + email;
}

export function limitarTentativas(req, res, next) {
  const registro = tentativas.get(chave(req));
  if (registro && registro.quantidade >= LIMITE && Date.now() - registro.inicio < JANELA_MS) {
    const minutos = Math.ceil((JANELA_MS - (Date.now() - registro.inicio)) / 60000);
    return res.status(429).json({ mensagem: 'Muitas tentativas de login. Tente de novo em ' + minutos + ' min.' });
  }
  return next();
}

export function registrarFalha(req) {
  const k = chave(req);
  const atual = tentativas.get(k);
  if (!atual || Date.now() - atual.inicio >= JANELA_MS) {
    tentativas.set(k, { quantidade: 1, inicio: Date.now() });
  } else {
    atual.quantidade += 1;
  }
}

export function limparFalhas(req) {
  tentativas.delete(chave(req));
}
