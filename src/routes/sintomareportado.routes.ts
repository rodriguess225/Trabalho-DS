import { Router } from 'express';
import { SintomaReportadoController } from '../controllers/sintomareportado.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new SintomaReportadoController();

routes.get('/utente/:id_utente', authMiddleware, roleMiddleware(['UTENTE', 'MEDICO']), controller.listarPorUtente.bind(controller));

routes.post('/', authMiddleware, roleMiddleware(['UTENTE']), controller.criar.bind(controller));

export default routes;