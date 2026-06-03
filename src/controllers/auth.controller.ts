import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService = new AuthService();

    // REGISTO DE UTILIZADOR
    async register(req: Request, res: Response): Promise<void> {
        try {
            const dadosRegisto = req.body;
            // Chama o service de forma assíncrona
            const resultado = await this.authService.register(dadosRegisto);
            
            res.status(201).json(resultado);
        } catch (error: any) {
            res.status(400).json({ erro: error.message });
        }
    }

    // LOGIN
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            
            // Chama o service de forma assíncrona
            const token = await this.authService.login(username, password);

            res.status(200).json({
                mensagem: 'Login com sucesso',
                token
            });
        } catch (error: any) {
            res.status(401).json({ erro: error.message });
        }
    }
}