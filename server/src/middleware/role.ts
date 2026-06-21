/**
 * Middleware de verificación de roles.
 * Restringe el acceso a usuarios con roles específicos.
 */
import { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';

export function roleMiddleware(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: `Acción permitida solo para: ${roles.join(', ')}.` });
      return;
    }

    next();
  };
}
