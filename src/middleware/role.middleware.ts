import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export function roleMiddleware(allowedRoles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ 
                erro: 'Acesso negado. Não tens o perfil necessário para realizar esta ação.' 
            });
            return;
        }

        next();
    };
}