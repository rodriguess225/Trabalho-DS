import { Request, Response } from 'express';
import { UtenteService } from '../services/utente.service';
import { CreateUtenteDto } from '../dtos/utente/create-utente.dto'; // <-- Import do DTO de volta!

export class UtenteController {
    private service = new UtenteService();

    async listar(req: Request, res: Response) {
        try {
            const utentes = await this.service.listarUtentes();
            return res.json(utentes);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao listar utentes." });
        }
    }

    async criar(req: Request, res: Response) {
        try {
            // Transformação explícita do body no nosso DTO (A forma mais correta e segura)
            const dto: CreateUtenteDto = req.body; 
            
            const novoUtente = await this.service.criarUtente(dto);
            return res.status(201).json(novoUtente);
            
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}