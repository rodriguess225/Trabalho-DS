import { Router } from 'express';
import { LogAuditoriaController } from '../controllers/logauditoria.controller';

const routes = Router();
const controller = new LogAuditoriaController();

routes.get('/', controller.listar.bind(controller));
routes.get('/utilizador/:id_utilizador', controller.listarPorUtilizador.bind(controller));
routes.post('/', controller.criar.bind(controller));

export default routes;