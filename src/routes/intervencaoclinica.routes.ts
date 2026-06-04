import { Router } from 'express';
import { IntervencaoClinicaController } from '../controllers/intervencaoclinica.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new IntervencaoClinicaController();

routes.post('/', authMiddleware, roleMiddleware(['MEDICO']), controller.criar.bind(controller));

export default routes;