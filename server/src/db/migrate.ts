/**
 * Migraciones — Esquema SQL de la base de datos.
 *
 * Crea todas las tablas necesarias para el proyecto.
 * Ejecutar con: npm run migrate
 */
import pool from './connection.js';
import dotenv from 'dotenv';

dotenv.config();

const SQL = `
-- Tabla de usuarios (admin, tutor, student, pending)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'tutor', 'student', 'pending') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de planetas temáticos
CREATE TABLE IF NOT EXISTS planets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  short_description VARCHAR(255),
  color VARCHAR(20),
  gradient_style TEXT,
  glow VARCHAR(20),
  glow_color VARCHAR(20),
  icon VARCHAR(10),
  planet_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de cursos dentro de cada planeta
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  planet_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  tutor_description TEXT,
  course_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (planet_id) REFERENCES planets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de niveles dentro de cada curso
CREATE TABLE IF NOT EXISTS levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  level_order INT NOT NULL DEFAULT 0,
  is_boss BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Progreso del estudiante por nivel
CREATE TABLE IF NOT EXISTS student_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  level_id INT NOT NULL,
  status ENUM('locked', 'unlocked', 'completed') NOT NULL DEFAULT 'locked',
  score INT DEFAULT 0,
  stars INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
  UNIQUE KEY unique_progress (student_id, level_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Relación tutor ↔ estudiantes
CREATE TABLE IF NOT EXISTS tutor_students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tutor_id INT NOT NULL,
  student_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_pair (tutor_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sesiones JWT (para invalidación forzada si es necesario)
CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

async function migrate() {
  try {
    const statements = SQL.split(';').filter((s) => s.trim().length > 0);
    for (const stmt of statements) {
      await pool.query(stmt);
    }
    console.log('✅ Migraciones ejecutadas correctamente.');
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
  } finally {
    await pool.end();
  }
}

migrate();
