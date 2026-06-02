import { Router } from 'express';
import { CaratController } from '../controllers/carat.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';

const routes = Router();
const controller = new CaratController();

// Protegido: Apenas UTENTE e MEDICO podem aceder
routes.get('/', authMiddleware, requireRole('UTENTE', 'MEDICO'), controller.listar.bind(controller));
routes.post('/submeter', authMiddleware, requireRole('UTENTE', 'MEDICO'), controller.criar.bind(controller));

export default routes;