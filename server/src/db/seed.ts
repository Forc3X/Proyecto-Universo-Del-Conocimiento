/**
 * Seed — Datos de ejemplo para desarrollo.
 *
 * Puebla la base de datos con planetas, cursos, niveles
 * y usuarios de prueba.
 *
 * Ejecutar con: npm run seed
 */
import bcrypt from 'bcrypt';
import pool from './connection.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    console.log('🌱 Sembrando datos de ejemplo...');

    // ── Admin por defecto ──
    const adminHash = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT IGNORE INTO users (name, email, username, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
      ['Administrador', 'admin@universo.com', 'admin', adminHash, 'admin'],
    );

    // ── Tutor ──
    const tutorHash = await bcrypt.hash('tutor123', 10);
    await pool.query(
      `INSERT IGNORE INTO users (name, email, username, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
      ['Prof. María López', 'maria@universo.com', 'maria', tutorHash, 'tutor'],
    );

    // ── Estudiante ──
    const studentHash = await bcrypt.hash('estudiante123', 10);
    await pool.query(
      `INSERT IGNORE INTO users (name, email, username, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
      ['Carlos Pérez', 'carlos@universo.com', 'carlos', studentHash, 'student'],
    );

    // ── Planetas ──
    const planets = [
      {
        name: 'Numérix', description: 'Domina números, operaciones y geometría en un mundo de asteroides y cometas.',
        short_description: 'Matemáticas', color: '#00f5ff',
        gradient_style: 'radial-gradient(circle at 35% 30%, #00f5ff 0%, #0080ff 35%, #0030b0 65%, #000d40 100%)',
        glow: '#00f5ff', glow_color: '#00e4ff', icon: '🔢', planet_order: 1,
      },
      {
        name: 'Verbum', description: 'Conquista palabras, gramática y lectura en una galaxia literaria.',
        short_description: 'Lengua', color: '#bf40ff',
        gradient_style: 'radial-gradient(circle at 35% 30%, #df80ff 0%, #9b30ff 35%, #5a00b0 65%, #1a0040 100%)',
        glow: '#bf40ff', glow_color: '#c840ff', icon: '📖', planet_order: 2,
      },
      {
        name: 'Naturae', description: 'Descubre los secretos de la naturaleza, los ecosistemas y el universo.',
        short_description: 'Ciencias', color: '#00ff88',
        gradient_style: 'radial-gradient(circle at 35% 30%, #80ffb4 0%, #00e070 35%, #008040 65%, #001a14 100%)',
        glow: '#00ff88', glow_color: '#00f080', icon: '🌿', planet_order: 3,
      },
    ];

    for (const p of planets) {
      await pool.query(
        `INSERT IGNORE INTO planets (name, description, short_description, color, gradient_style, glow, glow_color, icon, planet_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.description, p.short_description, p.color, p.gradient_style, p.glow, p.glow_color, p.icon, p.planet_order],
      );
    }

    // ── Cursos y niveles ──
    const [planetRows] = await pool.query('SELECT id, name FROM planets');
    const planetMap = (planetRows as any[]).reduce((acc: any, p: any) => {
      acc[p.name] = p.id;
      return acc;
    }, {} as Record<string, number>);

    const coursesData = [
      {
        planet: 'Numérix', courses: [
          {
            name: 'Cinturón de Asteroides', description: 'Sumas y restas básicas',
            tutor_description: 'El estudiante practicará sumas y restas de números naturales hasta 4 cifras.',
            order: 1, levels: [
              { name: 'Sumas básicas', description: 'Sumas de 1 y 2 cifras', order: 1, is_boss: false },
              { name: 'Restas básicas', description: 'Restas de 1 y 2 cifras', order: 2, is_boss: false },
              { name: 'Reto del Cinturón', description: 'Desafío combinado de sumas y restas', order: 3, is_boss: true },
            ],
          },
          {
            name: 'Campo de Cometas', description: 'Multiplicación y división',
            tutor_description: 'El estudiante aprenderá tablas de multiplicar y división exacta.',
            order: 2, levels: [
              { name: 'Tablas de multiplicar', description: 'Practica las tablas del 1 al 12', order: 1, is_boss: false },
              { name: 'Multiplicación', description: 'Multiplicación por 1 y 2 dígitos', order: 2, is_boss: false },
              { name: 'Reto del Cometa', description: 'Desafío de multiplicación y división', order: 3, is_boss: true },
            ],
          },
        ],
      },
      {
        planet: 'Verbum', courses: [
          {
            name: 'Tormenta de Sílabas', description: 'Separación silábica y acentuación',
            tutor_description: 'El estudiante aprenderá a separar palabras en sílabas y aplicar reglas de acentuación.',
            order: 1, levels: [
              { name: 'Separación silábica', description: 'Divide palabras en sílabas', order: 1, is_boss: false },
              { name: 'Acentuación', description: 'Agudas, llanas y esdrújulas', order: 2, is_boss: false },
              { name: 'Reto de la Tormenta', description: 'Desafío de sílabas y acentos', order: 3, is_boss: true },
            ],
          },
        ],
      },
      {
        planet: 'Naturae', courses: [
          {
            name: 'Bosque Cósmico', description: 'Seres vivos y reinos de la naturaleza',
            tutor_description: 'El estudiante explorará los reinos de la naturaleza y la clasificación de los seres vivos.',
            order: 1, levels: [
              { name: 'Seres vivos', description: 'Características de los seres vivos', order: 1, is_boss: false },
              { name: 'Reinos naturales', description: 'Clasificación en reinos', order: 2, is_boss: false },
              { name: 'Reto del Bosque', description: 'Desafío de ciencias naturales', order: 3, is_boss: true },
            ],
          },
        ],
      },
    ];

    for (const pd of coursesData) {
      const planetId = planetMap[pd.planet];
      if (!planetId) continue;

      for (const c of pd.courses) {
        const [courseResult] = await pool.query(
          `INSERT IGNORE INTO courses (planet_id, name, description, tutor_description, course_order) VALUES (?, ?, ?, ?, ?)`,
          [planetId, c.name, c.description, c.tutor_description, c.order],
        );
        const courseId = (courseResult as any).insertId;

        for (const l of c.levels) {
          await pool.query(
            `INSERT IGNORE INTO levels (course_id, name, description, level_order, is_boss) VALUES (?, ?, ?, ?, ?)`,
            [courseId, l.name, l.description, l.order, l.is_boss],
          );
        }
      }
    }

    console.log('✅ Seed completado.');
  } catch (error) {
    console.error('❌ Error en seed:', error);
  } finally {
    await pool.end();
  }
}

seed();
