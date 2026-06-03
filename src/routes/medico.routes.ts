import { Router } from 'express';
import { MedicoController } from '../controllers/medico.controller';

const routes = Router();
const controller = new MedicoController();

routes.get('/', controller.listar.bind(controller));
routes.get('/:id', controller.buscarPorId.bind(controller));
routes.get('/utilizador/:id_utilizador', controller.buscarPorIdUtilizador.bind(controller));
routes.post('/', controller.criar.bind(controller));

export default routes;