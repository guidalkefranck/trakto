// Funções pequenas e puras de formatação e validação, reutilizadas nas telas.

export function moeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// 05112026 → 05/11/2026 enquanto o usuário digita.
export function mascaraData(texto) {
  const numeros = String(texto).replace(/\D/g, '').slice(0, 8);
  return [numeros.slice(0, 2), numeros.slice(2, 4), numeros.slice(4, 8)].filter(Boolean).join('/');
}

// 51999990000 → (51) 99999-0000
export function mascaraTelefone(texto) {
  const n = String(texto).replace(/\D/g, '').slice(0, 11);
  if (n.length <= 2) { return n ? '(' + n : ''; }
  if (n.length <= 7) { return '(' + n.slice(0, 2) + ') ' + n.slice(2); }
  return '(' + n.slice(0, 2) + ') ' + n.slice(2, n.length - 4) + '-' + n.slice(n.length - 4);
}

// Confere se dd/mm/aaaa é uma data real e não está no passado.
export function dataValidaFutura(texto) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!partes) { return false; }
  const dia = Number(partes[1]); const mes = Number(partes[2]) - 1; const ano = Number(partes[3]);
  const data = new Date(ano, mes, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes || data.getDate() !== dia) { return false; }
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  return data >= hoje;
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function iniciais(nome) {
  return String(nome || '?').trim().split(/\s+/).slice(0, 2).map(function primeira(p) { return p[0]; }).join('').toUpperCase();
}

export function primeiroNome(nome) {
  return String(nome || '').trim().split(/\s+/)[0];
}

export function numero(texto) {
  return Number(String(texto).replace(',', '.')) || 0;
}

// A API usa datas no padrão ISO (AAAA-MM-DD); a tela mostra dd/mm/aaaa.
export function dataParaApi(dataBr) {
  const p = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(dataBr || ''));
  return p ? p[3] + '-' + p[2] + '-' + p[1] : '';
}

export function dataDaApi(dataIso) {
  const p = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dataIso || ''));
  return p ? p[3] + '/' + p[2] + '/' + p[1] : String(dataIso || '');
}
