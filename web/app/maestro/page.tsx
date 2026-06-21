/**
 * Maestro — Dashboard del tutor / docente.
 *
 * Vista protegida para rol 'tutor'. Muestra una visión general
 * del progreso de todos los estudiantes asignados y el detalle
 * pedagógico de cada planeta.
 *
 * @todo (Fase 2+) Conectar con backend real y añadir gráficas Recharts.
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/auth-store';

const PLANET_DATA = [
  {
    nombre: 'Numérix',
    materia: 'Matemáticas',
    icon: '🔢',
    niveles: 6,
    color: 'border-cyan-500/30',
    bg: 'from-cyan-950/20',
  },
  {
    nombre: 'Verbum',
    materia: 'Lengua',
    icon: '📖',
    niveles: 3,
    color: 'border-purple-500/30',
    bg: 'from-purple-950/20',
  },
  {
    nombre: 'Naturae',
    materia: 'Ciencias',
    icon: '🌿',
    niveles: 3,
    color: 'border-green-500/30',
    bg: 'from-green-950/20',
  },
];

export default function MaestroPage() {
  const router = useRouter();
  const { user, users, _hydrated } = useAuthStore();

  useEffect(() => {
    if (!_hydrated) return;
    if (!user) {
      router.push('/');
    } else if (user.role !== 'tutor') {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, router, _hydrated]);

  if (!_hydrated || !user || user.role !== 'tutor') return null;

  const students = users.filter((u) => u.role === 'student');

  return (
    <div className="min-h-screen bg-[#00000a] px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Encabezado */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            🚀 Puente de Mando
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Bienvenido, {user.name}. Aquí puedes supervisar el progreso de tus estudiantes.
          </p>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{students.length}</div>
            <div className="text-xs text-slate-400">Estudiantes</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{PLANET_DATA.length}</div>
            <div className="text-xs text-slate-400">Planetas</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">
              {PLANET_DATA.reduce((a, p) => a + p.niveles, 0)}
            </div>
            <div className="text-xs text-slate-400">Niveles totales</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">—</div>
            <div className="text-xs text-slate-400">Completados</div>
          </div>
        </div>

        {/* Planetas con detalle pedagógico */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">📚 Planes de estudio</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {PLANET_DATA.map((p) => (
              <div
                key={p.nombre}
                className={`bg-gradient-to-br ${p.bg} to-transparent border ${p.color} rounded-xl p-6`}
              >
                <div className="text-3xl mb-2">{p.icon}</div>
                <h3 className="text-lg font-bold text-white">{p.nombre}</h3>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">{p.materia}</p>
                <p className="text-sm text-slate-300">
                  {p.niveles} niveles organizados en cursos progresivos.
                </p>
                <p className="text-xs text-slate-500 mt-3">
                  Cada nivel refuerza competencias específicas alineadas con el currículo de educación primaria.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lista de estudiantes */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">👨‍🎓 Mis estudiantes</h2>
          {students.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <p className="text-slate-400 text-sm">No tienes estudiantes asignados.</p>
              <p className="text-slate-600 text-xs mt-1">
                Contacta al administrador para que te asigne estudiantes.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{s.name}</div>
                      <div className="text-xs text-slate-400">@{s.username}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">Progreso: —</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
