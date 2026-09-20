'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PlanetVisual from '../components/PlanetVisual';
import { useAuthStore } from '../../lib/auth-store';
import { MOCK_PLANETS, MOCK_PROGRESS } from '../../lib/mock-data';
import type { Planet, StudentProgress } from '../../shared/types';

function StudentView({ planets, progress, user }: { planets: Planet[]; progress: Record<number, StudentProgress>; user?: any }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);

  const getPlanetStyles = (name: string) => {
    if (name.includes('Numérix')) return { color: '#00f5ff', gradient: 'from-[#00f5ff]/10 to-[#00f5ff]/5' };
    if (name.includes('Letralia')) return { color: '#bf40ff', gradient: 'from-[#bf40ff]/10 to-[#bf40ff]/5' };
    if (name.includes('Naturae')) return { color: '#00ff88', gradient: 'from-[#00ff88]/10 to-[#00ff88]/5' };
    return { color: '#80f0ff', gradient: 'from-[#80f0ff]/10 to-[#80f0ff]/5' };
  };

  return (
    <div className="space-y-8">
      {/* Banner Superior de Bienvenida */}
      <div className="max-w-5xl mx-auto rounded-2xl bg-gradient-to-r from-slate-900/80 to-black/80 backdrop-blur-md border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between shadow-[0_0_20px_rgba(0,245,255,0.1)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(0,245,255,0.4)]">
            👩‍🚀
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">¡Hola, {user?.name || 'Explorador'}!</h2>
          </div>
        </div>
        <div className="mt-4 md:mt-0 bg-black/40 px-6 py-3 rounded-full border border-cyan-500/30 flex items-center gap-3 relative z-10">
          <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]">⭐</span>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Estrellas</div>
            <div className="text-xl font-black text-white">0</div>
          </div>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-black tracking-wide text-center bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
        MAPAS ESTELARES
      </h1>
      <p className="text-center text-gray-300 font-medium text-lg md:text-xl mb-10">Selecciona un planeta para comenzar tu misión</p>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {planets.map((planet) => {
          const styles = getPlanetStyles(planet.name);
          return (
            <motion.div
              key={planet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: planet.order * 0.1 }}
              className={`rounded-2xl border bg-gradient-to-b ${styles.gradient} backdrop-blur-md overflow-hidden relative group`}
              style={{
                borderColor: `${styles.color}40`,
                boxShadow: `0 0 15px ${styles.color}20`
              }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-screen group-hover:opacity-30 transition-opacity duration-700"></div>
              
              <div className="p-6 text-center relative z-10">
                <div className="mb-6 flex justify-center scale-75 transform-origin-top">
                  <PlanetVisual name={planet.name} />
                </div>
                
                <h2 className="text-2xl font-black text-white mb-1 tracking-wide" style={{ textShadow: `0 0 10px ${styles.color}80` }}>{planet.name}</h2>
                <p className="text-xs text-slate-300 uppercase tracking-widest mb-6 font-medium h-8">{planet.shortDescription}</p>
                
                <button
                  onClick={() => router.push(`/planeta/${planet.id}`)}
                  className="w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                  style={{
                    background: `linear-gradient(90deg, ${styles.color}20, ${styles.color}40)`,
                    border: `1px solid ${styles.color}80`,
                    color: '#fff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 20px ${styles.color}60`;
                    e.currentTarget.style.background = `linear-gradient(90deg, ${styles.color}40, ${styles.color}60)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = `linear-gradient(90deg, ${styles.color}20, ${styles.color}40)`;
                  }}
                >
                  🚀 Explorar Planeta
                </button>

                <button
                  onClick={() => setExpanded(expanded === planet.id ? null : planet.id)}
                  className="text-xs font-bold transition-colors uppercase tracking-widest flex items-center justify-center gap-1 mx-auto"
                  style={{ color: styles.color }}
                >
                  {expanded === planet.id ? '▲ Ocultar cursos' : '▼ Ver cursos'}
                </button>
              </div>

              {expanded === planet.id && (
                <div className="px-6 pb-6 space-y-3 pt-4 bg-black/40 relative z-10" style={{ borderTop: `1px solid ${styles.color}30` }}>
                  {planet.courses.map((course) => (
                    <div key={course.id} className="space-y-1">
                      <h3 className="text-sm font-bold text-white">{course.name}</h3>
                      <p className="text-xs text-slate-300">{course.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {course.levels.map((level) => {
                          const prog = progress[level.id];
                          const isLocked = !prog || prog.status === 'locked';
                          return (
                            <span
                              key={level.id}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                                isLocked
                                  ? 'border-slate-700 text-slate-500 bg-slate-900/50'
                                  : prog.status === 'completed'
                                    ? 'border-green-500 text-green-300 bg-green-900/40 shadow-[0_0_8px_rgba(0,255,0,0.2)]'
                                    : `border-[${styles.color}] text-white shadow-[0_0_8px_${styles.color}40]`
                              }`}
                              style={!isLocked && prog.status !== 'completed' ? { backgroundColor: `${styles.color}30`, borderColor: styles.color } : {}}
                            >
                              {isLocked ? '🔒' : prog.status === 'completed' ? '✅' : '🔓'} {level.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TutorView({ planets }: { planets: Planet[] }) {
  const users = useAuthStore((s: any) => s.users ?? []);
  const myStudents = users.filter((u: { role: string }) => u.role === 'student');

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
              {myStudents.map((s: { id: string; name: string; username: string }) => (
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
  const user = useAuthStore((s) => s.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user?.role === 'admin') {
      router.push('/admin');
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return (
      <div className="relative min-h-screen" style={{ background: '#00000a' }} />
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center" style={{ background: '#00000a' }}>
        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          <div className="text-5xl mb-4">🚀</div>
          <h1 className="text-2xl font-black text-white mb-2">Mapa Estelar</h1>
          <p className="text-sm text-slate-400 mb-6">Inicia sesión para explorar los planetas y ver tu progreso.</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-full text-sm font-bold tracking-widest border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-all"
          >
            IR AL INICIO
          </button>
        </div>
      </div>
    );
  }

  if (user.role === 'admin') return null;

  return (
    <div className="relative min-h-screen" style={{ background: '#00000a' }}>
      <div className="relative z-10 px-6 py-12">
        {user.role === 'student' && (
          <StudentView planets={MOCK_PLANETS} progress={MOCK_PROGRESS} user={user} />
        )}
        {user.role === 'tutor' && (
          <TutorView planets={MOCK_PLANETS} />
        )}
      </div>
    </div>
  );
}