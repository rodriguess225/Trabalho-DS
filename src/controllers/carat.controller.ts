import { Request, Response } from 'express';
import { CaratService } from '../services/carat.service';
import { CreateCaratDto } from '../dtos/carat/create-carat.dto';

export class CaratController {
    private service = new CaratService();

    listar = async (req: Request, res: Response) => {
        try {
            const avaliacoes = await this.service.listarAvaliacoes();
            return res.json(avaliacoes);
        } catch (error: any) {
            return res.status(500).json({ erro: "Erro ao listar avaliações" });
        }
    }

   criar = async (req: Request, res: Response) => {
        try {
            const dto: CreateCaratDto = req.body;
            const novaAvaliacao = await this.service.submeterAvaliacao(dto);
            
            return res.status(201).json({
                mensagem: "Avaliação CARAT submetida com sucesso",
                resultado: novaAvaliacao
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}