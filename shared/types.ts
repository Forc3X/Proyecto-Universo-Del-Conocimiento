/**
 * Tipos compartidos entre frontend y backend.
 * Sirven como contrato único para evitar discrepancias.
 */

/** Roles del sistema */
export type UserRole = 'admin' | 'tutor' | 'student' | 'pending';

/** Usuario del sistema */
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

/** Planeta temático */
export interface Planet {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  color: string;
  gradientStyle: string;
  glow: string;
  glowColor: string;
  icon: string;
  order: number;
  courses: Course[];
}

/** Curso dentro de un planeta */
export interface Course {
  id: number;
  planetId: number;
  name: string;
  description: string;
  tutorDescription: string;
  order: number;
  levels: Level[];
}

/** Nivel dentro de un curso */
export interface Level {
  id: number;
  courseId: number;
  name: string;
  description: string;
  order: number;
  isBoss: boolean;
}

/** Progreso del estudiante en un nivel */
export interface StudentProgress {
  levelId: number;
  status: 'locked' | 'unlocked' | 'completed';
  score: number;
  stars: number;
}

/** Respuesta de autenticación */
export interface AuthResponse {
  token: string;
  user: User;
  redirect: string;
}

/** Datos de login */
export interface LoginData {
  username: string;
  password: string;
}

/** Datos de registro */
export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
}
