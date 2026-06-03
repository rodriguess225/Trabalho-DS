import { Request, Response } from 'express';
import { AlergiaService } from '../services/alergia.service';

export class AlergiaController {
    private service = new AlergiaService();

    async listar(req: Request, res: Response) {
        try {
            const alergias = await this.service.listarTodas();
            return res.json(alergias);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async criar(req: Request, res: Response) {
        try {
            const { nomeAlergia } = req.body;

            
            if (!nomeAlergia) {
                return res.status(400).json({ erro: "O campo nomeAlergia é obrigatório." });
            }

            const alergia = await this.service.encontrarOuCriar(nomeAlergia);

            return res.status(201).json({
                mensagem: "Alergia processada com sucesso!",
                alergia: alergia
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}