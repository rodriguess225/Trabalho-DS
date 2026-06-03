import { Router } from 'express';
import { IntervencaoClinicaController } from '../controllers/intervencaoclinica.controller';

const routes = Router();
const controller = new IntervencaoClinicaController();

routes.post('/', controller.criar.bind(controller));

export default routes;