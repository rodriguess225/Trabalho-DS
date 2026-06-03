import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../config/app.config';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        username: string;
        role: string;
    };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ erro: 'Token não fornecido.' });
        return;
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        res.status(401).json({ erro: 'Formato do token inválido. Usa: Bearer <token>' });
        return;
    }

    try {
        const decoded = jwt.verify(token, appConfig.auth.jwtSecret) as any;
        req.user = decoded; 
        next(); 
    } catch {
        res.status(401).json({ erro: 'Token inválido ou expirado.' });
        return;
    }
}