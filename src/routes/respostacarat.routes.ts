import { Router } from 'express';
import { RespostaCaratController } from '../controllers/respostacarat.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new RespostaCaratController();

routes.post('/', authMiddleware, roleMiddleware(['UTENTE']), controller.criar.bind(controller));

export default routes;