import { Router } from 'express';
import { MedicoController } from '../controllers/medico.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new MedicoController();

routes.get('/', authMiddleware, controller.listar.bind(controller)); 
routes.get('/:id', authMiddleware, controller.buscarPorId.bind(controller));
routes.get('/utilizador/:id_utilizador', authMiddleware, controller.buscarPorIdUtilizador.bind(controller));
routes.post('/', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.criar.bind(controller));
routes.get('/:id/utentes', authMiddleware, controller.listarUtentes.bind(controller));
routes.patch('/:id', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.atualizar.bind(controller));
routes.delete('/:id', authMiddleware, roleMiddleware(['ADMIN', 'ADMINISTRADOR']), controller.apagar.bind(controller));

export default routes;