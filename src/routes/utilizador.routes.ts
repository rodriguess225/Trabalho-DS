import { Router } from 'express';
import { UtilizadorController } from '../controllers/utilizador.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new UtilizadorController();

routes.get('/:id', authMiddleware, controller.buscarPorId.bind(controller));
routes.post('/', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.criar.bind(controller));

export default routes;