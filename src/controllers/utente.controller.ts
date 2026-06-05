import { Request, Response } from 'express';
import { UtenteService } from '../services/utente.service';

export class UtenteController {
    private service = new UtenteService();

    // GET /utentes
    // Suporta filtros por query parameter, ex: /utentes?id_medico=3
    async listar(req: Request, res: Response) {
        try {
            const id_medico = req.query.id_medico ? parseInt(req.query.id_medico as string) : undefined;
            
            const utentes = await this.service.listarUtentes(id_medico);
            return res.json(utentes);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // GET /utentes/:id
    async buscarPorId(req: Request, res: Response) {
        try {
            const id_utente = parseInt(req.params.id as string);

            if (isNaN(id_utente)) {
                return res.status(400).json({ erro: "ID de utente inválido." });
            }

            const utente = await this.service.buscarPorId(id_utente);

            if (!utente) {
                return res.status(404).json({ erro: "Utente não encontrado." });
            }

            return res.json(utente);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // GET /utentes/utilizador/:id_utilizador
    async buscarPorIdUtilizador(req: Request, res: Response) {
        try {
            const id_utilizador = parseInt(req.params.id_utilizador as string);

            if (isNaN(id_utilizador)) {
                return res.status(400).json({ erro: "ID de utilizador inválido." });
            }

            const utente = await this.service.buscarPorIdUtilizador(id_utilizador);

            if (!utente) {
                return res.status(404).json({ erro: "Perfil de utente não encontrado para este utilizador." });
            }

            return res.json(utente);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // POST /utentes
    async criar(req: Request, res: Response) {
        try {
            const { id_utilizador, id_medico, dataNascimento, morada, genero, numSaude, nif } = req.body;

            if (!id_utilizador) {
                return res.status(400).json({ erro: "O campo id_utilizador é obrigatório." });
            }

            // Captura quem criou o perfil (ex: o próprio utente a registar-se ou um admin)
            const id_utilizador_que_criou = (req as any).user ? (req as any).user.id : 1;

            const novoUtente = await this.service.criarUtente(
                { id_utilizador, id_medico, dataNascimento, morada, genero, numSaude, nif } as any,
                id_utilizador_que_criou
            );

            return res.status(201).json({
                mensagem: "Perfil demográfico do utente criado com sucesso!",
                utente: novoUtente
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    // PATCH /utentes/:id/medico
    async associarMedico(req: Request, res: Response) {
        try {
            const id_utente = parseInt(req.params.id as string);
            const { id_medico } = req.body;

            if (!id_medico) {
                return res.status(400).json({ erro: "O campo id_medico é obrigatório para realizar a associação." });
            }

            // Identifica o utilizador responsável pela transferência ou atribuição clínica
            const id_admin_ou_medico_que_alterou = (req as any).user ? (req as any).user.id : 1;

            const utenteAtualizado = await this.service.associarMedico(
                id_utente,
                Number(id_medico),
                id_admin_ou_medico_que_alterou
            );

            return res.json({
                mensagem: "Responsabilidade clínica atualizada com sucesso para este utente!",
                utente: utenteAtualizado
            });
        } catch (error: any) {
            if (error.message === "Utente não encontrado no sistema.") {
                return res.status(404).json({ erro: error.message });
            }
            return res.status(400).json({ erro: error.message });
        }
    }
    async atualizarPerfil(req: Request, res: Response) {
        try {
            const id_utente = parseInt(req.params.id as string);
            
            if (isNaN(id_utente)) {
                return res.status(400).json({ erro: "ID do utente inválido." });
            }

            const utenteAtualizado = await this.service.atualizarDadosPerfil(id_utente, req.body);
            
            return res.json({ 
                mensagem: "Perfil atualizado com sucesso!", 
                utente: utenteAtualizado 
            });
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async apagar(req: Request, res: Response) {
        try {
            const id_utente = parseInt(req.params.id as string);
            if (isNaN(id_utente)) {
                return res.status(400).json({ erro: "ID de utente inválido." });
            }

            await this.service.apagarUtente(id_utente);
            return res.status(200).json({ mensagem: "Utente removido com sucesso do sistema." });
        } catch (error: any) {
            // Este catch previne que a BD rebente caso o utente já tenha Exames ou Avaliações CARAT que impeçam a exclusão
            return res.status(400).json({ erro: "Não é possível apagar: O utente possui histórico clínico associado." });
        }
    }
}