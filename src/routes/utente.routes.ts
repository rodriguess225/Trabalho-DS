import { Router } from 'express';
import { UtenteController } from '../controllers/utente.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new UtenteController();


routes.get('/', authMiddleware, roleMiddleware(['MEDICO', 'ADMIN', 'ADMINISTRADOR']), controller.listar.bind(controller));

routes.get('/:id', authMiddleware, controller.buscarPorId.bind(controller));
routes.get('/utilizador/:id_utilizador', authMiddleware, controller.buscarPorIdUtilizador.bind(controller));
routes.post('/', authMiddleware, roleMiddleware(['UTENTE', 'MEDICO', 'ADMIN', 'ADMINISTRADOR']), controller.criar.bind(controller));
routes.patch('/:id/medico', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.associarMedico.bind(controller));

export default routes;