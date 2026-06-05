import { Request, Response } from 'express';
import { MedicoService } from '../services/medico.service';

export class MedicoController {
    private service = new MedicoService();

    // GET /medicos
    async listar(req: Request, res: Response) {
        try {
            const medicos = await this.service.listarMedicos();
            return res.json(medicos);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // GET /medicos/:id
    // Procura o médico pelo ID específico da tabela de médicos (id_medico)
    async buscarPorId(req: Request, res: Response) {
        try {
            const id_medico = parseInt(req.params.id as string);

            if (isNaN(id_medico)) {
                return res.status(400).json({ erro: "ID do médico inválido." });
            }

            const medico = await this.service.buscarPorId(id_medico);

            if (!medico) {
                return res.status(404).json({ erro: "Médico não encontrado." });
            }

            return res.json(medico);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // GET /medicos/utilizador/:id_utilizador
    // Procura o perfil do médico usando o ID geral da conta (id_utilizador)
    async buscarPorIdUtilizador(req: Request, res: Response) {
        try {
            const id_utilizador = parseInt(req.params.id_utilizador as string);

            if (isNaN(id_utilizador)) {
                return res.status(400).json({ erro: "ID de utilizador inválido." });
            }

            const medico = await this.service.buscarPorIdUtilizador(id_utilizador);

            if (!medico) {
                return res.status(404).json({ erro: "Perfil de médico não encontrado para este utilizador." });
            }

            return res.json(medico);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    // POST /medicos
    async criar(req: Request, res: Response) {
        try {
            const { id_utilizador, especialidade, numCedula } = req.body;

            if (!id_utilizador) {
                return res.status(400).json({ erro: "O campo id_utilizador é obrigatório." });
            }

            // Captura o ID do Admin logado que está a registar o profissional
            const id_admin_que_criou = (req as any).user ? (req as any).user.id : 1;

            // O 'as any' para contornar restrições estritas de propriedades opcionais do DTO
            const novoMedico = await this.service.criarMedico(
                { id_utilizador, especialidade, numCedula } as any,
                id_admin_que_criou
            );

            return res.status(201).json({
                mensagem: "Perfil profissional do médico registado com sucesso!",
                medico: novoMedico
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

  // Adiciona este método ao teu MedicoController
    async listarUtentes(req: Request, res: Response) {
        try {
            // 🚨 AQUI: Adiciona o "as string"
            const id_medico = parseInt(req.params.id as string);
            
            // É boa prática validar se o ID é um número
            if (isNaN(id_medico)) {
                return res.status(400).json({ erro: "ID do médico inválido." });
            }

            const utentes = await this.service.listarUtentesDoMedico(id_medico);
            return res.json(utentes);
        } catch (error: any) {
            return res.status(500).json({ erro: "Erro ao buscar utentes" });
        }
    }
async apagar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            await this.service.apagarMedico(id);
            return res.status(200).json({ mensagem: "Médico removido com sucesso do sistema." });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message || "Erro ao apagar médico." });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const medicoAtualizado = await this.service.atualizarMedico(id, req.body);
            return res.status(200).json(medicoAtualizado);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message || "Erro ao atualizar médico." });
        }
    }
}