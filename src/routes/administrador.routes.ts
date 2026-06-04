import { Router } from 'express';
import { AdministradorController } from '../controllers/administrador.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new AdministradorController();

routes.get('/', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.listar.bind(controller));
routes.post('/', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.criar.bind(controller));
routes.get('/:id', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.buscarPorId.bind(controller));

export default routes;