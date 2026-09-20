'use client';

import React from 'react';

interface PlanetVisualProps {
  name: string;
  className?: string;
}

export default function PlanetVisual({ name, className = '' }: PlanetVisualProps) {
  if (name.includes('Numérix')) {
    return (
      <div className={`relative w-44 h-44 flex items-center justify-center float-slow ${className}`}>
        {/* Anillo trasero angular */}
        <svg className="absolute w-56 h-36 -rotate-12 pointer-events-none z-0" viewBox="0 0 240 120">
          <defs>
            <linearGradient id="ringGradBackHUD" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.9"></stop>
              <stop offset="50%" stopColor="#0066ff" stopOpacity="0.25"></stop>
              <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.8"></stop>
            </linearGradient>
          </defs>
          <ellipse cx="120" cy="60" fill="none" opacity="0.8" rx="100" ry="32" stroke="url(#ringGradBackHUD)" strokeDasharray="14 4 6 4" strokeWidth="5"></ellipse>
          <ellipse cx="120" cy="60" fill="none" opacity="0.5" rx="90" ry="26" stroke="#a5f3fc" strokeWidth="1.2"></ellipse>
          {/* Muescas de grados */}
          <path d="M 40,48 L 44,52 M 65,38 L 68,43 M 95,32 L 96,38 M 145,32 L 144,38 M 175,38 L 172,43 M 200,48 L 196,52" opacity="0.7" stroke="#a5f3fc" strokeWidth="1.5"></path>
        </svg>

        {/* Esfera Volumétrica Numérix con Glifos */}
        <div className="relative w-32 h-32 rounded-full planet-numerix-sphere z-10 overflow-hidden flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full mix-blend-overlay opacity-75" fill="none" viewBox="0 0 128 128">
            {/* Red fractal y armilar */}
            <ellipse cx="64" cy="64" rx="58" ry="22" stroke="#ffffff" strokeDasharray="3 3" strokeWidth="1.2"></ellipse>
            <ellipse cx="64" cy="64" rx="58" ry="46" stroke="#ffffff" strokeDasharray="4 4" strokeWidth="1.2"></ellipse>
            <line stroke="#ffffff" strokeDasharray="2 3" strokeWidth="1.2" x1="64" x2="64" y1="4" y2="124"></line>
            <polygon fill="rgba(0, 35, 90, 0.45)" points="64,28 48,56 80,56" stroke="#ffffff" strokeWidth="1.5"></polygon>
            <polygon fill="rgba(0, 35, 90, 0.45)" points="34,74 48,70 54,82 42,88" stroke="#ffffff" strokeWidth="1.5"></polygon>
            <polygon fill="rgba(0, 35, 90, 0.45)" points="84,72 96,68 100,80 90,86" stroke="#ffffff" strokeWidth="1.5"></polygon>
            {/* Fórmulas grabadas */}
            <text fill="#ffffff" fontFamily="sans-serif" fontSize="14" fontWeight="bold" opacity="0.95" x="59" y="72">π</text>
            <text fill="#a5f3fc" fontFamily="sans-serif" fontSize="12" fontWeight="bold" opacity="0.9" x="32" y="48">∞</text>
            <text fill="#a5f3fc" fontFamily="sans-serif" fontSize="11" fontWeight="bold" opacity="0.9" x="82" y="44">∑</text>
            <text fill="#e0f2fe" fontFamily="sans-serif" fontSize="11" fontWeight="bold" opacity="0.8" x="60" y="104">Δ</text>
          </svg>
          {/* Terminador de luz */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/80 via-transparent to-white/40 pointer-events-none"></div>
          <div className="absolute top-3 left-4 w-10 h-6 bg-white/40 rounded-full blur-[6px] rotate-[-25deg] pointer-events-none"></div>
        </div>

        {/* Anillo frontal con escala métrica y satélite nodo x */}
        <div className="absolute w-56 h-36 -rotate-12 pointer-events-none z-20 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 240 120">
            <path d="M 20,60 A 100,32 0 0,0 220,60" fill="none" filter="drop-shadow(0 0 6px #00f5ff)" stroke="#00f5ff" strokeDasharray="24 6 12 6" strokeWidth="5.5"></path>
            <path d="M 30,60 A 90,26 0 0,0 210,60" fill="none" stroke="#e0f2fe" strokeWidth="1.8"></path>
            <g transform="translate(54, 76)">
              <circle cx="0" cy="0" fill="#020b1c" r="6" stroke="#00f5ff" strokeWidth="1.8"></circle>
              <text fill="#00f5ff" fontFamily="sans-serif" fontSize="8" fontWeight="bold" x="-3" y="3">x</text>
            </g>
            <g transform="translate(186, 76)">
              <circle cx="0" cy="0" fill="#020b1c" r="6" stroke="#00f5ff" strokeWidth="1.8"></circle>
              <text fill="#00f5ff" fontFamily="sans-serif" fontSize="8" fontWeight="bold" x="-3" y="3">y</text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  if (name.includes('Letralia')) {
    return (
      <div className={`relative w-44 h-44 flex items-center justify-center float-slow ${className}`} style={{ animationDelay: '-2.5s' }}>
        {/* Aura violeta vibrante */}
        <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-purple-500/40 to-fuchsia-500/30 blur-xl"></div>
        <div className="absolute w-40 h-40 rounded-full border border-purple-400/30 blur-[1px]"></div>
        {/* Órbita trasera de glifos */}
        <svg className="absolute w-52 h-32 rotate-[-15deg] pointer-events-none z-0" viewBox="0 0 200 100">
          <ellipse cx="100" cy="50" fill="none" opacity="0.6" rx="88" ry="26" stroke="#a855f7" strokeDasharray="3 4" strokeWidth="1.2"></ellipse>
          <text fill="#f3e8ff" fontFamily="serif" fontSize="10" fontWeight="bold" opacity="0.75" x="32" y="42">A</text>
          <text fill="#d8b4fe" fontFamily="serif" fontSize="11" fontWeight="bold" opacity="0.85" x="76" y="28">B</text>
          <text fill="#c084fc" fontFamily="serif" fontSize="10" fontWeight="bold" opacity="0.75" x="130" y="28">C</text>
          <text fill="#e9d5ff" fontFamily="serif" fontSize="11" fontWeight="bold" opacity="0.85" x="165" y="42">Ω</text>
        </svg>

        {/* Esfera Volumétrica Letralia con Tormentas de Letras */}
        <div className="relative w-32 h-32 rounded-full planet-letralia-sphere z-10 overflow-hidden flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full opacity-75" viewBox="0 0 128 128">
            <defs>
              <linearGradient id="cloud1HUD" x1="0" x2="100%" y1="0" y2="0">
                <stop offset="0%" stopColor="#bf40ff" stopOpacity="0.3"></stop>
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6"></stop>
                <stop offset="100%" stopColor="#7928ca" stopOpacity="0.2"></stop>
              </linearGradient>
            </defs>
            {/* Bandas gaseosas */}
            <path d="M 0,38 C 30,30 50,44 80,36 C 105,30 118,40 128,34 L 128,48 C 110,54 90,44 60,52 C 35,58 15,46 0,52 Z" fill="url(#cloud1HUD)"></path>
            <path d="M 0,62 C 25,56 45,70 75,60 C 100,52 115,66 128,58 L 128,74 C 105,82 85,68 55,78 C 30,84 10,70 0,76 Z" fill="url(#cloud1HUD)"></path>
            <path d="M 0,86 C 35,80 60,94 95,84 C 115,78 122,86 128,82 L 128,94 C 110,98 85,90 55,98 C 25,104 10,92 0,96 Z" fill="url(#cloud1HUD)"></path>
            <text fill="#ffffff" fontFamily="serif" fontSize="8" opacity="0.6" x="24" y="46">a e i o u</text>
            <text fill="#ffffff" fontFamily="serif" fontSize="9" fontWeight="bold" opacity="0.7" x="68" y="58">α β γ</text>
            {/* Vórtice Gramatical */}
            <ellipse cx="88" cy="70" fill="#3b0764" opacity="0.85" rx="14" ry="7" stroke="#e9d5ff" strokeWidth="1"></ellipse>
            <text fill="#ffffff" fontFamily="serif" fontSize="7" fontWeight="bold" opacity="0.95" x="84" y="73">§</text>
          </svg>
          {/* Terminador de luz */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0f011d]/90 via-transparent to-white/45 pointer-events-none"></div>
          <div className="absolute top-2 left-5 w-12 h-6 bg-white/45 rounded-full blur-[5px] rotate-[-20deg] pointer-events-none"></div>
        </div>

        {/* Cinturón delantero con Ñ y Pluma Satelital */}
        <svg className="absolute w-52 h-32 rotate-[-15deg] pointer-events-none z-20" viewBox="0 0 200 100">
          <path d="M 12,50 A 88,26 0 0,0 188,50" fill="none" filter="drop-shadow(0 0 6px #bf40ff)" stroke="#bf40ff" strokeDasharray="6 3" strokeWidth="2.5"></path>
          <text fill="#ffffff" filter="drop-shadow(0 0 4px #bf40ff)" fontFamily="serif" fontSize="12" fontWeight="bold" x="40" y="68">Ñ</text>
          <text fill="#e9d5ff" fontFamily="serif" fontSize="11" fontWeight="bold" x="75" y="75">« »</text>
          <text fill="#ffffff" filter="drop-shadow(0 0 4px #bf40ff)" fontFamily="serif" fontSize="12" fontWeight="bold" x="115" y="76">Z</text>
          <text fill="#d8b4fe" fontFamily="serif" fontSize="11" fontWeight="bold" x="150" y="66">¡ !</text>
          {/* Satélite pluma estelar */}
          <g transform="translate(178, 44) rotate(45)">
            <path d="M 0,0 L 5,-12 L 8,-12 L 3,0 Z" fill="#f3e8ff" stroke="#a855f7" strokeWidth="0.8"></path>
            <circle cx="1.5" cy="-5" fill="#c084fc" r="1.2"></circle>
          </g>
        </svg>
      </div>
    );
  }

  if (name.includes('Naturae')) {
    return (
      <div className={`relative w-44 h-44 flex items-center justify-center float-slow ${className}`} style={{ animationDelay: '-4s' }}>
        {/* Aura verde esmeralda y menta */}
        <div className="absolute w-36 h-36 rounded-full bg-emerald-400/25 blur-xl"></div>
        <div className="absolute w-38 h-38 rounded-full border border-emerald-400/35 blur-[1px]"></div>
        {/* Órbita bioluminiscente de esporas */}
        <svg className="absolute w-48 h-48 pointer-events-none z-0" viewBox="0 0 160 160">
          <ellipse cx="80" cy="80" fill="none" opacity="0.6" rx="74" ry="30" stroke="#059669" strokeDasharray="4 4" strokeWidth="1.2" transform="rotate(-25 80 80)"></ellipse>
          <g transform="translate(25, 60) rotate(-45)">
            <path d="M 0,0 C 4,-8 12,-8 12,0 C 12,8 4,8 0,0 Z" fill="#10b981" opacity="0.85"></path>
            <line stroke="#a7f3d0" strokeWidth="0.8" x1="0" x2="12" y1="0" y2="0"></line>
          </g>
        </svg>

        {/* Esfera Volumétrica Naturae con Venas Orgánicas */}
        <div className="relative w-32 h-32 rounded-full planet-naturae-sphere z-10 overflow-hidden flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128">
            {/* Continentes orgánicos con venas vasculares */}
            <path d="M 28,32 C 34,22 48,20 62,26 C 74,32 82,24 88,34 C 92,42 80,50 72,54 C 60,60 50,52 38,54 C 26,56 22,42 28,32 Z" fill="#022c1b" opacity="0.95" stroke="#00ff88" strokeWidth="0.9"></path>
            <path d="M 38,36 C 48,34 60,38 75,42" fill="none" opacity="0.8" stroke="#34d399" strokeWidth="0.8"></path>
            <path d="M 45,68 C 55,62 70,64 80,72 C 90,80 94,92 84,102 C 72,112 58,106 48,100 C 38,94 36,80 45,68 Z" fill="#022c1b" opacity="0.95" stroke="#00ff88" strokeWidth="0.9"></path>
            <circle cx="64" cy="82" fill="none" opacity="0.75" r="7" stroke="#059669" strokeWidth="0.8"></circle>
            <circle cx="64" cy="82" fill="#a7f3d0" opacity="0.9" r="2.5"></circle>
            {/* Cadena de ADN sutil en la atmósfera */}
            <path d="M 15,48 Q 40,42 70,46 T 118,52" fill="none" filter="blur(1px)" opacity="0.4" stroke="#ffffff" strokeLinecap="round" strokeWidth="2"></path>
            {/* Focos fotosintéticos */}
            <circle cx="58" cy="38" fill="#ffffff" r="1.5"></circle>
            <circle cx="68" cy="85" fill="#ffffff" r="1.5"></circle>
          </svg>
          {/* Terminador de luz */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#01140b]/90 via-transparent to-white/40 pointer-events-none"></div>
          <div className="absolute top-2.5 left-4 w-11 h-6 bg-white/40 rounded-full blur-[6px] rotate-[-25deg] pointer-events-none"></div>
        </div>

        {/* Satélite Bioluminiscente vivo */}
        <div className="absolute -top-1 right-3 w-5 h-5 rounded-full bg-gradient-to-tr from-[#059669] to-[#a7f3d0] border border-white/70 shadow-[0_0_14px_#00ff88] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-85 animate-ping"></div>
        </div>
      </div>
    );
  }

  // Fallback genérico si se crea otro planeta
  return (
    <div className={`relative w-44 h-44 flex items-center justify-center float-slow ${className}`}>
      <div className="relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center" style={{
        background: 'radial-gradient(circle at 30% 28%, #e2e8f0 0%, #64748b 28%, #0f172a 100%)',
        boxShadow: 'inset -15px -15px 28px rgba(0,0,0,0.8), inset 12px 12px 22px rgba(255,255,255,0.4), 0 0 45px rgba(255,255,255,0.2)'
      }} />
    </div>
  );
}
