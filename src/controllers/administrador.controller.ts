import { Request, Response } from 'express';
import { AdministradorService } from '../services/administrador.service';

export class AdministradorController {
    private service = new AdministradorService();

    async listar(req: Request, res: Response) {
        const administradores = await this.service.listarAdministradores();
        return res.json(administradores);
    }

    async buscarPorId(req: Request, res: Response) {
        const id_utilizador = parseInt(req.params.id as string);
        const admin = await this.service.buscarPorIdUtilizador(id_utilizador);
        
        if (!admin) {
            return res.status(404).json({ erro: "Administrador não encontrado." });
        }
        
        return res.json(admin);
    }

    async criar(req: Request, res: Response) {
        try {
        
            const { id_Utilizador } = req.body;
            
            const id_utilizador_que_criou = (req as any).user ? (req as any).user.id : undefined;

            const novoAdmin = await this.service.criarAdministrador(
                { id_Utilizador }, 
                id_utilizador_que_criou
            );

            return res.status(201).json({
                mensagem: "Administrador criado com sucesso!",
                administrador: novoAdmin
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}