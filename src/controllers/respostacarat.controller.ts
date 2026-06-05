import { Request, Response } from 'express';
import { RespostaCaratService } from '../services/respostacarat.service';

export class RespostaCaratController {
    private service = new RespostaCaratService();

    // POST /respostas-carat
    async criar(req: Request, res: Response) {
        try {
            const { id_avaliacao, num_pergunta, valor_pontuacao } = req.body;

            if (!id_avaliacao || !num_pergunta || valor_pontuacao === undefined) {
                return res.status(400).json({ 
                    erro: "Os campos id_avaliacao, num_pergunta e valor_pontuacao são obrigatórios." 
                });
            }

            const novaResposta = await this.service.criarResposta(
                Number(id_avaliacao),
                Number(num_pergunta),
                Number(valor_pontuacao)
            );

            return res.status(201).json({
                mensagem: "Resposta individual do questionário registada com sucesso!",
                resposta: novaResposta
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}