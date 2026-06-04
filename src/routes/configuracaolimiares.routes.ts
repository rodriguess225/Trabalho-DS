import { Router } from 'express';
import { ConfiguracaoLimiaresController } from '../controllers/configuracaolimiares.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new ConfiguracaoLimiaresController();

routes.get('/limiar-atual', authMiddleware, controller.obterAtual.bind(controller));
routes.post('/', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.atualizar.bind(controller));

export default routes;