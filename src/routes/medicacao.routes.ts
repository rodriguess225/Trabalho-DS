import { Router } from 'express';
import { MedicacaoController } from '../controllers/medicacao.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new MedicacaoController();

routes.get('/utente/:id_utente', authMiddleware, roleMiddleware(['UTENTE', 'MEDICO']), controller.listarPorUtente.bind(controller));
routes.post('/', authMiddleware, roleMiddleware(['MEDICO']), controller.criar.bind(controller));

export default routes;