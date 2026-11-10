import { Router } from 'express';
import { alterarStatus, criar, listar } from '../controllers/solicitacoesController.js';
import autenticarToken from '../middlewares/autenticarToken.js';
import exigirPermissao from '../middlewares/exigirPermissao.js';

const router = Router();

// Todas as rotas abaixo exigem um JWT válido (Bearer Token).
router.use(autenticarToken);

// A listagem já filtra pelo nível de quem pede (veja o controller).
router.get('/', listar);
router.post('/', exigirPermissao('solicitarAluguel'), criar);
// Dono aceita/recusa/conclui; produtor cancela — conferido no controller.
router.patch('/:id/status', alterarStatus);

export default router;
