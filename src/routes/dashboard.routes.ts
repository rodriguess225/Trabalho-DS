import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new DashboardController();

routes.get('/utente/:id_utente', authMiddleware, roleMiddleware(['UTENTE', 'MEDICO']), controller.obterDashboardUtente.bind(controller));

export default routes;
