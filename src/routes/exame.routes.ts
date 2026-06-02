import { Router } from 'express';
import { ExameController } from '../controllers/exame.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';

const routes = Router();
const controller = new ExameController();

// Protegido: Apenas MEDICO pode aceder
routes.get('/', authMiddleware, requireRole('MEDICO'), controller.listar.bind(controller));
routes.post('/', authMiddleware, requireRole('MEDICO'), controller.criar.bind(controller));

export default routes;
