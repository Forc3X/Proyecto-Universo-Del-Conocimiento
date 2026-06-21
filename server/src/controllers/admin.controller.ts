/**
 * Controlador de administración.
 * Lista usuarios y asigna roles (solo admin).
 */
import { Response } from 'express';
import pool from '../db/connection.js';
import type { AuthRequest } from '../middleware/auth.js';

/** GET /api/admin/users */
export async function getUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, username, role, created_at FROM users ORDER BY created_at DESC',
    );
    res.json(rows);
  } catch (error) {
    console.error('Error en getUsers:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

/** POST /api/admin/assign-role */
export async function assignRole(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      res.status(400).json({ error: 'userId y role son requeridos.' });
      return;
    }

    const validRoles = ['student', 'tutor', 'admin'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: `Rol inválido. Válidos: ${validRoles.join(', ')}.` });
      return;
    }

    const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }

    res.json({ message: `Rol "${role}" asignado correctamente.` });
  } catch (error) {
    console.error('Error en assignRole:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
