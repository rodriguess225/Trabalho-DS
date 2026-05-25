import { Request, Response } from 'express';
import { CaratService } from '../services/carat.service';
import { CreateCaratDto } from '../dtos/carat/create-carat.dto';

export class CaratController {
    private service = new CaratService();

    async listar(req: Request, res: Response) {
        const avaliacoes = await this.service.listarAvaliacoes();
        return res.json(avaliacoes);
    }

    


    async criar(req: Request, res: Response) {
        try {
            const dto: CreateCaratDto = req.body;
            const novaAvaliacao = await this.service.submeterAvaliacao(dto);
            
            return res.status(201).json(novaAvaliacao);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}