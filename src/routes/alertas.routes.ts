import { Router } from 'express';
import { AppDataSource } from '../database/database';
import { Alerta } from '../models/alerta.entity';

const routes = Router();

// Listar alertas
routes.get('/', async (req, res) => {
    try {
        const alertaRepo = AppDataSource.getRepository(Alerta);
        const alertas = await alertaRepo.find({ 
            relations: ['utente'],
            order: { id: 'DESC' } 
        });
        res.json(alertas);
    } catch (err) {
        console.error("Erro ao buscar alertas:", err);
        res.status(500).json({ erro: "Erro ao buscar alertas" });
    }
});

// Atualizar estado do alerta para lido
routes.patch('/:id/ler', async (req, res) => {
    try {
        const { id } = req.params;
        const alertaRepo = AppDataSource.getRepository(Alerta);
        
        await alertaRepo.update(id, { lido: true });
        
        res.json({ mensagem: "Alerta atualizado com sucesso" });
    } catch (err) {
        console.error("Erro ao atualizar alerta:", err);
        res.status(500).json({ erro: "Erro ao atualizar alerta" });
    }
});

export default routes;