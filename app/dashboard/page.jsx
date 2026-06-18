
'use client';
import { useEffect, useRef, useState } from 'react';
import FondoCosmico from '../fondo-cosmico';

/**
 * Dashboard — MAPA ESTELAR
 * Contenedor principal de la aplicación educativa cósmica.
 */

// ══════════════════════════════════════════
//  Datos de los planetas del sistema
// ══════════════════════════════════════════
const PLANETAS = [
  {
    id: 'numerix',
    nombre: 'Numérix',
    materia: 'Matemáticas',
    gradientStyle:
      'radial-gradient(circle at 35% 30%, #00f5ff 0%, #0080ff 35%, #0030b0 65%, #000d40 100%)',
    glow: '#00f5ff',
    glowColor: '#00e4ff',
    delay: 0,
  },
  {
    id: 'letralia',
    nombre: 'Letralia',
    materia: 'Lenguaje',
    gradientStyle:
      'radial-gradient(circle at 35% 30%, #df80ff 0%, #9b30ff 35%, #5a00b0 65%, #1a0040 100%)',
    glow: '#bf40ff',
    glowColor: '#c840ff',
    delay: 1.4,
  },
  {
    id: 'naturae',
    nombre: 'Naturae',
    materia: 'Ciencias',
    gradientStyle:
      'radial-gradient(circle at 35% 30%, #80ffb4 0%, #00e070 35%, #008040 65%, #001a14 100%)',
    glow: '#00ff88',
    glowColor: '#00f080',
    delay: 2.8,
  },
];

// ══════════════════════════════════════════
//  Partícula flotante decorativa
// ══════════════════════════════════════════
function FloatingParticle({ style }) {
  return <div className="absolute rounded-full pointer-events-none" style={style} />;
}

// ══════════════════════════════════════════
//  Esfera flotante con animación RAF propia
// ══════════════════════════════════════════
function FloatingSphere({ planeta }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = null;
    let raf;

    const animate = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000 + planeta.delay;
      const y = Math.sin(t * 0.55) * 14;
      const r = Math.sin(t * 0.35) * 1.5;
      const s = hovered ? 1.07 : 1 + Math.sin(t * 0.7) * 0.012;
      el.style.transform = `translateY(${y}px) rotate(${r}deg) scale(${s})`;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [planeta.delay, hovered]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-full flex flex-col items-center justify-center cursor-pointer"
      style={{
        width: 185,
        height: 185,
        background: planeta.gradientStyle,
        boxShadow: `
          0 0 45px ${planeta.glow}80,
          0 0 90px ${planeta.glow}45,
          0 0 150px ${planeta.glow}20,
          inset 0 -25px 60px rgba(0,0,0,0.5),
          inset 0 12px 35px rgba(255,255,255,0.13)
        `,
        willChange: 'transform',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Reflejo especular */}
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

      {/* Nombre del planeta */}
      <span
        className="font-black tracking-wider text-center z-10"
        style={{
          fontSize: '1.15rem',
          color: '#ffffff',
          textShadow: `0 0 22px ${planeta.glow}, 0 2px 8px rgba(0,0,0,0.7)`,
          letterSpacing: '0.12em',
        }}
      >
        {planeta.nombre}
      </span>

      {/* Materia */}
      <span
        className="text-xs font-semibold tracking-widest mt-1 z-10"
        style={{
          color: 'rgba(255,255,255,0.72)',
          textShadow: '0 1px 6px rgba(0,0,0,0.8)',
          letterSpacing: '0.2em',
        }}
      >
        {planeta.materia.toUpperCase()}
      </span>
    </div>
  );
}

