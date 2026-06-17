import LikeButton from './like-button';
import globals from './globals.css';
import tailwindConfig from './tailwind.config.js';

type HeaderProps = {
  title?: string;
};

function Header({ title }: HeaderProps) {
  return <h1 className="text-4xl font-semibold">{title ?? 'Inicio de sesión'}</h1>;
}

import CosmicBackground from './fondo-cosmico.js';

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-start p-8 md:p-20 overflow-hidden">
      
      {/* CAPA DE FONDO: Canvas con estrellas y constelación */}
      <CosmicBackground />
      
      {/* CAPA DE CONTENIDO: Tu interfaz de usuario (Z-10 para quedar al frente) */}
      <div className="relative z-10 w-full max-w-md space-y-6 select-none align-center mx-auto">
        
        {/* Textos Informativos */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white drop-shadow-md text-center">
            Inicio de sesión
          </h1>
        </div>

        {/*FORMULARIO DE LOGIN */}
        <div className="pt-4">
          <div className="w-full h-60 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-4 flex flex-col justify-center text-xs text-slate-400 border-dashed">
            <label className="text-sm font-medium text-slate-300" htmlFor="username">
              Usuario
            </label>

            <input
              type="text"
              id="username"
              className="bg-w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-colors border border-white/20 placeholder:text-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su usuario"
            />
            <br />
            <label className="text-sm font-medium text-slate-300" htmlFor="password">
              
              Contraseña
              <br />
            </label>
            <input
              type="password"
              id="password"
              className="bg-w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-colors border border-white/20 placeholder:text-slate-500 flex flex-col text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su contraseña"
            />
            <br />
            {/* Botones de acción (Iniciar sesión / Registrarse) */}
            <div className="mt-4 flex space-x-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
                Iniciar sesión
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
                Registrarse
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* LOGO DE NEXT.JS (Esquina inferior izquierda) */}
      <div className="absolute bottom-8 left-8 z-10 bg-black/40 border border-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
        <span className="font-black text-sm text-white select-none">▲</span>
      </div>

      {/* ICONO DE ESTRELLA DE DESTELLOS (Esquina inferior derecha) */}
      <div className="absolute bottom-10 right-10 z-10 text-white/40 animate-pulse">
        <svg
          className="w-12 h-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20"></path>
          <path d="M2 12h20"></path>
          <path d="m19 19-7-7 7-7"></path>
          <path d="m5 19 7-7-7-7"></path>
        </svg>
      </div>

    </main>
  );
}
