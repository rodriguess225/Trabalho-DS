import { Router } from 'express';
import { UtenteController } from '../controllers/utente.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';

const routes = Router();
const controller = new UtenteController();

// Protegido: Apenas MEDICO e ADMIN podem aceder
routes.get('/', authMiddleware, requireRole('MEDICO', 'ADMIN'), controller.listar.bind(controller));
routes.post('/', authMiddleware, requireRole('MEDICO', 'ADMIN'), controller.criar.bind(controller));

export default routes;