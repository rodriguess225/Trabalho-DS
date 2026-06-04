import { Router } from 'express';
import { FichaPossuiAlergiasController } from '../controllers/fichapossuialergia.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new FichaPossuiAlergiasController();

routes.post('/', authMiddleware, roleMiddleware(['UTENTE', 'MEDICO']), controller.criar.bind(controller));

export default routes;