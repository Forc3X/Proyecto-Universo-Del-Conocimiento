'use client';

import { useState } from 'react';

interface PlanetaProps {
  nombre?: string;
  materia?: string;
  gradient?: string;
  glow?: string;
  glowColor?: string;
  delay?: number;
  onExplore?: (data: { nombre: string; materia: string }) => void;
}

export default function Planeta({
  nombre = 'Planeta',
  materia = 'Materia',
  gradient = 'radial-gradient(circle at 35% 30%, #00f5ff 0%, #0080ff 40%, #000d40 100%)',
  glow = '#00f5ff',
  glowColor = '#00e4ff',
  delay = 0,
  onExplore,
}: PlanetaProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleExplore = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1200);
    if (onExplore) onExplore({ nombre, materia });
  };

  return (
    <div
      className="flex flex-col items-center gap-6 select-none"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      <div className="relative flex items-center justify-center" style={{ width: 210, height: 210 }}>
        <div
          className="absolute rounded-full"
          style={{
            width: 215,
            height: 215,
            border: `1px solid ${glowColor}55`,
            background: `radial-gradient(circle, transparent 55%, ${glowColor}18 100%)`,
            animation: `ping-slow 3.5s ease-in-out infinite`,
          }}
        />

        <div
          className="absolute rounded-full"
          style={{
            width: 265,
            height: 265,
            filter: 'blur(38px)',
            background: `radial-gradient(circle, ${glowColor}55 0%, transparent 70%)`,
            opacity: hovered ? 0.9 : 0.65,
            transition: 'opacity 0.4s ease',
          }}
        />

        <div
          style={{
            animation: `float ${3 + delay}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative rounded-full flex flex-col items-center justify-center cursor-pointer"
          style={{
            width: 185,
            height: 185,
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
            style={{
              position: 'absolute',
              width: 65,
              height: 32,
              top: 24,
              left: 28,
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.28) 0%, transparent 100%)',
              filter: 'blur(5px)',
              borderRadius: '50%',
            }}
          />

          <span
            className="font-black tracking-wider text-center z-10"
            style={{
              fontSize: '1.15rem',
              color: '#ffffff',
              textShadow: `0 0 22px ${glow}, 0 2px 8px rgba(0,0,0,0.7)`,
              letterSpacing: '0.12em',
            }}
          >
            {nombre}
          </span>

          <span
            className="font-semibold tracking-widest mt-1 z-10"
            style={{
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.72)',
              textShadow: '0 1px 6px rgba(0,0,0,0.8)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
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
            padding: '11px 40px',
            borderRadius: '50px',
            border: `1.5px solid ${glowColor}99`,
            background: clicked
              ? `linear-gradient(135deg, ${glowColor}55, ${glowColor}22)`
              : hovered
                ? `linear-gradient(135deg, ${glowColor}33, ${glowColor}11)`
                : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.25em',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
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
              fontSize: '0.62rem',
              color: glowColor,
              textShadow: `0 0 14px ${glowColor}`,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              animation: 'bounce 0.6s ease-in-out infinite',
            }}
          >
            ✦ ¡Iniciando viaje! ✦
          </span>
        )}
      </div>

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
      `}</style>
    </div>
  );
}
