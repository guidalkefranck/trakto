import { Router } from 'express';
import { atualizar, criar, detalhar, excluir, listar } from '../controllers/maquinasController.js';
import autenticarToken from '../middlewares/autenticarToken.js';
import exigirPermissao from '../middlewares/exigirPermissao.js';

const router = Router();

// Todas as rotas abaixo exigem um JWT válido (Bearer Token).
router.use(autenticarToken);

// CRUD da entidade principal.
router.get('/', exigirPermissao('buscarMaquinas'), listar);
router.get('/:id', exigirPermissao('buscarMaquinas'), detalhar);
router.post('/', exigirPermissao('gerenciarMinhasMaquinas'), criar);
// PUT/DELETE: o controller ainda confere se é o DONO da máquina (ou admin).
router.put('/:id', exigirPermissao('gerenciarMinhasMaquinas', 'moderarAnuncios'), atualizar);
router.delete('/:id', exigirPermissao('gerenciarMinhasMaquinas', 'moderarAnuncios'), excluir);

export default router;
