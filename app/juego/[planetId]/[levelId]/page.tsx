'use client';

import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useCallback } from 'react';
import { getPlanetById } from '../../../../lib/mock-data';
import { useAuthStore } from '../../../../lib/auth-store';
import Dado3D from '../../../components/Dado3D';
import TableroIsometrico from '../../../components/TableroIsometrico';

const FondoCosmico = dynamic(() => import('../../../FondoCosmico'), { ssr: false });

function OrbitingDot({ radius, size, color, delay }: { radius: number; size: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 8px ${color}`,
        left: '50%',
        top: '50%',
        x: -size / 2,
        y: -size / 2,
      }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: color,
          boxShadow: `0 0 12px ${color}`,
          left: radius,
          top: 0,
        }}
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    </motion.div>
  );
}

function GenericBoard({
  planetColor,
  diceRolling,
  diceResult,
  showResult,
  onRoll,
  onRollComplete,
}: {
  planetColor: string;
  diceRolling: boolean;
  diceResult: number;
  showResult: boolean;
  onRoll: () => void;
  onRollComplete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="relative w-full max-w-sm aspect-square"
    >
      <div
        className="absolute inset-0 rounded-[32px] overflow-hidden"
        style={{
          border: `1px solid ${planetColor}22`,
          background: `radial-gradient(ellipse at 50% 40%, ${planetColor}15, transparent 70%), radial-gradient(ellipse at 50% 80%, ${planetColor}08, transparent 50%)`,
          boxShadow: `inset 0 0 80px ${planetColor}08, 0 0 60px ${planetColor}08`,
        }}
      >
        <div className="absolute inset-4 rounded-2xl border border-white/[0.03]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div
              className="absolute rounded-full"
              style={{
                width: 200,
                height: 200,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, ${planetColor}11 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 140,
                height: 140,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: `1px solid ${planetColor}15`,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 180,
                height: 180,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: `1px dashed ${planetColor}10`,
              }}
            />

            <OrbitingDot radius={85} size={4} color={planetColor} delay={0} />
            <OrbitingDot radius={100} size={3} color={planetColor} delay={0.8} />
            <OrbitingDot radius={75} size={3.5} color={planetColor} delay={1.6} />

            <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
              <Dado3D
                size={90}
                rolling={diceRolling}
                result={diceResult}
                onRollComplete={onRollComplete}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div
              className="px-5 py-2 rounded-full text-sm font-bold tracking-wide"
              style={{
                background: `linear-gradient(135deg, ${planetColor}22, ${planetColor}11)`,
                border: `1px solid ${planetColor}44`,
                color: '#fff',
                boxShadow: `0 0 30px ${planetColor}22`,
              }}
            >
              {diceResult}/6
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mt-5">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={onRoll}
          disabled={diceRolling}
          className="relative px-10 py-3.5 rounded-full text-sm font-bold tracking-widest overflow-hidden"
          style={{
            border: `1.5px solid ${diceRolling ? planetColor + '44' : planetColor + '99'}`,
            color: '#fff',
            background: diceRolling
              ? `${planetColor}15`
              : `linear-gradient(135deg, ${planetColor}30, ${planetColor}10)`,
            boxShadow: diceRolling ? 'none' : `0 0 30px ${planetColor}22`,
            cursor: diceRolling ? 'not-allowed' : 'pointer',
            opacity: diceRolling ? 0.5 : 1,
          }}
        >
          {diceRolling ? (
            <span className="flex items-center gap-2">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                ⏳
              </motion.span>
              Rodando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>🎲</span>
              LANZAR DADO
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : '0,245,212';
}

export default function JuegoPage() {
  const params = useParams<{ planetId: string; levelId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const planetId = parseInt(params.planetId, 10);
  const levelId = parseInt(params.levelId, 10);

  const planet = useMemo(() => getPlanetById(planetId), [planetId]);
  const level = useMemo(() => {
    if (!planet) return null;
    for (const c of planet.courses) {
      const found = c.levels.find((l) => l.id === levelId);
      if (found) return found;
    }
    return null;
  }, [planet, levelId]);

  const isNumerixLevel1 = planetId === 1 && levelId === 1;

  const [diceRolling, setDiceRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(1);
  const [lastRoll, setLastRoll] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentPos, setCurrentPos] = useState(0);

  const handleRoll = useCallback(() => {
    if (diceRolling) return;
    const result = Math.floor(Math.random() * 6) + 1;
    setDiceResult(result);
    setDiceRolling(true);
    setShowResult(false);
  }, [diceRolling]);

  const handleRollComplete = useCallback(() => {
    setDiceRolling(false);
    setLastRoll(diceResult);
    setShowResult(true);
  }, [diceResult]);

  if (!planet || !level) {
    return (
      <div className="fixed inset-0 z-[100] h-screen w-screen flex items-center justify-center" style={{ background: '#00000a' }}>
        <FondoCosmico />
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-black text-white mb-2">Nivel no encontrado</h1>
          <p className="text-slate-400 text-sm mb-4">Este nivel no existe en el cosmos...</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 rounded-full text-sm font-bold border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          >
            ← Volver al mapa
          </button>
        </div>
      </div>
    );
  }

  const course = planet.courses.find((c) => c.levels.some((l) => l.id === levelId));
  const pc = hexToRgb(planet.color);

  return (
    <div className="fixed inset-0 z-[100] h-screen w-screen overflow-hidden" style={{ background: '#00000a' }}>
      <FondoCosmico />

      {/* ── HUD HEADER ── */}
      <header
        className="fixed top-0 left-0 w-full z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(0,20,28,.95) 0%, transparent 100%)',
          borderBottom: `1px solid rgba(${pc},.2)`,
        }}
      >
        <div className="w-full mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all shadow-md"
              style={{ 
                color: '#fff', 
                background: `linear-gradient(135deg, ${planet.color}40, ${planet.color}20)`,
                border: `1px solid ${planet.color}80`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${planet.color}60, ${planet.color}30)`;
                e.currentTarget.style.boxShadow = `0 0 15px ${planet.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${planet.color}40, ${planet.color}20)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              VOLVER
            </button>
            <div style={{ borderLeft: `1px solid rgba(${pc},.3)`, height: 20 }} />
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: "'Orbitron',monospace",
                  fontWeight: 900,
                  fontSize: '.85rem',
                  letterSpacing: '.2em',
                  color: planet.color,
                  textShadow: `0 0 12px rgba(${pc},.6)`,
                }}
              >
                ◈ {planet.name.toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: '.55rem',
                  letterSpacing: '.15em',
                  color: `rgba(${pc},.5)`,
                  border: `1px solid rgba(${pc},.3)`,
                  padding: '2px 8px',
                  borderRadius: 2,
                }}
              >
                TABLERO CUÁNTICO
              </span>
            </div>
          </div>
          <div style={{ fontSize: '.6rem', letterSpacing: '.2em', color: `rgba(${pc},.4)` }}>
            {user ? `JUGADOR: ${user.name.toUpperCase()}` : 'SIN SESIÓN'}
            &nbsp;|&nbsp; CASILLA {currentPos + 1}
          </div>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="relative z-10 h-full" style={{ paddingTop: 56 }}>
        {isNumerixLevel1 ? (
          <TableroIsometrico
            planetColor={planet.color}
            planetGlow={planet.glow}
            onPositionChange={setCurrentPos}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center px-4">
            <GenericBoard
              planetColor={planet.color}
              diceRolling={diceRolling}
              diceResult={diceResult}
              showResult={showResult}
              onRoll={handleRoll}
              onRollComplete={handleRollComplete}
            />
          </div>
        )}
      </div>

      <style>{`
        @property --angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
      `}</style>
    </div>
  );
}