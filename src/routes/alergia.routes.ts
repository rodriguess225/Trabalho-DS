import { Router } from 'express';
import { AlergiaController } from '../controllers/alergia.controller';

const routes = Router();
const controller = new AlergiaController();

routes.get('/', controller.listar.bind(controller));
routes.post('/', controller.criar.bind(controller));

export default routes;