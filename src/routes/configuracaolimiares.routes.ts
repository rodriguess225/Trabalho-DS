import { Router } from 'express';
import { ConfiguracaoLimiaresController } from '../controllers/configuracaolimiares.controller';

const routes = Router();
const controller = new ConfiguracaoLimiaresController();

routes.get('/limiar-atual', controller.obterAtual.bind(controller));
routes.post('/', controller.atualizar.bind(controller));

export default routes;