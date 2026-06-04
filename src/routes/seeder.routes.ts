import { Router } from 'express';
import { SeederController } from '../controllers/seeder.controller';

const routes = Router();
const controller = new SeederController();

// Fica disponível em: POST /seeder/povoar
routes.post('/povoar', controller.povoarBaseDados.bind(controller));

export default routes;