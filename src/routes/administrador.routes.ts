import { Router } from 'express';
import { AdministradorController } from '../controllers/administrador.controller';

const routes = Router();
const controller = new AdministradorController();

routes.get('/', controller.listar.bind(controller));
routes.post('/', controller.criar.bind(controller));
routes.get('/:id', controller.buscarPorId.bind(controller));
export default routes;