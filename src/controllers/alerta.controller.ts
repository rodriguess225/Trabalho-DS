import { Request, Response } from 'express';
import { AlertaService } from '../services/alerta.service';

export class AlertaController {
    private service = new AlertaService();

    // GET /alertas/medico/:id_medico
    async listarPorMedico(req: Request, res: Response) {
        try {
            // Usamos o 'as string' para o TypeScript aceitar
            const id_medico = parseInt(req.params.id_medico as string);
            
            if (isNaN(id_medico)) {
                return res.status(400).json({ erro: "ID do médico inválido." });
            }

            const alertas = await this.service.listarAlertasPorMedico(id_medico);
            return res.json(alertas);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // PATCH (ou PUT) /alertas/:id/estado
    async atualizarEstado(req: Request, res: Response) {
        try {
            const id_alerta = parseInt(req.params.id as string);
            const { estado } = req.body; 

            // Se ainda não houver user no token de login durante os testes, usamos um ID provisório (ex: 1)
            const id_medico_que_alterou = (req as any).user ? (req as any).user.id : 1; 

            if (!estado) {
                return res.status(400).json({ erro: "O novo estado é obrigatório." });
            }

            const alertaAtualizado = await this.service.atualizarEstado(id_alerta, estado, id_medico_que_alterou);
            
            return res.json({ 
                mensagem: "Estado do alerta atualizado com sucesso!", 
                alerta: alertaAtualizado 
            });
        } catch (error: any) {
            if (error.message === "Alerta não encontrado.") {
                return res.status(404).json({ erro: error.message });
            }
            return res.status(400).json({ erro: error.message });
        }
    }

    // POST /alertas (Apesar de o alerta ser gerado pelo Motor CARAT internamente, 
    //dá jeito ter o endpoint para testar via Postman ou Frontend)
    async criar(req: Request, res: Response) {
        try {
            const { id_utente, id_medico, id_avaliacao_origem, tipo, prioridade, motivo } = req.body;

            const novoAlerta = await this.service.gerarAlerta({
                id_utente, 
                id_medico, 
                id_avaliacao_origem, 
                tipo, 
                prioridade, 
                motivo
            });

            return res.status(201).json({
                mensagem: "Alerta gerado no sistema.",
                alerta: novoAlerta
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}