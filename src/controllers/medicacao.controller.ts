import { Request, Response } from 'express';
import { MedicacaoService } from '../services/medicacao.service';

export class MedicacaoController {
    private service = new MedicacaoService();

    // GET /medicacoes/utente/:id_utente
    async listarPorUtente(req: Request, res: Response) {
        try {
            const id_utente = parseInt(req.params.id_utente as string);

            if (isNaN(id_utente)) {
                return res.status(400).json({ erro: "ID de utente inválido." });
            }

            const listaMedicacao = await this.service.listarPorUtente(id_utente);
            return res.json(listaMedicacao);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // POST /medicacoes
    async criar(req: Request, res: Response) {
        try {
            const { id_utente, id_intervencao_clinica, nomeMedicacao, dose, frequencia, dataPrescricao, dataFinal } = req.body;

            // Validações básicas antes de enviar para o serviço
            if (!id_utente || !nomeMedicacao) {
                return res.status(400).json({ erro: "Os campos id_utente e nomeMedicacao são obrigatórios." });
            }

            // Captura o ID do utilizador (médico) logado que está a prescrever a medicação
            const id_utilizador = (req as any).user ? (req as any).user.id : 1;

            // O 'as any'  para o DTO passar sem queixas do TypeScript
            const novaMedicacao = await this.service.adicionarMedicacao(
                { id_utente, id_intervencao_clinica, nomeMedicacao, dose, frequencia, dataPrescricao, dataFinal } as any,
                id_utilizador
            );

            return res.status(201).json({
                mensagem: "Medicação adicionada ao plano do utente com sucesso!",
                medicacao: novaMedicacao
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}