import { Request, Response } from 'express';
import { FichaPossuiAlergiasService } from '../services/ficha-possui-alergias.service';

export class FichaPossuiAlergiasController {
    private service = new FichaPossuiAlergiasService();

    // POST /fichas-alergias
    async criar(req: Request, res: Response) {
        try {
            const { id_ficha_anamnese, id_alergia } = req.body;

            // Validação de segurança básica
            if (!id_ficha_anamnese || !id_alergia) {
                return res.status(400).json({ erro: "Os IDs da Ficha e da Alergia são obrigatórios." });
            }

            // Usamos o Number() para garantir que os dados passam como inteiros para o serviço
            const novaLigacao = await this.service.criarLigacao(
                Number(id_ficha_anamnese),
                Number(id_alergia)
            );

            return res.status(201).json({
                mensagem: "Alergia associada à ficha de anamnese com sucesso!",
                ligacao: novaLigacao
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}