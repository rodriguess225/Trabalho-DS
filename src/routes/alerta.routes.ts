import { Router } from 'express';
import { AlertaController } from '../controllers/alerta.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new AlertaController();

routes.get('/medico/:id_medico', authMiddleware, roleMiddleware(['MEDICO', 'UTENTE']), controller.listarPorMedico.bind(controller));routes.patch('/:id/estado', authMiddleware, roleMiddleware(['MEDICO']), controller.atualizarEstado.bind(controller));

routes.post('/', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.criar.bind(controller));

export default routes;