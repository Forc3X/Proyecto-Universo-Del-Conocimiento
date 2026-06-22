'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanetaProps {
  nombre?: string;
  materia?: string;
  gradient?: string;
  glow?: string;
  glowColor?: string;
  delay?: number;
  cursos?: Array<{
    name: string;
    description: string;
    levels: Array<{ name: string; description: string }>;
  }>;
  onExplore?: (data: { nombre: string; materia: string }) => void;
}

const THEME_ELEMENTS: Record<string, { icons: string[] }> = {
  Numérix: { icons: ['+', '−', '×', '÷', '=', '∑', 'π'] },
  Letralia: { icons: ['A', 'B', 'C', 'D', 'E', 'F'] },
  Naturae: { icons: ['🌿', '🌱', '🍃', '🌳', '🌸'] },
};

export default function Planeta({
  nombre = 'Planeta',
  materia = 'Materia',
  gradient = 'radial-gradient(circle at 35% 30%, #00f5ff 0%, #0080ff 40%, #000d40 100%)',
  glow = '#00f5ff',
  glowColor = '#00e4ff',
  delay = 0,
  cursos = [],
  onExplore,
}: PlanetaProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const theme = useMemo(() => THEME_ELEMENTS[nombre] || THEME_ELEMENTS.Numérix, [nombre]);

  const handleExplore = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1200);
    if (onExplore) onExplore({ nombre, materia });
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  return (
    <>
      <div
        className="flex flex-col items-center gap-6 select-none"
        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
          <div
            className="absolute rounded-full"
            style={{
              width: 265, height: 265,
              border: `1px solid ${glowColor}55`,
              background: `radial-gradient(circle, transparent 55%, ${glowColor}18 100%)`,
              animation: 'ping-slow 3.5s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 315, height: 315,
              filter: 'blur(42px)',
              background: `radial-gradient(circle, ${glowColor}55 0%, transparent 70%)`,
              opacity: hovered ? 0.9 : 0.65,
              transition: 'opacity 0.4s ease',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 235, height: 235,
              border: `1px solid ${glowColor}30`,
              background: `radial-gradient(circle, transparent 40%, ${glowColor}10 100%)`,
              animation: 'ping-slow 4s ease-in-out infinite 0.5s',
            }}
          />

          {theme.icons.slice(0, 4).map((icon, i) => (
            <div
              key={`${icon}-${i}`}
              className="absolute pointer-events-none"
              style={{
                animation: `theme-float-${i} ${5 + i * 0.8}s ease-in-out infinite`,
                fontSize: i === 0 ? '1.1rem' : `${0.8 + i * 0.1}rem`,
                opacity: 0.35 + i * 0.05,
                filter: `blur(${i === 0 ? 0 : 0.3}px)`,
                color: glowColor,
                textShadow: `0 0 8px ${glowColor}55`,
                fontWeight: isNaN(Number(icon)) && icon.length === 1 ? 700 : 400,
              }}
            >
              {icon}
            </div>
          ))}

          <div
            style={{
              animation: `float ${3 + delay}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          >
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="relative rounded-full flex flex-col items-center justify-center cursor-pointer overflow-hidden"
              style={{
                width: 185, height: 185,
                background: gradient,
                boxShadow: `
                  0 0 45px ${glow}80,
                  0 0 90px ${glow}45,
                  0 0 160px ${glow}20,
                  inset 0 -25px 60px rgba(0,0,0,0.50),
                  inset 0 12px 35px rgba(255,255,255,0.13)
                `,
                willChange: 'transform',
                transition: 'box-shadow 0.4s ease, transform 0.3s ease',
                transform: hovered ? 'scale(1.07)' : 'scale(1)',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(circle at 70% 20%, rgba(255,255,255,0.06) 0%, transparent 40%),
                    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.04) 0%, transparent 30%),
                    radial-gradient(circle at 50% 50%, rgba(0,0,0,0.08) 0%, transparent 60%)
                  `,
                  borderRadius: '50%',
                }}
              />
              <div
                className="absolute"
                style={{
                  width: 75, height: 35,
                  top: 20, left: 22,
                  background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 100%)',
                  filter: 'blur(6px)',
                  borderRadius: '50%',
                  transform: 'rotate(-20deg)',
                }}
              />
              <div
                className="absolute w-full"
                style={{
                  top: '35%', height: '8%',
                  background: `linear-gradient(90deg, transparent 5%, ${glowColor}15 30%, ${glowColor}25 50%, ${glowColor}15 70%, transparent 95%)`,
                  filter: 'blur(4px)',
                  transform: 'rotate(-10deg)',
                }}
              />
              <div
                className="absolute w-full"
                style={{
                  top: '60%', height: '6%',
                  background: `linear-gradient(90deg, transparent 10%, ${glowColor}10 35%, ${glowColor}20 55%, ${glowColor}10 75%, transparent 90%)`,
                  filter: 'blur(3px)',
                  transform: 'rotate(5deg)',
                }}
              />
              <span
                className="font-black tracking-wider text-center z-10"
                style={{
                  fontSize: '1.15rem', color: '#ffffff',
                  textShadow: `0 0 22px ${glow}, 0 2px 8px rgba(0,0,0,0.7)`,
                  letterSpacing: '0.12em',
                }}
              >
                {nombre}
              </span>
              <span
                className="font-semibold tracking-widest mt-1 z-10"
                style={{
                  fontSize: '0.68rem', color: 'rgba(255,255,255,0.72)',
                  textShadow: '0 1px 6px rgba(0,0,0,0.8)',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                }}
              >
                {materia}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleExplore}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              padding: '11px 40px', borderRadius: '50px',
              border: `1.5px solid ${glowColor}99`,
              background: clicked
                ? `linear-gradient(135deg, ${glowColor}55, ${glowColor}22)`
                : hovered
                  ? `linear-gradient(135deg, ${glowColor}33, ${glowColor}11)`
                  : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
              color: '#ffffff', fontSize: '0.75rem', fontWeight: 800,
              letterSpacing: '0.25em', cursor: 'pointer',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              boxShadow: hovered
                ? `0 0 30px ${glowColor}55, 0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`
                : `0 0 14px ${glowColor}33, inset 0 1px 0 rgba(255,255,255,0.08)`,
              transition: 'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
              textShadow: `0 0 14px ${glow}`,
              transform: hovered ? 'scale(1.08) translateY(-3px)' : 'scale(1) translateY(0)',
            }}
          >
            ✦&nbsp;&nbsp;EXPLORAR&nbsp;&nbsp;✦
          </button>

          {clicked && (
            <span
              className="font-bold tracking-widest"
              style={{
                fontSize: '0.62rem', color: glowColor,
                textShadow: `0 0 14px ${glowColor}`,
                letterSpacing: '0.25em', textTransform: 'uppercase',
                animation: 'bounce 0.6s ease-in-out infinite',
              }}
            >
              ✦ ¡Iniciando viaje! ✦
            </span>
          )}
        </div>
      </div>

      {/* Modal de explicación del módulo */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg rounded-2xl border overflow-y-auto max-h-[85vh]"
              style={{
                borderColor: `${glowColor}44`,
                background: `linear-gradient(135deg, rgba(10,10,30,0.98), rgba(5,5,20,0.98))`,
                boxShadow: `0 0 60px ${glowColor}30, 0 20px 60px rgba(0,0,0,0.6)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div className="p-6 pb-4 text-center border-b border-white/10">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
                  style={{
                    background: gradient,
                    boxShadow: `0 0 30px ${glow}60`,
                  }}
                >
                  {theme.icons[0]}
                </div>
                <h2 className="text-2xl font-black text-white">{nombre}</h2>
                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">{materia}</p>
              </div>

              {/* Cursos y niveles */}
              <div className="p-6 space-y-5">
                {cursos.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center">
                    Contenido del módulo próximamente.
                  </p>
                ) : (
                  cursos.map((curso, i) => (
                    <div key={i} className="space-y-2">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ background: glowColor, boxShadow: `0 0 8px ${glowColor}` }}
                        />
                        {curso.name}
                      </h3>
                      <p className="text-xs text-slate-400 ml-3">{curso.description}</p>
                      <div className="flex flex-wrap gap-1.5 ml-3">
                        {curso.levels.map((nivel, j) => (
                          <span
                            key={j}
                            className="text-[10px] px-2 py-1 rounded-full border"
                            style={{
                              borderColor: `${glowColor}44`,
                              color: glowColor,
                              background: `${glowColor}11`,
                            }}
                          >
                            {nivel.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Botón cerrar */}
              <div className="p-4 pt-0 flex justify-center">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-xs px-6 py-2 rounded-full transition-colors"
                  style={{
                    border: `1px solid ${glowColor}66`,
                    color: glowColor,
                    background: `${glowColor}11`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${glowColor}22`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `${glowColor}11`; }}
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-14px) rotate(1.5deg) scale(1.012); }
        }
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.2; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes theme-float-0 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); top: 5%; left: 5%; }
          25% { transform: translate(15px, -10px) rotate(10deg); top: 8%; left: 12%; }
          50% { transform: translate(-5px, 15px) rotate(-5deg); top: 15%; left: 3%; }
          75% { transform: translate(10px, 5px) rotate(8deg); top: 2%; left: 10%; }
        }
        @keyframes theme-float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); top: 60%; right: 5%; }
          33% { transform: translate(-12px, -8px) rotate(-8deg); top: 55%; right: 12%; }
          66% { transform: translate(8px, 10px) rotate(5deg); top: 68%; right: 3%; }
        }
        @keyframes theme-float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); bottom: 15%; left: 15%; }
          50% { transform: translate(10px, -12px) rotate(12deg); bottom: 10%; left: 25%; }
        }
        @keyframes theme-float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); bottom: 45%; right: 10%; }
          50% { transform: translate(-8px, 8px) rotate(-6deg); bottom: 50%; right: 18%; }
        }
      `}</style>
    </>
  );
}
