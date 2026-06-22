'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/auth-store';
import type { UserRole } from '../../../shared/types';

export default function AdminPage() {
  const router = useRouter();
  const { user, users, assignRole, _hydrated } = useAuthStore();

  useEffect(() => {
    if (!_hydrated) return;
    if (!user) {
      router.push('/');
    } else if (user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router, _hydrated]);

  if (!_hydrated || !user || user.role !== 'admin') return null;

  const pendingUsers = users.filter((u) => u.role === 'pending');
  const assignedUsers = users.filter((u) => u.role !== 'pending');

  return (
    <div className="min-h-screen bg-[#00000a] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">Panel de Administración</h1>
        <p className="text-sm text-slate-400 mb-8">
          Asigna roles a los usuarios registrados para que puedan acceder al sistema.
        </p>

        <section className="mb-12">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Pendientes de aprobación ({pendingUsers.length})
          </h2>

          {pendingUsers.length === 0 ? (
            <p className="text-sm text-slate-500 bg-white/5 rounded-xl p-6 border border-white/10">
              No hay usuarios pendientes. Todos los roles están asignados.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{u.name}</div>
                    <div className="text-xs text-slate-400">@{u.username} · {u.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => assignRole(u.id, 'student')}
                      className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded transition-colors"
                    >
                      Hacer Estudiante
                    </button>
                    <button
                      onClick={() => assignRole(u.id, 'tutor')}
                      className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded transition-colors"
                    >
                      Hacer Tutor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">
            Usuarios del sistema ({assignedUsers.length})
          </h2>

          <div className="space-y-2">
            {assignedUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/3"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    u.role === 'admin' ? 'bg-red-400' :
                    u.role === 'tutor' ? 'bg-blue-400' : 'bg-green-400'
                  }`} />
                  <span className="text-sm text-white">{u.name}</span>
                  <span className="text-[10px] uppercase text-slate-500">{u.role}</span>
                </div>
                <div className="flex gap-2">
                  {u.role !== 'admin' && (
                    <>
                      <button
                        onClick={() => assignRole(u.id, u.role === 'student' ? 'tutor' : 'student')}
                        className="text-[10px] bg-white/10 hover:bg-white/20 text-slate-300 px-2 py-1 rounded transition-colors"
                      >
                        Cambiar a {u.role === 'student' ? 'Tutor' : 'Estudiante'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
