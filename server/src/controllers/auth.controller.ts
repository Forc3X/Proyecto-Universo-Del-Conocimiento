/**
 * Controlador de autenticación.
 * Maneja registro y login de usuarios.
 */
import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import pool from '../db/connection.js';
import type { AuthRequest } from '../middleware/auth.js';

/** POST /api/auth/register */
export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      return;
    }

    // Verificar si ya existe
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email],
    );
    if ((existing as any[]).length > 0) {
      res.status(409).json({ error: 'El usuario o correo ya existe.' });
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, username, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, username, hash, 'pending'],
    );

    res.status(201).json({
      message: 'Registro exitoso. Espera a que un administrador asigne tu rol.',
      userId: (result as any).insertId,
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

/** POST /api/auth/login */
export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Usuario y contraseña requeridos.' });
      return;
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, username, password_hash, role, created_at FROM users WHERE username = ?',
      [username],
    );
    const users = rows as any[];

    if (users.length === 0) {
      res.status(401).json({ error: 'Usuario no encontrado.' });
      return;
    }

    const user = users[0];

    if (user.role === 'pending') {
      res.status(403).json({ error: 'Tu cuenta está pendiente de aprobación.' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Contraseña incorrecta.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'universo-secreto-cambiar-en-produccion';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, username: user.username, role: user.role },
      secret,
      { expiresIn } as SignOptions,
    );

    // Guardar sesión
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt],
    );

    // Calcular ruta de redirección según rol
    const redirectMap: Record<string, string> = {
      admin: '/admin',
      tutor: '/dashboard',
      student: '/dashboard',
    };

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.created_at,
      },
      redirect: redirectMap[user.role] || '/',
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

/** GET /api/auth/me */
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado.' });
      return;
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, username, role, created_at FROM users WHERE id = ?',
      [req.user.id],
    );
    const users = rows as any[];

    if (users.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }

    const u = users[0];
    res.json({
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.username,
      role: u.role,
      createdAt: u.created_at,
    });
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
