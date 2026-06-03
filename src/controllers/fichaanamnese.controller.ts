import { Request, Response } from 'express';
import { FichaAnamneseService } from '../services/fichaanamnese.service';

export class FichaAnamneseController {
    private service = new FichaAnamneseService();

    // POST /fichas-anamnese
    async criar(req: Request, res: Response) {
        try {
            const { id_utente, estadoTabagico, antecedentes, peso, altura, alergias } = req.body;

            // Validação do campo obrigatório
            if (!id_utente) {
                return res.status(400).json({ erro: "O campo id_utente é obrigatório." });
            }

            // Usamos o 'as any' para o TypeScript aceitar o objeto DTO sem chiar com as tipagens estritas
            const novaFicha = await this.service.criar(
                { id_utente, estadoTabagico, antecedentes, peso, altura, alergias } as any
            );

            return res.status(201).json({
                mensagem: "Ficha de Anamnese e respetivas alergias registadas com sucesso!",
                ficha: novaFicha
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}