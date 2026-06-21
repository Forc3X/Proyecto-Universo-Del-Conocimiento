/**
 * Controlador del tutor.
 * Devuelve los estudiantes asignados al tutor autenticado.
 */
import { Response } from 'express';
import pool from '../db/connection.js';
import type { AuthRequest } from '../middleware/auth.js';

/** GET /api/tutor/students */
export async function getMyStudents(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado.' });
      return;
    }

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.username, u.created_at
       FROM tutor_students ts
       JOIN users u ON u.id = ts.student_id
       WHERE ts.tutor_id = ?
       ORDER BY u.name ASC`,
      [req.user.id],
    );

    res.json(rows);
  } catch (error) {
    console.error('Error en getMyStudents:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
