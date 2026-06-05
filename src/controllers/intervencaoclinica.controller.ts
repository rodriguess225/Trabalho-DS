import { Request, Response } from 'express';
import { IntervencaoClinicaService } from '../services/intervencaoclinica.service';

export class IntervencaoClinicaController {
    private service = new IntervencaoClinicaService();

    // POST /intervencoes
    async criar(req: Request, res: Response) {
        try {
            const { id_utente, id_medico, id_alerta, notasMedicas, acoesTomadas } = req.body;

            if (!id_utente || !id_medico) {
                return res.status(400).json({ erro: "Os campos id_utente e id_medico são obrigatórios." });
            }

            const id_medico_que_registou = (req as any).user ? (req as any).user.id : id_medico;

            const novaIntervencao = await this.service.registarIntervencao(
                { id_utente, id_medico, id_alerta, notasMedicas, acoesTomadas } as any,
                id_medico_que_registou
            );

            return res.status(201).json({
                mensagem: "Intervenção clínica registada e alerta atualizado com sucesso!",
                intervencao: novaIntervencao
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
    async listarPorUtente(req: Request, res: Response) {
        try {
            const id_utente = parseInt(req.params.id as string);
            if (isNaN(id_utente)) {
                return res.status(400).json({ erro: "ID do utente inválido." });
            }

            const intervencoes = await this.service.buscarPorUtente(id_utente);
            return res.json(intervencoes);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}