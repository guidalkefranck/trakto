import { Router } from 'express';
import { alterarNivel, listar } from '../controllers/usuariosController.js';
import autenticarToken from '../middlewares/autenticarToken.js';
import exigirPermissao from '../middlewares/exigirPermissao.js';

const router = Router();

// Todas as rotas abaixo exigem um JWT válido (Bearer Token).
router.use(autenticarToken);

router.get('/', exigirPermissao('gerenciarUsuarios'), listar);
router.patch('/:id/nivel', exigirPermissao('gerenciarUsuarios'), alterarNivel);

export default router;
