import { Request, Response } from 'express';
import { ConfiguracaoLimiaresService } from '../services/configuracaolimiares.service';

export class ConfiguracaoLimiaresController {
    private service = new ConfiguracaoLimiaresService();

    // GET /configuracoes/limiar-atual
    async obterAtual(req: Request, res: Response) {
        try {
            const limiar = await this.service.obterLimiarAtual();
            // Devolvemos num objeto JSON para o frontend ler facilmente (ex: data.limiar_score)
            return res.json({ limiar_score: limiar });
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // POST /configuracoes
    async atualizar(req: Request, res: Response) {
        try {
            const { limiar_score, delta_deterioracao } = req.body;

            if (!limiar_score) {
                return res.status(400).json({ erro: "O valor do limiar_score é obrigatório." });
            }

            // Apanhar o ID do Admin logado (com fallback para 1 se estiveres a testar sem auth)
            const id_admin_que_alterou = (req as any).user ? (req as any).user.id : 1;

            const novaConfig = await this.service.atualizarLimiar(
                { limiar_score, delta_deterioracao } as any, 
                id_admin_que_alterou
            );

            return res.status(201).json({
                mensagem: "Configurações de limiares atualizadas com sucesso!",
                configuracao: novaConfig
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}