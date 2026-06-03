import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
    private service = new DashboardService();

    // GET /dashboard/utente/:id_utente
    async obterDashboardUtente(req: Request, res: Response) {
        try {
            const id_utente = parseInt(req.params.id_utente as string);

            if (isNaN(id_utente)) {
                return res.status(400).json({ erro: "O ID do utente é inválido." });
            }

            // Apanhar o ID do Médico logado. Fallback para 1 (ou podes deixar undefined consoante a tua regra de Log)
            const id_medico_que_consulta = (req as any).user ? (req as any).user.id : 1;

            const dashboardCompleto = await this.service.obterHistoricoCompletoUtente(
                id_utente,
                id_medico_que_consulta
            );

            return res.json(dashboardCompleto);
        } catch (error: any) {
            if (error.message === "Utente não encontrado no sistema.") {
                return res.status(404).json({ erro: error.message });
            }
            return res.status(500).json({ erro: error.message });
        }
    }
}