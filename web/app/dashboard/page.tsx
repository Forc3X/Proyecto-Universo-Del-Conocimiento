'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../lib/auth-store';

const FondoCosmico = dynamic(() => import('../FondoCosmico'), { ssr: false });
import type { Planet, Course, Level, StudentProgress } from '../../../shared/types';

const MOCK_PLANETS: Planet[] = [
  {
    id: 1,
    name: 'Numérix',
    description: 'Domina números, operaciones y geometría.',
    shortDescription: 'Matemáticas',
    color: '#00f5ff',
    gradientStyle: 'radial-gradient(circle at 35% 30%, #00f5ff 0%, #0080ff 35%, #0030b0 65%, #000d40 100%)',
    glow: '#00f5ff',
    glowColor: '#00e4ff',
    icon: '🔢',
    order: 1,
    courses: [
      {
        id: 1, planetId: 1, name: 'Cinturón de Asteroides', order: 1,
        description: 'Sumas y restas básicas',
        tutorDescription: 'El estudiante practicará sumas y restas de números naturales hasta 4 cifras, con ejercicios de cálculo mental y problemas verbales.',
        levels: [
          { id: 1, courseId: 1, name: 'Sumas básicas', description: 'Sumas de 1 y 2 cifras', order: 1, isBoss: false },
          { id: 2, courseId: 1, name: 'Restas básicas', description: 'Restas de 1 y 2 cifras', order: 2, isBoss: false },
          { id: 3, courseId: 1, name: 'Reto del Cinturón', description: 'Desafío combinado', order: 3, isBoss: true },
        ],
      },
      {
        id: 2, planetId: 1, name: 'Campo de Cometas', order: 2,
        description: 'Multiplicación y división',
        tutorDescription: 'El estudiante aprenderá tablas de multiplicar, multiplicación por 1 y 2 dígitos, y división exacta.',
        levels: [
          { id: 4, courseId: 2, name: 'Tablas de multiplicar', description: 'Practica las tablas', order: 1, isBoss: false },
          { id: 5, courseId: 2, name: 'Multiplicación', description: 'Multiplicación por 1 y 2 dígitos', order: 2, isBoss: false },
          { id: 6, courseId: 2, name: 'Reto del Cometa', description: 'Desafío de multiplicación y división', order: 3, isBoss: true },
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
    icon: '📖',
    order: 2,
    courses: [
      {
        id: 3, planetId: 2, name: 'Tormenta de Sílabas', order: 1,
        description: 'Separación silábica y acentuación',
        tutorDescription: 'El estudiante aprenderá a separar palabras en sílabas, identificar sílabas tónicas y aplicar reglas de acentuación.',
        levels: [
          { id: 7, courseId: 3, name: 'Separación silábica', description: 'Divide palabras en sílabas', order: 1, isBoss: false },
          { id: 8, courseId: 3, name: 'Acentuación', description: 'Palabras agudas, llanas y esdrújulas', order: 2, isBoss: false },
          { id: 9, courseId: 3, name: 'Reto de la Tormenta', description: 'Desafío de sílabas', order: 3, isBoss: true },
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
    icon: '🌿',
    order: 3,
    courses: [
      {
        id: 4, planetId: 3, name: 'Bosque Cósmico', order: 1,
        description: 'Seres vivos y reinos de la naturaleza',
        tutorDescription: 'El estudiante explorará los reinos de la naturaleza, las características de los seres vivos y su clasificación.',
        levels: [
          { id: 10, courseId: 4, name: 'Seres vivos', description: 'Características de los seres vivos', order: 1, isBoss: false },
          { id: 11, courseId: 4, name: 'Reinos naturales', description: 'Clasificación en reinos', order: 2, isBoss: false },
          { id: 12, courseId: 4, name: 'Reto del Bosque', description: 'Desafío de ciencias', order: 3, isBoss: true },
        ],
      },
    ],
  },
];

const MOCK_PROGRESS: Record<number, StudentProgress> = {
  1: { levelId: 1, status: 'completed', score: 90, stars: 3 },
  2: { levelId: 2, status: 'unlocked', score: 0, stars: 0 },
  3: { levelId: 3, status: 'locked', score: 0, stars: 0 },
};

function StudentView({ planets, progress }: { planets: Planet[]; progress: Record<number, StudentProgress> }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-black tracking-wide text-center" style={{
        background: 'linear-gradient(135deg, #fff, #80f0ff, #c080ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        MAPA ESTELAR
      </h1>
      <p className="text-center text-slate-400 text-sm">Selecciona un planeta para comenzar tu misión</p>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {planets.map((planet) => (
          <motion.div
            key={planet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: planet.order * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="text-4xl mb-3">{planet.icon}</div>
              <h2 className="text-xl font-bold text-white">{planet.name}</h2>
              <p className="text-xs text-slate-400 uppercase tracking-widest">{planet.shortDescription}</p>

              <button
                onClick={() => setExpanded(expanded === planet.id ? null : planet.id)}
                className="mt-4 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {expanded === planet.id ? '▲ Ocultar cursos' : '▼ Ver cursos'}
              </button>
            </div>

            {expanded === planet.id && (
              <div className="px-6 pb-6 space-y-3 border-t border-white/10 pt-4">
                {planet.courses.map((course) => (
                  <div key={course.id} className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">{course.name}</h3>
                    <p className="text-xs text-slate-400">{course.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {course.levels.map((level) => {
                        const prog = progress[level.id];
                        const isLocked = !prog || prog.status === 'locked';
                        return (
                          <span
                            key={level.id}
                            className={`text-[10px] px-2 py-1 rounded-full border ${
                              isLocked
                                ? 'border-slate-700 text-slate-600'
                                : prog.status === 'completed'
                                  ? 'border-green-600/50 text-green-400 bg-green-950/30'
                                  : 'border-cyan-600/50 text-cyan-400 bg-cyan-950/30'
                            }`}
                          >
                            {isLocked ? '🔒' : prog.status === 'completed' ? '✅' : '🔓'} {level.name}
                          </span>
                        );
                      })}
                    </div>
                    {course.tutorDescription && (
                      <details className="mt-2">
                        <summary className="text-[10px] text-slate-500 cursor-pointer hover:text-slate-300">
                          📋 Explicación para el tutor
                        </summary>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {course.tutorDescription}
                        </p>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TutorView({ planets }: { planets: Planet[] }) {
  const { users } = useAuthStore();
  const myStudents = users.filter((u) => u.role === 'student');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-black tracking-wide text-center" style={{
        background: 'linear-gradient(135deg, #fff, #80f0ff, #c080ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        PUENTE DE MANDO
      </h1>
      <p className="text-center text-slate-400 text-sm">Visualiza el progreso de tus astronautas</p>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Planetas</h2>
          {planets.map((planet) => (
            <details key={planet.id} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
              <summary className="p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{planet.icon}</span>
                  <div>
                    <span className="text-white font-semibold">{planet.name}</span>
                    <span className="text-xs text-slate-400 ml-2 uppercase">{planet.shortDescription}</span>
                  </div>
                </div>
              </summary>
              <div className="px-4 pb-4 space-y-3">
                {planet.courses.map((course) => (
                  <div key={course.id} className="pl-4 border-l border-white/10">
                    <h3 className="text-sm font-medium text-white">{course.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{course.tutorDescription}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {course.levels.map((l) => (
                        <span key={l.id} className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-slate-400">
                          {l.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Mis estudiantes ({myStudents.length})</h2>
          {myStudents.length === 0 ? (
            <p className="text-sm text-slate-500">No hay estudiantes asignados todavía.</p>
          ) : (
            <div className="space-y-2">
              {myStudents.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">{s.name}</div>
                    <div className="text-xs text-slate-400">@{s.username}</div>
                  </div>
                  <span className="text-xs text-slate-500">Progreso: —</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { user, _hydrated } = useAuthStore();

  useEffect(() => {
    if (!_hydrated) return;
    if (!user) {
      router.push('/');
    }
  }, [user, router, _hydrated]);

  useEffect(() => {
    if (!_hydrated) return;
    if (user?.role === 'admin') {
      router.push('/admin');
    }
  }, [user, router, _hydrated]);

  if (!_hydrated || !user || user.role === 'admin') return null;

  return (
    <div className="relative min-h-screen" style={{ background: '#00000a' }}>
      <FondoCosmico />

      <div className="relative z-10 px-6 py-12">
        {user.role === 'student' && (
          <StudentView planets={MOCK_PLANETS} progress={MOCK_PROGRESS} />
        )}
        {user.role === 'tutor' && (
          <TutorView planets={MOCK_PLANETS} />
        )}
      </div>
    </div>
  );
}