// ══════════════════════════════════════════
//  Botón Explorar con feedback de clic
// ══════════════════════════════════════════
function ExploreButton({ planeta, onExplore }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1200);
    if (onExplore) onExplore({ nombre: planeta.nombre, materia: planeta.materia });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '11px 40px',
          borderRadius: 50,
          border: `1.5px solid ${planeta.glowColor}99`,
          background: clicked
            ? `linear-gradient(135deg, ${planeta.glowColor}55, ${planeta.glowColor}22)`
            : hovered
            ? `linear-gradient(135deg, ${planeta.glowColor}33, ${planeta.glowColor}11)`
            : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          color: '#ffffff',
          fontSize: '0.75rem',
          fontWeight: 800,
          letterSpacing: '0.25em',
          cursor: 'pointer',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: hovered
            ? `0 0 30px ${planeta.glowColor}55, 0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`
            : `0 0 14px ${planeta.glowColor}33, inset 0 1px 0 rgba(255,255,255,0.08)`,
          transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)',
          textShadow: `0 0 14px ${planeta.glow}`,
          transform: hovered ? 'scale(1.08) translateY(-3px)' : 'scale(1) translateY(0)',
        }}
      >
        ✦&nbsp;&nbsp;EXPLORAR&nbsp;&nbsp;✦
      </button>

      {clicked && (
        <span
          className="text-xs font-bold tracking-widest animate-bounce"
          style={{
            color: planeta.glowColor,
            textShadow: `0 0 14px ${planeta.glowColor}`,
            fontSize: '0.65rem',
          }}
        >
          ✦ ¡INICIANDO VIAJE! ✦
        </span>
      )}
    </div>
  );
}

// ══════════════════════════════════════════
//  Tarjeta completa del planeta (wrapper)
// ══════════════════════════════════════════
function PlanetaCard({ planeta, onExplore }) {
  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Contenedor esfera + halos */}
      <div className="relative flex items-center justify-center" style={{ width: 210, height: 210 }}>
        {/* Ping exterior */}
        <div
          className="absolute rounded-full animate-ping"
          style={{
            width: 215,
            height: 215,
            border: `1px solid ${planeta.glowColor}55`,
            background: `radial-gradient(circle, transparent 55%, ${planeta.glowColor}18 100%)`,
            animationDuration: '3.5s',
          }}
        />

        {/* Halo difuminado */}
        <div
          className="absolute rounded-full"
          style={{
            width: 260,
            height: 260,
            filter: 'blur(36px)',
            background: `radial-gradient(circle, ${planeta.glowColor}55 0%, transparent 70%)`,
            opacity: 0.65,
          }}
        />

        {/* Esfera principal animada */}
        <FloatingSphere planeta={planeta} />
      </div>

      {/* Botón */}
      <ExploreButton planeta={planeta} onExplore={onExplore} />
    </div>
  );
}

