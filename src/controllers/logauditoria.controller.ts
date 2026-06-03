import { Request, Response } from 'express';
import { LogAuditoriaService } from '../services/logauditoria.service';

export class LogAuditoriaController {
    private service = new LogAuditoriaService();

    // GET /logs
    async listar(req: Request, res: Response) {
        try {
            const logs = await this.service.listarLogs();
            return res.json(logs);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // GET /logs/utilizador/:id_utilizador
    async listarPorUtilizador(req: Request, res: Response) {
        try {
            const id_utilizador = parseInt(req.params.id_utilizador as string);

            if (isNaN(id_utilizador)) {
                return res.status(400).json({ erro: "ID de utilizador inválido." });
            }

            const logs = await this.service.listarLogsPorUtilizador(id_utilizador);
            return res.json(logs);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // POST /logs
    // Principalmente usado para testes manuais no Postman, já que a maioria dos logs é gerada internamente
    async criar(req: Request, res: Response) {
        try {
            const { id_utilizador, tipoAcao, entidadeAfetada, id_registo_afetado, dataHora, valorAntigo, valorNovo } = req.body;

            if (!tipoAcao || !entidadeAfetada) {
                return res.status(400).json({ erro: "Os campos tipoAcao e entidadeAfetada são obrigatórios." });
            }

            // Se o id_utilizador não for enviado no body, tenta capturar o do utilizador logado
            const id_utilizador_final = id_utilizador || ((req as any).user ? (req as any).user.id : null);

            // Usamos o 'as any' preventivo para o TypeScript aceitar a estrutura do DTO sem travar
            const novoLog = await this.service.registarLog({
                id_utilizador: id_utilizador_final,
                tipoAcao,
                entidadeAfetada,
                id_registo_afetado,
                dataHora,
                valorAntigo,
                valorNovo
            } as any);

            return res.status(201).json({
                mensagem: "Log de auditoria registado com sucesso!",
                log: novoLog
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}

