import { Router } from 'express';
import { AlertaController } from '../controllers/alerta.controller';

const routes = Router();
const controller = new AlertaController();

routes.post('/', controller.criar.bind(controller));
routes.get('/medico/:id_medico', controller.listarPorMedico.bind(controller));
routes.patch('/:id/estado', controller.atualizarEstado.bind(controller));

export default routes;