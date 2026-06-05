import { Request, Response } from 'express';
import { UtilizadorService } from '../services/utilizador.service';

export class UtilizadorController {
    private service = new UtilizadorService();

    // GET /utilizadores/:id
    async buscarPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                return res.status(400).json({ erro: "ID de utilizador inválido." });
            }

            const utilizador = await this.service.buscarPorId(id);

            if (!utilizador) {
                return res.status(404).json({ erro: "Utilizador não encontrado." });
            }

            const { password, ...utilizadorProtegido } = utilizador as any;

            return res.json(utilizadorProtegido);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // POST /utilizadores
    async criar(req: Request, res: Response) {
        try {
            const { nome, email, password, perfil, telemovel } = req.body;

            // Validação dos campos obrigatórios da conta base
            if (!nome || !email || !password || !perfil) {
                return res.status(400).json({ erro: "Os campos nome, email, password e perfil são obrigatórios." });
            }

            // Captura o ID do Admin que está a criar a conta 
            const id_admin_que_criou = (req as any).user ? (req as any).user.id : undefined;

            const novoUtilizador = await this.service.criarUtilizador(
                { nome, email, password, perfil, telemovel } as any,
                id_admin_que_criou
            );

            // Remove a password do objeto de resposta
            const { password: _, ...utilizadorCriado } = novoUtilizador as any;

            return res.status(201).json({
                mensagem: "Conta de utilizador criada com sucesso!",
                utilizador: utilizadorCriado
            });
        } catch (error: any) {
            // Se o email já existir, devolve o status correto
            if (error.message === "Já existe um utilizador registado com este email.") {
                return res.status(409).json({ erro: error.message });
            }
            return res.status(400).json({ erro: error.message });
        }
    }
}