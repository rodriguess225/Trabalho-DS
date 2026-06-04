import { Router } from 'express';
import { FichaAnamneseController } from '../controllers/fichaanamnese.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new FichaAnamneseController();

routes.post('/', authMiddleware, roleMiddleware(['UTENTE', 'MEDICO']), controller.criar.bind(controller));

export default routes;