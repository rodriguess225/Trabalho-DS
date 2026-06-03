import { Router } from 'express';
import { MedicacaoController } from '../controllers/medicacao.controller';

const routes = Router();
const controller = new MedicacaoController();

routes.get('/utente/:id_utente', controller.listarPorUtente.bind(controller));
routes.post('/', controller.criar.bind(controller));

export default routes;