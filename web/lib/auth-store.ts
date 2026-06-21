/**
 * Store de autenticación con Zustand + persistencia en localStorage.
 *
 * Mientras no exista backend, usa datos mock para simular
 * login, registro y asignación de roles.
 *
 * @todo (Fase 2) Reemplazar mock por llamadas reales a
 *   POST /api/auth/login, POST /api/auth/register, etc.
 */
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, LoginData, RegisterData } from '../../shared/types';

/** Estado y acciones del store de autenticación */
interface AuthState {
  user: User | null;
  token: string | null;
  users: User[]; // Lista completa (para admin)
  _hydrated: boolean; // true después de hidratar desde localStorage

  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  assignRole: (userId: number, role: UserRole) => void;

  /** Obtener ruta de redirección post-login según el rol */
  getRedirect: () => string;
}

/** Usuarios mock para desarrollo sin backend */
const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@universo.com',
    username: 'admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Prof. María López',
    email: 'maria@universo.com',
    username: 'maria',
    role: 'tutor',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Carlos Pérez',
    email: 'carlos@universo.com',
    username: 'carlos',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      users: MOCK_USERS,
      _hydrated: false,

      login: async (data: LoginData) => {
        // Simular llamada al backend
        await new Promise((r) => setTimeout(r, 300));

        const found = get().users.find(
          (u) => u.username === data.username && u.role !== 'pending',
        );

        if (found) {
          set({ user: found, token: 'mock-token-' + found.id });
          return true;
        }

        return false;
      },

      register: async (data: RegisterData) => {
        await new Promise((r) => setTimeout(r, 300));

        const exists = get().users.find((u) => u.username === data.username);
        if (exists) return false;

        const newUser: User = {
          id: get().users.length + 1,
          name: data.name,
          email: data.email,
          username: data.username,
          role: 'pending',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ users: [...state.users, newUser] }));
        return true;
      },

      logout: () => {
        set({ user: null, token: null });
      },

      assignRole: (userId: number, role: UserRole) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, role } : u)),
        }));
      },

      getRedirect: () => {
        const role = get().user?.role;
        switch (role) {
          case 'admin':
            return '/admin';
          case 'tutor':
            return '/dashboard';
          case 'student':
            return '/dashboard';
          default:
            return '/';
        }
      },
    }),
    {
      name: 'universo-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        users: state.users,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          useAuthStore.setState({ _hydrated: true });
        }
      },
    },
  ),
);
