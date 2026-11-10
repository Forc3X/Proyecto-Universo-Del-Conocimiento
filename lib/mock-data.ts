import type { Planet, StudentProgress } from '../shared/types';

export const MOCK_PLANETS: Planet[] = [
  {
    id: 1,
    name: 'Numérix',
    description: 'Domina números, operaciones y geometría.',
    shortDescription: 'Matemáticas',
    color: '#00f5ff',
    gradientStyle: 'radial-gradient(circle at 35% 30%, #00f5ff 0%, #0080ff 35%, #0030b0 65%, #000d40 100%)',
    glow: '#00f5ff',
    glowColor: '#00e4ff',
    icon: '\u2211',
    order: 1,
    courses: [
      {
        id: 1, planetId: 1, name: 'Cinturón de Asteroides', order: 1,
        description: 'Sumas y restas básicas',
        tutorDescription: 'El estudiante practicará sumas y restas de números naturales hasta 4 cifras, con ejercicios de cálculo mental y problemas verbales.',
        levels: [
          { id: 1, courseId: 1, name: 'Nivel 1', description: 'Primeros pasos', order: 1, isBoss: false },
          { id: 2, courseId: 1, name: 'Nivel 2', description: 'En camino', order: 2, isBoss: false },
          { id: 3, courseId: 1, name: 'Nivel 3', description: 'Desafío final', order: 3, isBoss: true },
        ],
      },
      {
        id: 2, planetId: 1, name: 'Campo de Cometas', order: 2,
        description: 'Multiplicación y división',
        tutorDescription: 'El estudiante aprenderá tablas de multiplicar, multiplicación por 1 y 2 dígitos, y división exacta.',
        levels: [
          { id: 4, courseId: 2, name: 'Nivel 1', description: 'Primeros pasos', order: 1, isBoss: false },
          { id: 5, courseId: 2, name: 'Nivel 2', description: 'En camino', order: 2, isBoss: false },
          { id: 6, courseId: 2, name: 'Nivel 3', description: 'Desafío final', order: 3, isBoss: true },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Letralia',
    description: 'Conquista palabras, gramática y lectura.',
    shortDescription: 'Lenguas',
    color: '#bf40ff',
    gradientStyle: 'radial-gradient(circle at 35% 30%, #df80ff 0%, #9b30ff 35%, #5a00b0 65%, #1a0040 100%)',
    glow: '#bf40ff',
    glowColor: '#c840ff',
    icon: '\u270E',
    order: 2,
    courses: [
      {
        id: 3, planetId: 2, name: 'Tormenta de Sílabas', order: 1,
        description: 'Separación silábica y acentuación',
        tutorDescription: 'El estudiante aprenderá a separar palabras en sílabas, identificar sílabas tónicas y aplicar reglas de acentuación.',
        levels: [
          { id: 7, courseId: 3, name: 'Nivel 1', description: 'Primeros pasos', order: 1, isBoss: false },
          { id: 8, courseId: 3, name: 'Nivel 2', description: 'En camino', order: 2, isBoss: false },
          { id: 9, courseId: 3, name: 'Nivel 3', description: 'Desafío final', order: 3, isBoss: true },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Naturae',
    description: 'Descubre la naturaleza y el universo.',
    shortDescription: 'Ciencias',
    color: '#00ff88',
    gradientStyle: 'radial-gradient(circle at 35% 30%, #80ffb4 0%, #00e070 35%, #008040 65%, #001a14 100%)',
    glow: '#00ff88',
    glowColor: '#00f080',
    icon: '\u2618',
    order: 3,
    courses: [
      {
        id: 4, planetId: 3, name: 'Bosque Cósmico', order: 1,
        description: 'Seres vivos y reinos de la naturaleza',
        tutorDescription: 'El estudiante explorará los reinos de la naturaleza, las características de los seres vivos y su clasificación.',
        levels: [
          { id: 10, courseId: 4, name: 'Nivel 1', description: 'Primeros pasos', order: 1, isBoss: false },
          { id: 11, courseId: 4, name: 'Nivel 2', description: 'En camino', order: 2, isBoss: false },
          { id: 12, courseId: 4, name: 'Nivel 3', description: 'Desafío final', order: 3, isBoss: true },
        ],
      },
    ],
  },
];

export const MOCK_PROGRESS: Record<number, StudentProgress> = {
  1: { levelId: 1, status: 'unlocked', score: 0, stars: 0 },
  7: { levelId: 7, status: 'unlocked', score: 0, stars: 0 },
};

export function getPlanetById(id: number): Planet | undefined {
  return MOCK_PLANETS.find((p) => p.id === id);
}

export function getLevelProgress(levelId: number): StudentProgress {
  return MOCK_PROGRESS[levelId] || { levelId, status: 'locked' as const, score: 0, stars: 0 };
}