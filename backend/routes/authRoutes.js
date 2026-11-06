import { Router } from 'express';
import { cadastrar, login } from '../controllers/authController.js';

const router = Router();

// Rotas públicas: qualquer pessoa pode criar conta e entrar.
router.post('/cadastro', cadastrar);
router.post('/login', login);

export default router;
