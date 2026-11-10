import { Router } from 'express';
import { cadastrar, eu, login, logout } from '../controllers/authController.js';
import autenticarToken from '../middlewares/autenticarToken.js';
import { limitarTentativas } from '../middlewares/limitarTentativas.js';

const router = Router();

// Públicas: criar conta e entrar.
router.post('/cadastro', cadastrar);
router.post('/login', limitarTentativas, login);

// Protegidas: exigem Authorization: Bearer <token>.
router.get('/me', autenticarToken, eu);
router.post('/logout', autenticarToken, logout);

export default router;
