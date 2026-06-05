import { Router } from 'express';
import { AlergiaController } from '../controllers/alergia.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const routes = Router();
const controller = new AlergiaController();

routes.get('/', authMiddleware, controller.listar.bind(controller));
routes.post('/', authMiddleware, controller.criar.bind(controller)); 

export default routes;