import { Router } from 'express';
import { RespostaCaratController } from '../controllers/respostacarat.controller';

const routes = Router();
const controller = new RespostaCaratController();

routes.post('/', controller.criar.bind(controller));

export default routes;