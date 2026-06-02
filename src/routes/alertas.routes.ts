import { Router } from 'express';
import { AppDataSource } from '../database/database';
import { Alerta } from '../models/alerta.entity';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';

const routes = Router();

// Protegido: Apenas MEDICO pode aceder
// Listar alertas
routes.get('/', authMiddleware, requireRole('MEDICO'), async (req, res) => {
    try {
        const alertaRepo = AppDataSource.getRepository(Alerta);
        const alertas = await alertaRepo.find({ 
            relations: ['utente']
        });
        res.json(alertas);
    } catch (err) {
        console.error("Erro ao buscar alertas:", err);
        res.status(500).json({ erro: "Erro ao buscar alertas" });
    }
});

// Protegido: Apenas MEDICO pode aceder
// Atualizar estado do alerta para lido
routes.patch('/:id/ler', authMiddleware, requireRole('MEDICO'), async (req, res) => {
    try {
        const idParam = req.params.id;
        if (!idParam) {
            return res.status(400).json({ erro: 'ID do alerta é obrigatório.' });
        }
        
        const alertaRepo = AppDataSource.getRepository(Alerta);
        const alertaId = Number(idParam);
        
        await alertaRepo.update(alertaId, { estado: 'VISTO' });
        
        res.json({ mensagem: "Alerta atualizado com sucesso" });
    } catch (err) {
        console.error("Erro ao atualizar alerta:", err);
        res.status(500).json({ erro: "Erro ao atualizar alerta" });
    }
});

export default routes;