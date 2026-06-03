import { Router } from 'express';
import { SintomaReportadoController } from '../controllers/sintomareportado.controller';

const routes = Router();
const controller = new SintomaReportadoController();

routes.get('/utente/:id_utente', controller.listarPorUtente.bind(controller));
routes.post('/', controller.criar.bind(controller));

export default routes;