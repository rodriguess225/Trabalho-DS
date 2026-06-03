import { Request, Response } from 'express';
import { ExameService } from '../services/exame.service';

export class ExameController {
    private service = new ExameService();

    // GET /exames
    async listar(req: Request, res: Response) {
        try {
            const exames = await this.service.listarExames();
            return res.json(exames);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // GET /exames/utente/:id_utente
    async listarPorUtente(req: Request, res: Response) {
        try {
            const id_utente = parseInt(req.params.id_utente as string);

            if (isNaN(id_utente)) {
                return res.status(400).json({ erro: "ID de utente inválido." });
            }

            const exames = await this.service.listarPorUtente(id_utente);
            return res.json(exames);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // POST /exames
    async criar(req: Request, res: Response) {
        try {
            const { id_utente, tipoExame, id_intervencao_clinica, dataSolicitacao } = req.body;

            // Pequena validação para garantir que os dados principais não vêm vazios
            if (!id_utente || !tipoExame) {
                return res.status(400).json({ erro: "Os campos id_utente e tipoExame são obrigatórios." });
            }

            // Apanhar o ID do médico (com o fallback habitual para 1)
            const id_medico_que_solicitou = (req as any).user ? (req as any).user.id : 1;

            // Usamos o 'as any' para o TypeScript não bloquear caso o DTO exija mais propriedades opcionais
            const novoExame = await this.service.criarExame(
                { id_utente, tipoExame, id_intervencao_clinica, dataSolicitacao } as any,
                id_medico_que_solicitou
            );

            return res.status(201).json({
                mensagem: "Exame registado com sucesso!",
                exame: novoExame
            });
        } catch (error: any) {
            if (error.message === "Já existe um exame igual registado para este utente.") {
                return res.status(409).json({ erro: error.message }); // 409 Conflict é o HTTP status correto para duplicados!
            }
            return res.status(400).json({ erro: error.message });
        }
    }
}