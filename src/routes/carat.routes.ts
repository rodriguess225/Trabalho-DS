import { Router } from 'express';
import { CaratController } from '../controllers/carat.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new CaratController();

routes.get('/', authMiddleware, roleMiddleware(['MEDICO', 'ADMIN', 'ADMINISTRADOR']), controller.listar.bind(controller));

routes.post('/submeter', authMiddleware, roleMiddleware(['UTENTE']), controller.submeter.bind(controller));

export default routes;