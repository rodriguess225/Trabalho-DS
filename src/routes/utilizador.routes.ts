import { Router } from 'express';
import { UtilizadorController } from '../controllers/utilizador.controller';

const routes = Router();
const controller = new UtilizadorController();

routes.get('/:id', controller.buscarPorId.bind(controller));
routes.post('/', controller.criar.bind(controller));

export default routes;