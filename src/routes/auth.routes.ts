import { Router } from 'express';
import { LoginController } from '../controllers/login.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new LoginController();

// Endpoint de login
router.post('/login', controller.login.bind(controller));

// Endpoint de registo (será implementado depois)
// router.post('/registro', controller.registro.bind(controller));

// Endpoint para obter dados do utilizador autenticado
// router.get('/perfil', authMiddleware, controller.perfil.bind(controller));

export default router;