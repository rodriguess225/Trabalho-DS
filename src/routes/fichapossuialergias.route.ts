import { Router } from 'express';
import { FichaPossuiAlergiasController } from '../controllers/fichapossuialergia.controller';

const routes = Router();
const controller = new FichaPossuiAlergiasController();

routes.post('/', controller.criar.bind(controller));

export default routes;