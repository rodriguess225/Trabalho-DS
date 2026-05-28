import { Router } from 'express';
import { CaratController } from '../controllers/carat.controller';

const routes = Router();
const controller = new CaratController();

// Segue a mesma estrutura das prescrições (bind para garantir o contexto do this)
routes.get('/', controller.listar.bind(controller));
routes.post('/submeter', controller.criar.bind(controller));

export default routes;