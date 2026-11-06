import { pode } from '../../constants/permissoes.js';

// Libera a rota se o usuário tiver PELO MENOS UMA das ações informadas.
// Usa a mesma matriz de permissões do app (constants/permissoes.js).
// Exemplo: router.post('/', exigirPermissao('gerenciarMinhasMaquinas'), criar)
export default function exigirPermissao(...acoes) {
  return function verificarPermissao(req, res, next) {
    if (acoes.some(function alguma(acao) { return pode(req.usuario, acao); })) { return next(); }
    return res.status(403).json({ mensagem: 'Seu nível de acesso não permite esta ação.' });
  };
}
