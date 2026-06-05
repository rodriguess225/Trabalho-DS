import { Request, Response } from 'express';
import { SintomaReportadoService } from '../services/sintomareportado.service';

export class SintomaReportadoController {
    private service = new SintomaReportadoService();

    // GET /sintomas/utente/:id_utente
    async listarPorUtente(req: Request, res: Response) {
        try {
            const id_utente = parseInt(req.params.id_utente as string);

            if (isNaN(id_utente)) {
                return res.status(400).json({ erro: "ID de utente inválido." });
            }

            const sintomas = await this.service.listarPorUtente(id_utente);
            return res.json(sintomas);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // POST /sintomas
    async criar(req: Request, res: Response) {
        try {
            const { 
                id_utente, 
                tipoSintoma, 
                gravidade, 
                dataSintoma, 
                numSintoma, 
                descricao, 
                sintomaPresistente 
            } = req.body;

            // Validações essenciais do ecrã de registo do utente
            if (!id_utente || !tipoSintoma || gravidade === undefined) {
                return res.status(400).json({ 
                    erro: "Os campos id_utente, tipoSintoma e gravidade são obrigatórios." 
                });
            }

            // Captura quem está a submeter (o próprio utente autenticado)
            const id_utilizador_que_reportou = (req as any).user ? (req as any).user.id : 1;

            const novoRegisto = await this.service.reportarSintoma(
                { id_utente, tipoSintoma, gravidade, dataSintoma, numSintoma, descricao, sintomaPresistente } as any,
                id_utilizador_que_reportou
            );

            return res.status(201).json({
                mensagem: "Sintoma reportado com sucesso! A plataforma avaliou os limiares de risco clínico.",
                sintoma: novoRegisto
            });
        } catch (error: any) {
            if (error.message === "Utente não encontrado no sistema.") {
                return res.status(404).json({ erro: error.message });
            }
            return res.status(400).json({ erro: error.message });
        }
    }
}