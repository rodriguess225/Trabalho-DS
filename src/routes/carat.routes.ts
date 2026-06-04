import { Router } from 'express';
import { CaratController } from '../controllers/carat.controller';
import { CaratService } from '../services/carat.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const routes = Router();
const controller = new CaratController();
const caratService = new CaratService();

routes.get('/', authMiddleware, roleMiddleware(['MEDICO', 'ADMIN', 'ADMINISTRADOR']), controller.listar.bind(controller));
routes.get('/utente/:id', async (req, res) => {
    try {
        const id_utente = Number(req.params.id);
        const historico = await caratService.obterHistoricoUtente(id_utente); 
        return res.status(200).json(historico);
    } catch (error: any) {
        console.error("ERRO FATAL NA ROTA:", error);
        return res.status(500).json({ erro: "Erro ao obter histórico do CARAT." });
    }
});
routes.post('/submeter', authMiddleware, roleMiddleware(['UTENTE']), controller.submeter.bind(controller));

export default routes;