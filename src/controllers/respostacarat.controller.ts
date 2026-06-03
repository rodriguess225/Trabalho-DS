import { Request, Response } from 'express';
import { RespostaCaratService } from '../services/respostacarat.service';

export class RespostaCaratController {
    private service = new RespostaCaratService();

    // POST /respostas-carat
    async criar(req: Request, res: Response) {
        try {
            const { id_avaliacao, num_pergunta, valor_pontuacao } = req.body;

            // Validação detalhada (repara que validamos se valor_pontuacao é undefined, 
            // porque o valor '0' é uma resposta válida no CARAT e o JavaScript pode confundi-lo com "falso")
            if (!id_avaliacao || !num_pergunta || valor_pontuacao === undefined) {
                return res.status(400).json({ 
                    erro: "Os campos id_avaliacao, num_pergunta e valor_pontuacao são obrigatórios." 
                });
            }

            // Chamada ao serviço passando os parâmetros convertidos em número por segurança
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