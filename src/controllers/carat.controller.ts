import { Request, Response } from 'express';
import { CaratService } from '../services/carat.service';

export class CaratController {
    private service = new CaratService();

    async listar(req: Request, res: Response) {
        try {
            const avaliacoes = await this.service.listarAvaliacoes();
            return res.json(avaliacoes);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async submeter(req: Request, res: Response) {
        try {
            const { id_utente, respostas } = req.body;

            // Validação simples para evitar que o frontend mande o pedido vazio
            if (!id_utente || !respostas || respostas.length === 0) {
                return res.status(400).json({ erro: "Dados incompletos. O id_utente e as respostas são obrigatórios." });
            }

            const id_utilizador_que_submeteu = (req as any).user ? (req as any).user.id : id_utente;

           const novaAvaliacao = await this.service.submeterAvaliacao(
           { id_utente, respostas } as any, 
           id_utilizador_que_submeteu
        );

            return res.status(201).json({
                mensagem: "Avaliação CARAT submetida e processada com sucesso!",
                avaliacao: novaAvaliacao
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}