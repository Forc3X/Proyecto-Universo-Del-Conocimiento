import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { verificarCredenciales, registrarUsuario } from './auth-service';
import type { User, UserRole, LoginData, RegisterData } from '../shared/types';
// En tu componente de registro


interface AuthState {
  user: { id: string; name: string; usuario: string; role: string; correo: string } | null;
  token: string | null;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  getRedirect: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      // 1. LOGIN GLOBAL CON RASTREADORES
      login: async (data: LoginData) => {
        
        // Llamamos a la base de datos SQLite
        const resultado = await verificarCredenciales(data.username, data.password);
        
        if (resultado.success && resultado.usuario) {
          set({
            user: {
              id: resultado.usuario.id,
              name: resultado.usuario.nombre,
              usuario: resultado.usuario.usuario,
              role: resultado.usuario.role || 'student',
              correo: resultado.usuario.correo
            },
            token: 'token-local-simulado'
          });
          return true;
        }
        
        return false;
      },

      // 2. REGISTRO GLOBAL
      register: async (data: RegisterData) => {
        const resultado = await registrarUsuario({
          nombre: data.name,
          correo: data.email,
          usuario: data.username,
          contrasena: data.password,
          role: 'student'
        });
        return resultado.success;
      },

      logout: () => {
        set({ user: null, token: null });
      },

      getRedirect: () => {
        const usuarioActual = get().user;
        if (!usuarioActual) return '/';
        if (usuarioActual.role === 'admin') return '/admin';
        if (usuarioActual.role === 'tutor') return '/maestro';
        return '/dashboard';
      }
    }),
    {
      name: 'universo-auth-storage'
    }
  )
);

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

