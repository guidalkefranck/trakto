// Matriz de permissões da TRAKTO — fonte única das regras de acesso do app.
// Na Entrega 3 a mesma matriz será aplicada no back-end, em um middleware que
// lê o JWT (Bearer Token), descobre o nível do usuário e bloqueia com 403.

export const NIVEIS = {
  produtor: { nome: 'Produtor rural', curto: 'Produtor', icone: 'sprout' },
  proprietario: { nome: 'Proprietário de máquinas', curto: 'Proprietário', icone: 'tractor-variant' },
  admin: { nome: 'Administrador', curto: 'Admin', icone: 'shield-account' },
};

export const PERMISSOES = {
  buscarMaquinas: ['produtor', 'proprietario', 'admin'],
  solicitarAluguel: ['produtor'],
  verMinhasSolicitacoes: ['produtor'],
  gerenciarMinhasMaquinas: ['proprietario'],
  responderSolicitacoes: ['proprietario'],
  verTodasSolicitacoes: ['admin'],
  moderarAnuncios: ['admin'],
  gerenciarUsuarios: ['admin'],
};

export function pode(usuario, acao) {
  return Boolean(usuario) && (PERMISSOES[acao] || []).includes(usuario.nivel);
}

// Regra de dono do registro: o proprietário só altera as próprias máquinas;
// o administrador pode moderar qualquer anúncio.
export function podeAlterarMaquina(usuario, maquina) {
  if (!usuario || !maquina) { return false; }
  return pode(usuario, 'moderarAnuncios') ||
    (pode(usuario, 'gerenciarMinhasMaquinas') && maquina.proprietarioId === usuario.id);
}
