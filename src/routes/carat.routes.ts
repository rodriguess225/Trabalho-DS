import { Router } from 'express';
import { CaratController } from '../controllers/carat.controller';

const routes = Router();
const controller = new CaratController();

routes.get('/', controller.listar.bind(controller));
routes.post('/submeter', controller.submeter.bind(controller));

export default routes;