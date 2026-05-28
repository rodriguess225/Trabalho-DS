import { Router } from 'express';
import { AppDataSource } from '../database/database';
import { Alerta } from '../models/alerta.entity';

const routes = Router();

routes.get('/', async (req, res) => {
    try {
        const alertaRepo = AppDataSource.getRepository(Alerta);
        const alertas = await alertaRepo.find({ 
            relations: ['utente'],
            order: { id: 'DESC' } // Mostra os mais recentes primeiro
        });
        res.json(alertas);
    } catch (err) {
        console.error("Erro ao buscar alertas:", err);
        res.status(500).json({ erro: "Erro ao buscar alertas" });
    }
});

export default routes;