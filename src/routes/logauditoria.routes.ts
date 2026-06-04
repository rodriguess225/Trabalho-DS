import { Router } from 'express';
import { LogAuditoriaController } from '../controllers/logauditoria.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new LogAuditoriaController();


routes.get('/', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.listar.bind(controller));
routes.get('/utilizador/:id_utilizador', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.listarPorUtilizador.bind(controller));
routes.post('/', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.criar.bind(controller));

export default routes;