// ══════════════════════════════════════════
//  PÁGINA PRINCIPAL — MAPA ESTELAR
// ══════════════════════════════════════════
export default function Dashboard() {
  const handleExplorar = ({ nombre, materia }) => {
    console.log(`🚀 Explorando planeta ${nombre} — ${materia}`);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: '#00000a', fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* ── CAPA 0: Canvas de estrellas ── */}
      <FondoCosmico />

      {/* ══════════════════════════════════════════
          CAPA 1 — AURORAS BOREALES / NEBULOSAS
      ══════════════════════════════════════════ */}

      {/* Aurora Verde — superior izquierda */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: '-180px', left: '-200px',
          width: '700px', height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,220,120,0.22) 0%, rgba(0,180,100,0.10) 45%, transparent 75%)',
          filter: 'blur(120px)',
          zIndex: 1,
          animation: 'auroraDrift1 18s ease-in-out infinite',
        }}
      />

      {/* Aurora Violeta — superior derecha */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: '-120px', right: '-180px',
          width: '750px', height: '750px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(150,30,255,0.20) 0%, rgba(100,0,200,0.10) 45%, transparent 75%)',
          filter: 'blur(140px)',
          zIndex: 1,
          animation: 'auroraDrift2 22s ease-in-out infinite',
        }}
      />

      {/* Aurora Cian — centro */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: '30%', left: '25%',
          width: '900px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,180,240,0.13) 0%, rgba(0,120,200,0.07) 50%, transparent 75%)',
          filter: 'blur(160px)',
          zIndex: 1,
          animation: 'auroraDrift3 26s ease-in-out infinite',
        }}
      />

      {/* Aurora Esmeralda — inferior derecha */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: '-200px', right: '-100px',
          width: '650px', height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,140,0.14) 0%, rgba(0,200,80,0.07) 50%, transparent 75%)',
          filter: 'blur(130px)',
          zIndex: 1,
          animation: 'auroraDrift1 20s ease-in-out infinite reverse',
        }}
      />

      {/* Aurora Púrpura — inferior izquierda */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: '-150px', left: '-150px',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,0,255,0.15) 0%, rgba(120,0,180,0.08) 50%, transparent 75%)',
          filter: 'blur(150px)',
          zIndex: 1,
          animation: 'auroraDrift2 24s ease-in-out infinite reverse',
        }}
      />

      {/* ══════════════════════════════════════════
          CAPA 2 — Partículas decorativas flotantes
      ══════════════════════════════════════════ */}
      {[
        { top: '12%', left: '8%',  w: 3, color: '#00ffcc', dur: '4s',   del: '0s'   },
        { top: '22%', left: '88%', w: 2, color: '#bf40ff', dur: '5s',   del: '1s'   },
        { top: '55%', left: '5%',  w: 4, color: '#00bfff', dur: '6s',   del: '0.5s' },
        { top: '70%', left: '92%', w: 2, color: '#00ff80', dur: '4.5s', del: '2s'   },
        { top: '85%', left: '20%', w: 3, color: '#9b30ff', dur: '5.5s', del: '1.5s' },
        { top: '40%', left: '95%', w: 2, color: '#00e4ff', dur: '3.8s', del: '0.8s' },
        { top: '90%', left: '75%', w: 4, color: '#40ff80', dur: '6.5s', del: '0.3s' },
        { top: '15%', left: '50%', w: 2, color: '#ff80ff', dur: '4.2s', del: '1.8s' },
      ].map((p, i) => (
        <FloatingParticle
          key={i}
          style={{
            top: p.top, left: p.left,
            width: p.w * 2 + 'px', height: p.w * 2 + 'px',
            background: p.color,
            boxShadow: `0 0 ${p.w * 5}px ${p.color}, 0 0 ${p.w * 10}px ${p.color}88`,
            zIndex: 2,
            animation: `floatParticle ${p.dur} ease-in-out infinite`,
            animationDelay: p.del,
          }}
        />
      ))}

      {/* ══════════════════════════════════════════
          CAPA 3 — CONTENIDO PRINCIPAL
      ══════════════════════════════════════════ */}
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-6 py-16"
        style={{ zIndex: 10 }}
      >
        {/* ── ENCABEZADO PREMIUM ── */}
        <header
          className="text-center mb-8"
          style={{ animation: 'fadeSlideDown 1.2s cubic-bezier(0.23,1,0.32,1) both' }}
        >
          {/* Línea decorativa superior */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              style={{
                height: 1, width: 80,
                background: 'linear-gradient(90deg, transparent, rgba(0,220,255,0.6))',
              }}
            />
            <span
              style={{
                color: 'rgba(0,220,255,0.7)',
                fontSize: '0.62rem',
                letterSpacing: '0.4em',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Sistema Educativo Estelar
            </span>
            <div
              style={{
                height: 1, width: 80,
                background: 'linear-gradient(90deg, rgba(0,220,255,0.6), transparent)',
              }}
            />
          </div>

          {/* TÍTULO PRINCIPAL */}
          <h1
            style={{
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              fontWeight: 900,
              letterSpacing: '0.18em',
              lineHeight: 1,
              background:
                'linear-gradient(135deg, #ffffff 0%, #80f0ff 25%, #ffffff 50%, #c080ff 75%, #80ffcc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter:
                'drop-shadow(0 0 30px rgba(0,200,255,0.35)) drop-shadow(0 0 60px rgba(150,0,255,0.20))',
              marginBottom: '0.3em',
            }}
          >
            MAPA ESTELAR
          </h1>

          {/* Subtítulo */}
          <p
            style={{
              fontSize: 'clamp(0.72rem, 2vw, 0.92rem)',
              color: 'rgba(180,230,255,0.60)',
              letterSpacing: '0.32em',
              fontWeight: 400,
              marginTop: '0.8em',
              textTransform: 'uppercase',
            }}
          >
            Elige tu mundo de conocimiento y comienza tu misión
          </p>

          {/* Separador decorativo SVG */}
          <div className="flex justify-center mt-6">
            <svg width="220" height="18" viewBox="0 0 220 18" fill="none">
              <line x1="0" y1="9" x2="86" y2="9" stroke="url(#lg1)" strokeWidth="1" />
              <polygon points="96,3 110,9 96,15 104,9" fill="rgba(0,220,255,0.55)" />
              <polygon points="124,3 110,9 124,15 116,9" fill="rgba(180,80,255,0.55)" />
              <line x1="134" y1="9" x2="220" y2="9" stroke="url(#lg2)" strokeWidth="1" />
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="86" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="100%" stopColor="rgba(0,220,255,0.7)" />
                </linearGradient>
                <linearGradient id="lg2" x1="134" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(180,80,255,0.7)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </header>

        {/* ── GRID DE PLANETAS ── */}
        <main
          className="grid gap-16 w-full max-w-5xl mx-auto"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            justifyItems: 'center',
            alignItems: 'start',
          }}
        >
          {PLANETAS.map((planeta, index) => (
            <div
              key={planeta.id}
              style={{
                animation: `fadeSlideUp 1s cubic-bezier(0.23,1,0.32,1) ${index * 0.22 + 0.5}s both`,
              }}
            >
              <PlanetaCard planeta={planeta} onExplore={handleExplorar} />
            </div>
          ))}
        </main>

        {/* ── PIE DE PÁGINA ── */}
        <footer
          className="mt-20 text-center"
          style={{
            color: 'rgba(100,160,200,0.38)',
            fontSize: '0.62rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            animation: 'fadeSlideDown 2s ease 1.8s both',
          }}
        >
          ✦&nbsp; Tesis de Grado — Aplicación Educativa Interactiva &nbsp;✦
        </footer>
      </div>

      {/* ══════════════════════════════════════════
          KEYFRAMES GLOBALES
      ══════════════════════════════════════════ */}
      <style>{`
        @keyframes auroraDrift1 {
          0%   { transform: translate(0px,   0px)  scale(1);    opacity: 1;    }
          33%  { transform: translate(60px,  40px) scale(1.12); opacity: 0.85; }
          66%  { transform: translate(-30px, 70px) scale(0.95); opacity: 1;    }
          100% { transform: translate(0px,   0px)  scale(1);    opacity: 1;    }
        }
        @keyframes auroraDrift2 {
          0%   { transform: translate(0px,   0px)  scale(1);    }
          40%  { transform: translate(-80px, 50px) scale(1.08); }
          80%  { transform: translate(40px, -40px) scale(0.92); }
          100% { transform: translate(0px,   0px)  scale(1);    }
        }
        @keyframes auroraDrift3 {
          0%   { transform: translate(0px,   0px)  scale(1)    rotate(0deg); }
          50%  { transform: translate(60px, -50px) scale(1.15) rotate(8deg); }
          100% { transform: translate(0px,   0px)  scale(1)    rotate(0deg); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px)   scale(1);   opacity: 0.8; }
          50%       { transform: translateY(-18px) scale(1.3); opacity: 1;   }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to   { opacity: 1; transform: translateY(0px);   }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0px)  scale(1);    }
        }
      `}</style>
    </div>
  );
}
