import { Router } from 'express';
import { alterarNivel, eu, listar } from '../controllers/usuariosController.js';
import identificarUsuario from '../middlewares/identificarUsuario.js';
import exigirPermissao from '../middlewares/exigirPermissao.js';

const router = Router();

router.use(identificarUsuario);

router.get('/eu', eu);
router.get('/', exigirPermissao('gerenciarUsuarios'), listar);
router.patch('/:id/nivel', exigirPermissao('gerenciarUsuarios'), alterarNivel);

export default router;
