import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const routes = Router();
const controller = new DashboardController();

routes.get('/utente/:id_utente', controller.obterDashboardUtente.bind(controller));

export default routes;
