import { Router } from 'express';
import { FichaAnamneseController } from '../controllers/fichaanamnese.controller';

const routes = Router();
const controller = new FichaAnamneseController();

routes.post('/', controller.criar.bind(controller));

export default routes;