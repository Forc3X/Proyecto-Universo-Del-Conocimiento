/**
 * Middleware de autenticación JWT.
 * Verifica el token y adjunta el usuario a la request.
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    username: string;
    role: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Token requerido.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'universo-secreto-cambiar-en-produccion';
    const decoded = jwt.verify(token, secret) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}
