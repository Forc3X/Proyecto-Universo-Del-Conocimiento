/**
 * Controlador de planetas.
 * Devuelve planetas con sus cursos y niveles.
 * Si el usuario es estudiante, incluye su progreso.
 */
import { Response } from 'express';
import pool from '../db/connection.js';
import type { AuthRequest } from '../middleware/auth.js';

/** GET /api/planets */
export async function getPlanets(req: AuthRequest, res: Response): Promise<void> {
  try {
    const [planetRows] = await pool.query(
      'SELECT * FROM planets ORDER BY planet_order ASC',
    );
    const planets = planetRows as any[];

    // Cargar cursos y niveles para cada planeta
    for (const planet of planets) {
      const [courseRows] = await pool.query(
        'SELECT * FROM courses WHERE planet_id = ? ORDER BY course_order ASC',
        [planet.id],
      );
      planet.courses = courseRows as any[];

      for (const course of planet.courses) {
        const [levelRows] = await pool.query(
          'SELECT * FROM levels WHERE course_id = ? ORDER BY level_order ASC',
          [course.id],
        );
        course.levels = levelRows as any[];

        // Si es estudiante, incluir progreso
        if (req.user?.role === 'student') {
          for (const level of course.levels) {
            const [progressRows] = await pool.query(
              'SELECT status, score, stars FROM student_progress WHERE student_id = ? AND level_id = ?',
              [req.user.id, level.id],
            );
            level.progress = (progressRows as any[])[0] || { status: 'locked', score: 0, stars: 0 };
          }
        }
      }
    }

    res.json(planets);
  } catch (error) {
    console.error('Error en getPlanets:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

/** GET /api/planets/:id */
export async function getPlanetById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const [planetRows] = await pool.query('SELECT * FROM planets WHERE id = ?', [id]);
    const planets = planetRows as any[];

    if (planets.length === 0) {
      res.status(404).json({ error: 'Planeta no encontrado.' });
      return;
    }

    const planet = planets[0];

    const [courseRows] = await pool.query(
      'SELECT * FROM courses WHERE planet_id = ? ORDER BY course_order ASC',
      [planet.id],
    );
    planet.courses = courseRows as any[];

    for (const course of planet.courses) {
      const [levelRows] = await pool.query(
        'SELECT * FROM levels WHERE course_id = ? ORDER BY level_order ASC',
        [course.id],
      );
      course.levels = levelRows as any[];

      if (req.user?.role === 'student') {
        for (const level of course.levels) {
          const [progressRows] = await pool.query(
            'SELECT status, score, stars FROM student_progress WHERE student_id = ? AND level_id = ?',
            [req.user.id, level.id],
          );
          level.progress = (progressRows as any[])[0] || { status: 'locked', score: 0, stars: 0 };
        }
      }
    }

    res.json(planet);
  } catch (error) {
    console.error('Error en getPlanetById:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
