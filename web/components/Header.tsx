'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../lib/auth-store';
import type { LoginData, RegisterData } from '../../shared/types';

export default function Header() {
  const router = useRouter();
  const { user, token, login, register, logout, getRedirect } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const resetLoginForm = () => {
    setLoginUser('');
    setLoginPass('');
    setLoginError('');
  };

  const resetRegForm = () => {
    setRegName('');
    setRegEmail('');
    setRegUser('');
    setRegPass('');
    setRegError('');
    setRegSuccess(false);
  };

  const handleLogin = async () => {
    setLoginError('');
    const ok = await login({ username: loginUser, password: loginPass } as LoginData);
    if (ok) {
      setIsOpen(false);
      resetLoginForm();
      router.push(getRedirect());
    } else {
      setLoginError('Usuario no encontrado o pendiente de aprobación.');
    }
  };

  const handleRegister = async () => {
    setRegError('');
    if (!regName || !regEmail || !regUser || !regPass) {
      setRegError('Todos los campos son obligatorios.');
      return;
    }
    const ok = await register({
      name: regName,
      email: regEmail,
      username: regUser,
      password: regPass,
    } as RegisterData);
    if (ok) {
      setRegSuccess(true);
      setTimeout(() => {
        setTab('login');
        resetRegForm();
      }, 2500);
    } else {
      setRegError('El nombre de usuario ya existe.');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white no-underline">
          <span className="text-2xl">🌌</span>
          <span className="font-bold text-lg tracking-wide hidden sm:inline">
            Universo del Conocimiento
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/about" className="text-xs text-slate-400 hover:text-white transition-colors hidden sm:inline">
            Acerca de
          </Link>
          <Link href="/how-to-play" className="text-xs text-slate-400 hover:text-white transition-colors hidden sm:inline">
            Cómo jugar
          </Link>

          {token && user ? (
            <nav className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
              {user.role === 'admin' && (
                <Link href="/admin" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Panel Admin
                </Link>
              )}
              {user.role === 'tutor' && (
                <>
                  <Link href="/maestro" className="text-sm text-slate-300 hover:text-white transition-colors">
                    Mis Estudiantes
                  </Link>
                  <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </>
              )}
              {user.role === 'student' && (
                <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              )}

            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right">
                <div className="text-sm text-white font-medium">{user.name}</div>
                <div className="text-xs text-slate-400 capitalize">{user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors"
              >
                Salir
              </button>
            </div>
          </nav>
        ) : (
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              resetLoginForm();
              resetRegForm();
            }}
            className="relative bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Iniciar sesión
          </button>
        )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={formRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/10 bg-black/80 backdrop-blur-xl"
          >
            <div className="max-w-md mx-auto px-6 py-8">
              <div className="flex mb-6 border-b border-white/10">
                <button
                  onClick={() => { setTab('login'); resetRegForm(); }}
                  className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                    tab === 'login'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => { setTab('register'); resetLoginForm(); }}
                  className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                    tab === 'register'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {tab === 'login' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium" htmlFor="header-user">Usuario</label>
                    <input
                      id="header-user"
                      type="text"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full mt-1 bg-black/40 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      placeholder="Tu nombre de usuario"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium" htmlFor="header-pass">Contraseña</label>
                    <input
                      id="header-pass"
                      type="password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full mt-1 bg-black/40 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      placeholder="Tu contraseña"
                    />
                  </div>

                  {loginError && (
                    <p className="text-red-400 text-xs">{loginError}</p>
                  )}

                  <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    Entrar
                  </button>
                </div>
              )}

              {tab === 'register' && (
                <div className="space-y-4">
                  {regSuccess ? (
                    <div className="text-center py-8">
                      <p className="text-green-400 font-semibold text-sm">
                        ✅ Registro exitoso.
                      </p>
                      <p className="text-slate-400 text-xs mt-2">
                        Un administrador debe asignar tu rol para que puedas acceder.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs text-slate-400 font-medium" htmlFor="reg-name">Nombre completo</label>
                        <input
                          id="reg-name"
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full mt-1 bg-black/40 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          placeholder="Ej: Juan Pérez"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-medium" htmlFor="reg-email">Correo electrónico</label>
                        <input
                          id="reg-email"
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full mt-1 bg-black/40 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-medium" htmlFor="reg-user">Usuario</label>
                        <input
                          id="reg-user"
                          type="text"
                          value={regUser}
                          onChange={(e) => setRegUser(e.target.value)}
                          className="w-full mt-1 bg-black/40 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          placeholder="Tu nombre de usuario"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-medium" htmlFor="reg-pass">Contraseña</label>
                        <input
                          id="reg-pass"
                          type="password"
                          value={regPass}
                          onChange={(e) => setRegPass(e.target.value)}
                          className="w-full mt-1 bg-black/40 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>

                      {regError && (
                        <p className="text-red-400 text-xs">{regError}</p>
                      )}

                      <button
                        onClick={handleRegister}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                      >
                        Crear cuenta
                      </button>

                      <p className="text-xs text-slate-500 text-center">
                        Después de registrarte, un administrador debe aprobar tu cuenta.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
