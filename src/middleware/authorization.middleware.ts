import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * Middleware de autorização.
 * Verifica se o utilizador autenticado tem um dos roles permitidos.
 * Se não tiver, devolve erro 403 (Forbidden).
 */
export function requireRole(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ 
                erro: 'Não autenticado. Token obrigatório.' 
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                erro: `Acesso negado. Roles permitidos: ${roles.join(', ')}` 
            });
        }

        next();
    };
}