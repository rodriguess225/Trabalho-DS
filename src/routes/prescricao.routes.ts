import { Router } from 'express';
import { PrescricaoController } from '../controllers/prescricao.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';

const routes = Router();
const controller = new PrescricaoController();

// Protegido: Apenas MEDICO pode aceder
routes.get('/', authMiddleware, requireRole('MEDICO'), controller.listarComDTO.bind(controller));
routes.post('/', authMiddleware, requireRole('MEDICO'), controller.criarComDTO.bind(controller));


export default routes;
