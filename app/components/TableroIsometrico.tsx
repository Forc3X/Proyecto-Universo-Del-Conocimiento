'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getRandomPregunta, PreguntaMatematica } from '../../lib/preguntas-numerix';

interface Props {
  planetColor: string;
  planetGlow: string;
  onPositionChange?: (pos: number) => void;
}

const TOTAL = 20, COLS = 5, STEP_Z = 24;
const SPECIAL = [3, 7, 11, 15];
const TRAPS = [5, 9, 13];

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : '0,245,212';
}

function cellPos(i: number) {
  const row = Math.floor(i / COLS), col = i % COLS;
  const goRight = row % 2 === 0;
  const ec = goRight ? col : COLS - 1 - col;
  return {
    x: 430 + (ec - 2) * 76,
    y: 700 - ec * 20 - row * 50 - i * STEP_Z,
  };
}

const DOTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 22], [75, 22], [25, 50], [75, 50], [25, 78], [75, 78]],
};

export default function TableroIsometrico({ planetColor, planetGlow, onPositionChange }: Props) {
  const [pos, setPos] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState(0);
  const [displayRoll, setDisplayRoll] = useState(1);
  const [showBoss, setShowBoss] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Módulo de preguntas
  const [stars, setStars] = useState(0);
  const [question, setQuestion] = useState<PreguntaMatematica | null>(null);
  const [qStatus, setQStatus] = useState<'idle' | 'answering' | 'correct' | 'incorrect'>('idle');
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  // Minijuego Guardián
  const [bossHp, setBossHp] = useState(3);
  const [bossBattleActive, setBossBattleActive] = useState(false);

  // Estado de penalización
  const [isPenalized, setIsPenalized] = useState(false);

  // Minijuego A: Secuencia (Casilla Especial)
  const [specialSequence, setSpecialSequence] = useState<number[]>([]);
  const [specialSelection, setSpecialSelection] = useState<number[]>([]);
  const [specialStatus, setSpecialStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [penaltyValue, setPenaltyValue] = useState(1);
  const [specialAttempts, setSpecialAttempts] = useState(0);

  // Minijuego B: Escudo Láser (Trampa)
  const [trapAsteroids, setTrapAsteroids] = useState<number[]>([]);
  const [trapStatus, setTrapStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [trapSelected, setTrapSelected] = useState<number | null>(null);

  const diceRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const pc = hexToRgb(planetColor);

  useEffect(() => {
    const t = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    onPositionChange?.(pos);
  }, [pos, onPositionChange]);

  const [moveId, setMoveId] = useState(0);
  useEffect(() => {
    if (moveId === 0) return;
    requestAnimationFrame(() => {
      const cell = document.getElementById(`cell-${pos}`);
      if (cell && boardRef.current) {
        const container = boardRef.current;
        const cellRect = cell.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollTarget = container.scrollTop + cellRect.top - containerRect.top - containerRect.height / 2 + 20;
        container.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
      }
    });
  }, [moveId]);

  const roll = useCallback(() => {
    if (rolling || pos >= TOTAL - 1) return;

    setRolling(true);

    const scrambleIv = setInterval(() => {
      setDisplayRoll(Math.floor(Math.random() * 6) + 1);
    }, 80);

    setTimeout(() => {
      clearInterval(scrambleIv);

      const n = isPenalized ? penaltyValue : Math.floor(Math.random() * 6) + 1;
      setIsPenalized(false);
      setLastRoll(n);
      setDisplayRoll(n);

      const target = Math.min(pos + n, TOTAL - 1);
      let step = pos;
      const iv = setInterval(() => {
        step++;
        setPos(Math.min(step, target));
        if (step >= target) {
          clearInterval(iv);
          setRolling(false);
          setMoveId(m => m + 1);
          if (step >= TOTAL - 1) {
            setTimeout(() => setShowBoss(true), 500);
          } else if (SPECIAL.includes(step)) {
            setTimeout(() => startSpecialMinigame(), 500);
          } else if (TRAPS.includes(step)) {
            setTimeout(() => startTrapMinigame(), 500);
          } else {
            setTimeout(() => {
              setQuestion(getRandomPregunta());
              setQStatus('idle');
              setSelectedOpt(null);
            }, 600);
          }
        }
      }, 280);
    }, 800);
  }, [pos, rolling, isPenalized]);

  const startSpecialMinigame = useCallback(() => {
    const numsSet = new Set<number>();
    while (numsSet.size < 4) {
      numsSet.add(Math.floor(Math.random() * 90) + 10);
    }
    const nums = Array.from(numsSet);
    setSpecialSequence(nums);
    setSpecialSelection([]);
    setSpecialStatus('idle');
    setSpecialAttempts(0);
  }, []);

  const handleSpecialClick = useCallback((num: number) => {
    if (specialStatus !== 'idle') return;
    if (specialSelection.includes(num)) return;

    const newSelection = [...specialSelection, num];
    const sortedFull = [...specialSequence].sort((a, b) => a - b);

    if (sortedFull[specialSelection.length] === num) {
      setSpecialSelection(newSelection);
      if (newSelection.length === specialSequence.length) {
        setSpecialStatus('correct');
        setTimeout(() => {
          setStars(s => s + 2);
          setSpecialSequence([]);
        }, 2500);
      }
    } else {
      setSpecialStatus('incorrect');
      if (specialAttempts < 1) {
        setSpecialAttempts(a => a + 1);
        setTimeout(() => {
          setSpecialSelection([]);
          setSpecialStatus('idle');
        }, 1500);
      } else {
        setTimeout(() => {
          setSpecialSequence([]);
        }, 2000);
      }
    }
  }, [specialStatus, specialSelection, specialSequence, specialAttempts]);

  const startTrapMinigame = useCallback(() => {
    const even = (Math.floor(Math.random() * 45) * 2) + 10;
    const odd1 = (Math.floor(Math.random() * 45) * 2) + 11;
    const odd2 = (Math.floor(Math.random() * 45) * 2) + 13;
    const arr = [even, odd1, odd2].sort(() => Math.random() - 0.5);
    setTrapAsteroids(arr);
    setTrapStatus('idle');
    setTrapSelected(null);
  }, []);

  const handleTrapClick = useCallback((idx: number) => {
    if (trapStatus !== 'idle') return;
    setTrapSelected(idx);
    const num = trapAsteroids[idx];
    if (num % 2 === 0) {
      setTrapStatus('correct');
      setTimeout(() => {
        setTrapAsteroids([]);
      }, 2000);
    } else {
      setTrapStatus('incorrect');
      setTimeout(() => {
        setIsPenalized(true);
        setTrapAsteroids([]);
      }, 2500);
    }
  }, [trapStatus, trapAsteroids]);

  const startBossBattle = useCallback(() => {
    setShowBoss(false);
    setBossHp(3);
    setBossBattleActive(true);
    setTimeout(() => {
      setQuestion(getRandomPregunta());
      setQStatus('idle');
      setSelectedOpt(null);
    }, 500);
  }, []);

  const handleAnswer = useCallback((idx: number) => {
    if (qStatus !== 'idle') return;
    setSelectedOpt(idx);

    if (idx === question?.indiceRespuestaCorrecta) {
      setQStatus('correct');
      if (bossBattleActive) {
        const newHp = bossHp - 1;
        setBossHp(newHp);
        if (newHp <= 0) {
          setTimeout(() => {
            setQuestion(null);
            setBossBattleActive(false);
            setShowWin(true);
          }, 2500);
        } else {
          setTimeout(() => {
            let nextQ = getRandomPregunta();
            while (nextQ.enunciado === question?.enunciado) {
              nextQ = getRandomPregunta();
            }
            setQuestion(nextQ);
            setQStatus('idle');
            setSelectedOpt(null);
          }, 2500);
        }
      } else {
        setStars(s => s + 1);
        setTimeout(() => setQuestion(null), 2500);
      }
    } else {
      setQStatus('incorrect');
      if (bossBattleActive) {
        setTimeout(() => {
          let nextQ = getRandomPregunta();
          while (nextQ.enunciado === question?.enunciado) {
            nextQ = getRandomPregunta();
          }
          setQuestion(nextQ);
          setQStatus('idle');
          setSelectedOpt(null);
        }, 4500);
      } else {
        setTimeout(() => {
          setQuestion(null);
          setIsPenalized(true);
        }, 4000);
      }
    }
  }, [qStatus, question, bossBattleActive, bossHp]);

  const restart = useCallback(() => {
    setPos(0);
    setLastRoll(0);
    setStars(0);
    setShowWin(false);
    setShowBoss(false);
    setBossBattleActive(false);
    setSpecialSequence([]);
    setTrapAsteroids([]);
  }, []);

  const cubes = Array.from({ length: TOTAL }, (_, i) => i);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <style>{`
        @keyframes diceShake {
          0% { transform: rotate(-5deg) scale(1.1); }
          50% { transform: rotate(5deg) scale(1.1); }
          100% { transform: rotate(-5deg) scale(1.1); }
        }
        @keyframes tokenFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes arrivalFlash{0%{r:8;opacity:1}100%{r:32;opacity:0}}
        @keyframes pulseFade{0%{opacity:.8;r:10}100%{opacity:0;r:30}}
        @keyframes bossCellPulse{0%,100%{opacity:1}50%{opacity:.85}}
        @keyframes bossPulse{0%,100%{opacity:1}50%{opacity:.7}}
        @keyframes bossGlitch{0%,90%,100%{transform:none;opacity:1}92%{transform:translateX(-3px);opacity:.8}94%{transform:translateX(3px);opacity:.9}96%{transform:translateX(-2px)}98%{transform:translateX(2px)}}
        @keyframes beam{0%,100%{opacity:.04}50%{opacity:.12}}
        @keyframes winPulse{from{transform:scale(1)}to{transform:scale(1.06)}}
        @keyframes bossHPPulse{0%,100%{opacity:1}50%{opacity:.7}}
        @keyframes cellReveal{0%{opacity:0;transform:translateY(12px) scale(.85)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes cellGlow{0%,100%{filter:drop-shadow(0 0 2px currentColor)}50%{filter:drop-shadow(0 0 8px currentColor)}}
        @keyframes cubeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
        .tf{animation:tokenFloat 2.2s ease-in-out infinite}
        .bp{animation:bossPulse 2s ease-in-out infinite}
        .ob{animation:orbit 3s linear infinite}
        .ob-r{animation:orbit 2.5s linear infinite reverse}
        .cell-anim{animation:cellReveal .5s ease-out both}
        .cell-active{animation:cellGlow 1.5s ease-in-out infinite}
        .board-scroll{flex:1;overflow-y:auto;scroll-behavior:smooth;position:relative;scrollbar-width:thin;scrollbar-color:rgba(${pc},.3) transparent}
        .board-scroll::-webkit-scrollbar{width:6px}
        .board-scroll::-webkit-scrollbar-track{background:transparent}
        .board-scroll::-webkit-scrollbar-thumb{background:rgba(${pc},.3);border-radius:3px}
      `}</style>

      {/* ── BOARD ── */}
      <div ref={boardRef} className="board-scroll">
        <svg
          viewBox="0 0 860 800"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', display: 'block', minHeight: '140%' }}
        >
          <defs>
            <radialGradient id="bossBg">
              <stop offset="0%" stopColor="#ff4d6d" stopOpacity=".25" />
              <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
            </radialGradient>
            <filter id="gl">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="glS" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glB" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid de fondo */}
          <g opacity=".08">
            {Array.from({ length: 15 }, (_, r) => (
              <line key={`h${r}`} x1={20} y1={30 + r * 52} x2={840} y2={30 + r * 52} stroke={planetColor} strokeWidth=".5" strokeDasharray="3 6" />
            ))}
            {Array.from({ length: 18 }, (_, c) => (
              <line key={`v${c}`} x1={20 + c * 46} y1={10} x2={20 + c * 46} y2={790} stroke={planetColor} strokeWidth=".5" strokeDasharray="3 8" />
            ))}
          </g>

          {/* Cubos */}
          {cubes.map(i => {
            const p = cellPos(i);
            const isBoss = i === TOTAL - 1;
            const isSpecial = SPECIAL.includes(i);
            const isTrap = TRAPS.includes(i);
            const isActive = i === pos;
            const isPast = i < pos;
            const w = isBoss ? 54 : 36;
            const d = isBoss ? 56 : 38;
            const h = d / 2;
            const cy = p.y;

            const top = `${p.x},${cy - d} ${p.x + w},${cy - d + h} ${p.x},${cy - d + h * 2} ${p.x - w},${cy - d + h}`;
            const left = `${p.x - w},${cy - d + h} ${p.x},${cy - d + h * 2} ${p.x},${cy - d + h * 2 + d} ${p.x - w},${cy - d + h + d}`;
            const right = `${p.x + w},${cy - d + h} ${p.x},${cy - d + h * 2} ${p.x},${cy - d + h * 2 + d} ${p.x + w},${cy - d + h + d}`;

            const sc = isBoss ? '#ff4d6d' : isTrap ? '#ff7850' : isSpecial ? '#ffe566' : planetColor;
            const tf = isBoss ? 'rgba(90,0,20,.85)' : isTrap ? 'rgba(255,100,50,.12)' : isSpecial ? `rgba(${pc},.22)` : isActive ? `rgba(${pc},.22)` : isPast ? `rgba(${pc},.14)` : `rgba(${pc},.09)`;
            const lf = isBoss ? 'rgba(50,0,10,.8)' : isTrap ? 'rgba(40,10,0,.85)' : `rgba(${pc},.15)`;
            const rf = isBoss ? 'rgba(35,0,8,.8)' : isTrap ? 'rgba(30,8,0,.9)' : `rgba(${pc},.1)`;

            return (
              <g
                key={i}
                id={`cell-${i}`}
                className={`${isBoss ? 'bp' : ''} ${revealed ? 'cell-anim' : ''} ${isActive ? 'cell-active' : ''}`}
                style={{
                  color: planetColor,
                  opacity: revealed ? undefined : 0,
                  animationDelay: revealed ? undefined : `${i * 60}ms`,
                  transformOrigin: `${p.x}px ${cy}px`,
                }}
              >
                {isBoss && (
                  <>
                    <ellipse cx={p.x} cy={cy - d + h + 10} rx={w + 30} ry={h + 16} fill="url(#bossBg)" opacity=".7" />
                    <ellipse cx={p.x} cy={cy - d + h + 10} rx={w + 14} ry={h + 6} fill="none" stroke="rgba(255,77,109,.5)" strokeWidth="2" strokeDasharray="8 5">
                      <animateTransform attributeName="transform" type="rotate" values={`0 ${p.x} ${cy - d + h + 10};360 ${p.x} ${cy - d + h + 10}`} dur="8s" repeatCount="indefinite" />
                    </ellipse>
                  </>
                )}
                <polygon points={top} fill={tf} stroke={sc} strokeWidth={isBoss ? 2 : isActive ? 2 : 1.4} strokeOpacity=".9" />
                <polygon points={left} fill={lf} stroke={sc} strokeWidth={isBoss ? 1.3 : .9} strokeOpacity=".6" />
                <polygon points={right} fill={rf} stroke={sc} strokeWidth={isBoss ? 1.3 : .9} strokeOpacity=".6" />
                {isBoss && (
                  <>
                    <text x={p.x} y={cy - d - 12} textAnchor="middle" fill="rgba(255,77,109,.9)" fontSize="8" fontFamily="Orbitron,monospace" letterSpacing="3" filter="url(#glS)">
                      GUARDIÁN DEL NIVEL
                    </text>
                    <text x={p.x} y={cy - d + h + 7} textAnchor="middle" fill="#ff4d6d" fontSize="22" filter="url(#glB)">
                      ☠
                    </text>
                  </>
                )}
                {!isBoss && isSpecial && (
                  <text x={p.x} y={cy - d + h + 5} textAnchor="middle" fill="#ffe566" fontSize="12" filter="url(#gl)">
                    ★
                  </text>
                )}
                {!isBoss && isTrap && (
                  <text x={p.x} y={cy - d + h + 5} textAnchor="middle" fill="#ff7850" fontSize="12" filter="url(#gl)">
                    ⚠
                  </text>
                )}
                {!isBoss && (
                  <text x={p.x} y={cy - d + h + 2} textAnchor="middle" fill={isActive ? '#fff' : `rgba(${pc},.4)`} fontSize="9" fontFamily="monospace" fontWeight={isActive ? 900 : 400}>
                    {String(i + 1).padStart(2, '0')}
                  </text>
                )}
              </g>
            );
          })}

          {/* Token del jugador */}
          {(() => {
            const p = cellPos(pos);
            const d = 38, h = 19;
            const faceY = p.y - d + h;
            const floatY = faceY - 16;
            const s = 10;
            return (
              <g className="tf" key={`token-${pos}`}>
                <ellipse cx={p.x} cy={faceY + 2} rx={12} ry={5} fill={`rgba(${pc},.18)`} />
                <circle cx={p.x} cy={floatY} r={14} fill="none" stroke={`rgba(${pc},.3)`} strokeWidth="1" className="tf" />
                <polygon
                  points={`${p.x},${floatY - s} ${p.x + s * .75},${floatY} ${p.x},${floatY + s} ${p.x - s * .75},${floatY}`}
                  fill={planetColor}
                  stroke="rgba(255,255,255,.9)"
                  strokeWidth="1.2"
                  filter="url(#glS)"
                />
                <circle cx={p.x} cy={floatY} r={3} fill="#fff" />
                <circle cx={p.x} cy={floatY} r={8} fill="none" stroke={`rgba(${pc},.9)`} strokeWidth="2" style={{ animation: 'arrivalFlash .5s ease-out forwards' }} />
              </g>
            );
          })()}

          {/* UFO orbitando */}
          <g opacity=".55">
            <animateMotion dur="12s" repeatCount="indefinite" rotate="auto"
              path="M150,380 Q430,200 710,380 Q430,560 150,380 Z"
            />
            <g transform="scale(.3)">
              <ellipse cx={0} cy={0} rx={64} ry={20} fill="rgba(20,40,70,.6)" stroke={`rgba(${pc},.3)`} strokeWidth="1" />
              <ellipse cx={0} cy={-12} rx={34} ry={18} fill="rgba(0,60,120,.2)" stroke={`rgba(${pc},.2)`} strokeWidth=".8" />
              <ellipse cx={0} cy={-14} rx={16} ry={9} fill={`rgba(${pc},.08)`} />
              {[0, 1, 2, 3, 4, 5].map(j => (
                <circle key={j} cx={-44 + j * 17} cy={14} r={3} fill={['#f00', '#f80', '#ff0', '#0f4', '#0af', '#a0f'][j]} opacity=".8">
                  <animate attributeName="opacity" values=".2;1;.2" dur=".8s" begin={`${j * .12}s`} repeatCount="indefinite" />
                </circle>
              ))}
              <ellipse cx={0} cy={42} rx={24} ry={60} fill={planetColor} style={{ animation: 'beam 3s ease-in-out infinite' }} />
            </g>
          </g>
        </svg>
      </div>

      {/* ── SIDEBAR (HUD Espacial) ── */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          padding: '24px 20px',
          background: 'rgba(2,10,18,0.85)',
          borderLeft: `1px solid rgba(${pc},.3)`,
          backdropFilter: 'blur(12px)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.6)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* HUD Superior: Perfil, Estrellas y Progreso */}
        <div style={{
          background: `linear-gradient(135deg, rgba(${pc},.15), rgba(${pc},.05))`,
          border: `1px solid rgba(${pc},.3)`,
          borderRadius: 16,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>👨‍🚀</span> Explorador
            </div>
            <div style={{ fontSize: '1.1rem', color: '#ffe566', fontWeight: '900', display: 'flex', alignItems: 'center', gap: 4, textShadow: '0 0 10px rgba(255,229,102,0.5)' }}>
              ⭐ {stars}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: '0.7rem', color: `rgba(${pc},.8)`, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>Casilla Actual</span>
              <span style={{ fontSize: '1.1rem', color: planetColor, fontWeight: '900', fontFamily: 'monospace' }}>{pos}/{TOTAL}</span>
            </div>

            {/* Barra de progreso */}
            <div style={{ height: 6, background: `rgba(0,0,0,0.6)`, borderRadius: 3, overflow: 'hidden', border: `1px solid rgba(${pc},.2)` }}>
              <div
                style={{
                  height: '100%',
                  background: planetColor,
                  borderRadius: 3,
                  width: `${(pos / (TOTAL - 1)) * 100}%`,
                  transition: 'width 0.5s ease-out',
                  boxShadow: `0 0 10px ${planetColor}`,
                }}
              />
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textAlign: 'right', marginTop: 4 }}>
              {Math.min(100, Math.round((pos / (TOTAL - 1)) * 100))}% Completado
            </div>
          </div>
        </div>

        {/* Dado y Control */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
          {/* Mensaje de estado superior al dado */}
          <div style={{ fontSize: '0.75rem', color: `rgba(${pc},.7)`, fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', minHeight: 18, textAlign: 'center' }}>
            {pos >= TOTAL - 1 ? '¡ZONA DEL GUARDIÁN!' : rolling ? 'Generando salto...' : lastRoll ? `Impacto: +${lastRoll}` : 'Esperando orden'}
          </div>

          <div
            style={{
              width: 70,
              height: 70,
              cursor: rolling ? 'not-allowed' : 'pointer',
              margin: '0 auto'
            }}
            onClick={roll}
          >
            <div
              style={{
                width: 70,
                height: 70,
                border: `2px solid rgba(${pc},.6)`,
                background: 'rgba(0,15,22,.95)',
                boxShadow: rolling ? `0 0 25px rgba(${pc},.7), inset 0 0 20px rgba(${pc},.3)` : `inset 0 0 20px rgba(${pc},.15)`,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: rolling ? 'diceShake 0.1s infinite cubic-bezier(0.36, 0.07, 0.19, 0.97)' : 'none',
                transform: rolling ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.1s'
              }}
            >
              <span style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: planetColor,
                textShadow: `0 0 15px rgba(${pc},0.8)`,
                opacity: rolling ? 0.9 : 1,
                transform: rolling ? 'scale(1.2)' : 'scale(1)',
                display: 'inline-block',
                transition: 'all 0.1s'
              }}>
                {rolling ? displayRoll : (lastRoll || 1)}
              </span>
            </div>
          </div>

          <button
            onClick={roll}
            disabled={rolling || pos >= TOTAL - 1}
            style={{
              width: '100%',
              padding: '16px 0',
              borderRadius: 12,
              background: rolling ? 'transparent' : `linear-gradient(90deg, rgba(${pc},.2), rgba(${pc},.4))`,
              border: `1px solid ${planetColor}`,
              color: '#fff',
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: '1rem',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              cursor: rolling ? 'not-allowed' : 'pointer',
              opacity: rolling ? .5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all .3s',
              boxShadow: rolling ? 'none' : `0 0 15px rgba(${pc},.3)`,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
            onMouseEnter={e => {
              if (!rolling && pos < TOTAL - 1) {
                e.currentTarget.style.background = `linear-gradient(90deg, rgba(${pc},.4), rgba(${pc},.6))`;
                e.currentTarget.style.boxShadow = `0 0 25px rgba(${pc},.6)`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (!rolling) {
                e.currentTarget.style.background = `linear-gradient(90deg, rgba(${pc},.2), rgba(${pc},.4))`;
                e.currentTarget.style.boxShadow = `0 0 15px rgba(${pc},.3)`;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            🚀 {rolling ? 'CALCULANDO...' : 'INICIAR SALTO'}
          </button>
        </div>

        {/* Leyenda Espaciosa */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid rgba(${pc},.2)`, borderRadius: 16, padding: '20px' }}>
          <div style={{ fontSize: '0.9rem', letterSpacing: '.15em', color: `rgba(${pc},.8)`, marginBottom: 16, textTransform: 'uppercase', textAlign: 'center', fontWeight: '900' }}>
            MAPA DE SENSORES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div className="text-[13px] whitespace-nowrap" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#cbd5e1', background: 'rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: 8 }}>
              <span style={{ color: planetColor, fontSize: '1.2rem' }}>◈</span> Normal
            </div>
            <div className="text-[13px] whitespace-nowrap" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#cbd5e1', background: 'rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: 8 }}>
              <span style={{ color: '#ffe566', fontSize: '1.2rem' }}>★</span> Especial
            </div>
            <div className="text-[13px] whitespace-nowrap" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#cbd5e1', background: 'rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: 8 }}>
              <span style={{ color: '#ff7850', fontSize: '1.2rem' }}>⚠</span> Trampa
            </div>
            <div className="text-[13px] whitespace-nowrap" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#cbd5e1', background: 'rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: 8 }}>
              <span style={{ color: '#ff4d6d', fontSize: '1.2rem' }}>☠</span> Guardián
            </div>
          </div>
        </div>
      </aside>

      {/* ── BOSS MODAL ── */}
      {showBoss && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.95)' }}>
          <div style={{ textAlign: 'center', width: 360 }}>
            <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 20px' }}>
              <div
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '2px solid transparent', borderTopColor: '#ff4d6d', borderRightColor: '#ff4d6d',
                  boxShadow: '0 0 20px #ff4d6d',
                }}
                className="ob"
              />
              <div
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '2px solid transparent', borderBottomColor: planetColor, borderLeftColor: planetColor,
                }}
                className="ob-r"
              />
              <div
                style={{
                  position: 'absolute', inset: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 70, filter: 'drop-shadow(0 0 20px #ff4d6d) drop-shadow(0 0 40px rgba(255,77,109,.4))',
                }}
                className="tf"
              >
                👾
              </div>
            </div>
            <h2
              style={{
                fontFamily: "'Orbitron',monospace", fontSize: '1.8rem', fontWeight: 900, color: '#ff4d6d',
                letterSpacing: '.15em', textShadow: '0 0 20px #ff4d6d, 0 0 40px rgba(255,77,109,.5)',
                animation: 'bossGlitch 4s infinite',
              }}
            >
              ☠ GUARDIÁN DEL NIVEL ☠
            </h2>
            <div
              style={{
                width: '100%', height: 12, background: 'rgba(255,77,109,.15)',
                border: '1px solid rgba(255,77,109,.4)', borderRadius: 6, margin: '16px 0 20px', overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%', background: 'linear-gradient(90deg, #ff4d6d, #ff8fa3)',
                  borderRadius: 6, width: '100%', animation: 'bossHPPulse 1.5s ease-in-out infinite',
                  boxShadow: '0 0 10px #ff4d6d',
                }}
              />
            </div>
            <p style={{ fontSize: '.7rem', color: 'rgba(255,200,210,.8)', margin: '0 0 24px', lineHeight: 1.7, letterSpacing: '.1em' }}>
              Has llegado al final del camino.<br />
              ¡Enfréntate al Guardián para completar el nivel!
            </p>
            <button
              onClick={startBossBattle}
              style={{
                padding: '14px 40px', border: '2px solid #ff4d6d', background: 'rgba(255,77,109,.1)',
                color: '#ff4d6d', fontFamily: "'Orbitron',monospace", fontSize: '.8rem', letterSpacing: '.2em',
                cursor: 'pointer', borderRadius: 2, textShadow: '0 0 10px #ff4d6d',
                boxShadow: '0 0 20px rgba(255,77,109,.3)', transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,109,.25)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255,77,109,.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,77,109,.1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255,77,109,.3)'; }}
            >
              ⚔ ¡ENFRENTAR!
            </button>
          </div>
        </div>
      )}

      {/* ── WIN OVERLAY ── */}
      {showWin && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,.96)' }}>
          <div style={{ fontSize: 60 }} className="tf">🏆</div>
          <h2
            style={{
              fontFamily: "'Orbitron',monospace", fontSize: '3rem', fontWeight: 900, color: planetColor,
              textShadow: `0 0 24px rgba(${pc},.9)`, letterSpacing: '.2em',
              animation: 'winPulse 1s ease-in-out infinite alternate',
            }}
          >
            ¡VICTORIA!
          </h2>
          <p style={{ fontSize: '.8rem', letterSpacing: '.3em', color: `rgba(${pc},.6)` }}>GUARDIÁN DERROTADO</p>
          <p style={{ fontSize: '.65rem', color: `rgba(${pc},.4)`, letterSpacing: '.2em' }}>NIVEL COMPLETADO</p>
          <button
            onClick={restart}
            style={{
              marginTop: 12, padding: '12px 36px', border: `1.5px solid ${planetColor}`,
              background: 'transparent', color: planetColor, fontFamily: "'Share Tech Mono',monospace",
              fontSize: '.75rem', letterSpacing: '.2em', cursor: 'pointer', borderRadius: 2, transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `rgba(${pc},.1)`; e.currentTarget.style.boxShadow = `0 0 12px rgba(${pc},.6)`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            ↺ JUGAR DE NUEVO
          </button>

          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              marginTop: 8, padding: '10px 36px', border: `1px solid rgba(255,255,255,0.3)`,
              background: 'transparent', color: 'rgba(255,255,255,0.8)', fontFamily: "'Share Tech Mono',monospace",
              fontSize: '.7rem', letterSpacing: '.15em', cursor: 'pointer', borderRadius: 2, transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `rgba(255,255,255,0.1)`; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
          >
            VOLVER AL MAPA ESTELAR
          </button>
        </div>
      )}

      {/* ── QUESTION MODAL ── */}
      {question && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,10,.85)', backdropFilter: 'blur(8px)' }}>
          <div style={{
            width: 500,
            padding: 32,
            borderRadius: 24,
            background: 'rgba(5,15,25,0.9)',
            border: `1px solid ${planetColor}`,
            boxShadow: `0 0 30px rgba(${pc},.3), inset 0 0 20px rgba(${pc},.1)`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Terminal Scanline Effect */}
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)', pointerEvents: 'none' }}></div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, position: 'relative', zIndex: 1 }}>
              <div style={{
                background: `rgba(${pc},.15)`,
                border: `1px solid ${planetColor}`,
                padding: '6px 16px',
                borderRadius: 999,
                color: planetColor,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: `0 0 10px rgba(${pc},.4)`
              }}>
                🛰️ RETO DE CÁLCULO ESTELAR
              </div>
            </div>

            {bossBattleActive && (
              <div style={{ textAlign: 'center', color: '#ff4d6d', marginBottom: 16, fontWeight: '900', letterSpacing: 2, textShadow: '0 0 10px rgba(255,77,109,0.8)', position: 'relative', zIndex: 1 }}>
                ☠ BATALLA CONTRA EL GUARDIÁN (Vida: {bossHp}/3)
              </div>
            )}

            <h3 style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#fff', marginBottom: 30, textAlign: 'center', fontWeight: '800', position: 'relative', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              {question.enunciado}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
              {question.opciones.map((opt, i) => {
                const isSelected = selectedOpt === i;
                const isCorrect = i === question.indiceRespuestaCorrecta;
                let bg = `rgba(255,255,255,0.03)`;
                let border = `1px solid rgba(255,255,255,0.1)`;
                let shadow = 'none';
                let badgeBg = `rgba(${pc},.2)`;
                let badgeColor = planetColor;

                if (qStatus !== 'idle') {
                  if (isCorrect) {
                    bg = 'rgba(0,255,136,.1)';
                    border = '1px solid rgba(0,255,136,.8)';
                    shadow = '0 0 20px rgba(0,255,136,.3)';
                    badgeBg = '#00ff88';
                    badgeColor = '#000';
                  } else if (isSelected && !isCorrect) {
                    bg = 'rgba(255,77,109,.1)';
                    border = '1px solid rgba(255,77,109,.8)';
                    shadow = '0 0 20px rgba(255,77,109,.3)';
                    badgeBg = '#ff4d6d';
                    badgeColor = '#fff';
                  }
                }

                const letter = ['A', 'B', 'C', 'D'][i];

                return (
                  <button
                    key={i}
                    disabled={qStatus !== 'idle'}
                    onClick={() => handleAnswer(i)}
                    style={{
                      padding: '12px 16px', borderRadius: 12, background: bg, border, boxShadow: shadow,
                      color: '#fff', fontSize: '1rem', cursor: qStatus !== 'idle' ? 'default' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', gap: 16
                    }}
                    onMouseEnter={(e) => {
                      if (qStatus === 'idle') {
                        e.currentTarget.style.background = `rgba(${pc},.1)`;
                        e.currentTarget.style.borderColor = planetColor;
                        e.currentTarget.style.boxShadow = `0 0 15px rgba(${pc},.2)`;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (qStatus === 'idle') {
                        e.currentTarget.style.background = bg;
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32,
                      borderRadius: 8, background: badgeBg, color: badgeColor, fontWeight: '900', fontSize: '1.1rem',
                      transition: 'all 0.3s'
                    }}>
                      {letter}
                    </span>
                    <span style={{ fontWeight: '600', letterSpacing: '0.02em' }}>{opt}</span>
                  </button>
                )
              })}
            </div>

            {qStatus === 'correct' && (
              <div style={{ marginTop: 24, textAlign: 'center', color: '#00ff88', fontWeight: '900', fontSize: '1.1rem', textShadow: '0 0 10px rgba(0,255,136,0.6)', position: 'relative', zIndex: 1, animation: 'cellReveal 0.4s ease-out' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 4 }}>¡RESPUESTA CORRECTA! 🚀</span>
                {bossBattleActive ? '¡Impacto crítico al Guardián!' : '¡Genial! Has ganado +1 Estrella ⭐'}
              </div>
            )}

            {qStatus === 'incorrect' && (
              <div style={{ marginTop: 24, textAlign: 'center', color: '#ff4d6d', fontSize: '0.95rem', position: 'relative', zIndex: 1, animation: 'cellReveal 0.4s ease-out' }}>
                <strong style={{ display: 'block', marginBottom: 8, fontSize: '1.2rem', textShadow: '0 0 10px rgba(255,77,109,0.5)', letterSpacing: '0.05em' }}>¡SISTEMA DESCALIBRADO! ⚠️</strong>
                <span style={{ color: '#e2e8f0', display: 'block', marginBottom: 12, lineHeight: 1.5 }}>{question.explicacionBreve}</span>
                <div style={{ color: '#ffaa00', fontWeight: 'bold', padding: '8px 16px', background: 'rgba(255,170,0,0.1)', borderRadius: 8, display: 'inline-block' }}>
                  {bossBattleActive ? 'El Guardián se protege. Prepara el siguiente ataque.' : `Penalización temporal: Tu próximo lanzamiento será de ${penaltyValue === 1 ? '1 casilla' : `${penaltyValue} casillas`}.`}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MINIJUEGO A: SECUENCIA DE PROPULSIÓN ── */}
      {specialSequence.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,10,.85)', backdropFilter: 'blur(8px)' }}>
          <div style={{ width: 560, padding: 36, borderRadius: 24, background: 'rgba(5,15,25,0.95)', border: `2px solid #00f5ff`, boxShadow: `0 0 40px rgba(0,245,255,0.3), inset 0 0 20px rgba(0,245,255,0.1)`, textAlign: 'center' }}>
            <div style={{ color: '#00f5ff', marginBottom: 16, fontWeight: '900', letterSpacing: 2, fontSize: '1.75rem', textShadow: '0 0 15px rgba(0,245,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              🚀 CALIBRACIÓN HIPERESPACIAL
            </div>
            <p style={{ color: '#e2e8f0', marginBottom: 32, fontSize: '1.15rem', lineHeight: '1.6' }}>
              Toca los módulos de energía en orden de <span style={{ background: '#00f5ff', color: '#000', padding: '2px 8px', borderRadius: 6, fontWeight: '900' }}>MENOR a MAYOR</span> para activar el salto.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
              {specialSequence.map((num, i) => {
                const isSelected = specialSelection.includes(num);
                let bg = `rgba(0,245,255,0.1)`;
                let border = `2px solid rgba(0,245,255,0.4)`;
                let color = '#fff';
                let shadow = '0 0 10px rgba(0,245,255,0.2)';
                let content = num.toString();

                if (isSelected) {
                  if (specialStatus === 'incorrect') {
                    bg = 'rgba(255,50,50,.2)';
                    border = '2px solid rgba(255,50,50,.9)';
                    shadow = '0 0 20px rgba(255,50,50,.6)';
                  } else {
                    bg = 'rgba(0,255,136,.2)';
                    border = '2px solid #00ff88';
                    color = '#00ff88';
                    shadow = '0 0 20px rgba(0,255,136,.5)';
                    content = '✓';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={isSelected || specialStatus !== 'idle'}
                    onClick={() => handleSpecialClick(num)}
                    style={{
                      width: 90, height: 90, borderRadius: 16, background: bg, border, color,
                      fontSize: '2rem', fontWeight: '900', cursor: (isSelected || specialStatus !== 'idle') ? 'default' : 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: shadow,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && specialStatus === 'idle') {
                        e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                        e.currentTarget.style.background = 'rgba(0,245,255,0.2)';
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(0,245,255,0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && specialStatus === 'idle') {
                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                        e.currentTarget.style.background = bg;
                        e.currentTarget.style.boxShadow = shadow;
                      }
                    }}
                  >
                    {content}
                  </button>
                )
              })}
            </div>

            <div style={{ minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {specialStatus === 'correct' && (
                <div style={{ color: '#00ff88', fontWeight: '900', fontSize: '1.25rem', animation: 'cellReveal 0.4s ease-out', textShadow: '0 0 15px rgba(0,255,136,0.6)' }}>
                  ¡PROPULSORES ACTIVADOS! +2 ⭐
                </div>
              )}

              {specialStatus === 'incorrect' && (
                <div style={{ color: '#ff4d6d', fontSize: '1.15rem', animation: 'cellReveal 0.4s ease-out' }}>
                  <strong style={{ display: 'block', fontSize: '1.25rem', textShadow: '0 0 10px rgba(255,77,109,0.5)' }}>¡ERROR EN LA SECUENCIA! 💥</strong>
                  <div style={{ color: '#ffaa00', marginTop: 8, fontWeight: 'bold', background: 'rgba(255,170,0,0.1)', padding: '6px 16px', borderRadius: 8, display: 'inline-block' }}>
                    {specialAttempts < 1 ? 'Reiniciando sistema... Intenta de nuevo.' : 'Motor sobrecalentado. Pierdes el turno.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MINIJUEGO B: ESCUDO LÁSER ── */}
      {trapAsteroids.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,5,5,.85)', backdropFilter: 'blur(8px)' }}>
          <div style={{ width: 560, padding: 36, borderRadius: 24, background: 'rgba(25,10,5,0.95)', border: `2px solid #f97316`, boxShadow: `0 0 40px rgba(249,115,22,0.3), inset 0 0 20px rgba(249,115,22,0.1)`, textAlign: 'center' }}>
            <div style={{ color: '#f97316', marginBottom: 16, fontWeight: '900', letterSpacing: 2, fontSize: '1.75rem', textShadow: '0 0 15px rgba(249,115,22,0.6)' }}>
              ⚠️ ALERTA DE IMPACTO
            </div>
            <p style={{ color: '#e2e8f0', marginBottom: 32, fontSize: '1.15rem', lineHeight: '1.6' }}>
              ¡Dispara al asteroide con número <span style={{ background: '#facc15', color: '#000', padding: '2px 8px', borderRadius: 6, fontWeight: '900' }}>PAR</span> para activar el escudo antimateria!
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28 }}>
              {trapAsteroids.map((num, i) => {
                const isSelected = trapSelected === i;
                const isEven = num % 2 === 0;
                let bg = 'radial-gradient(circle at 30% 30%, #475569, #0f172a)';
                let border = '2px solid rgba(255,255,255,0.1)';
                let shadow = 'inset -10px -10px 20px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.5)';
                let transform = 'scale(1)';

                if (trapStatus !== 'idle') {
                  if (isSelected) {
                    if (isEven) {
                      border = '3px solid #00ff88';
                      shadow = '0 0 30px rgba(0,255,136,0.6), inset 0 0 20px rgba(0,255,136,0.4)';
                      bg = 'radial-gradient(circle at 30% 30%, #00ff88, #064e3b)';
                    } else {
                      border = '3px solid #ef4444';
                      shadow = '0 0 30px rgba(239,68,68,0.6), inset 0 0 20px rgba(239,68,68,0.4)';
                      bg = 'radial-gradient(circle at 30% 30%, #ef4444, #7f1d1d)';
                      // simulated shake with transform could be added via keyframes, we just scale down a bit
                      transform = 'scale(0.95)';
                    }
                  } else if (isEven) {
                    // Highlight the correct one if they missed
                    border = '2px solid #00ff88';
                    shadow = '0 0 15px rgba(0,255,136,0.4)';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={trapStatus !== 'idle'}
                    onClick={() => handleTrapClick(i)}
                    style={{
                      width: 110, height: 110, borderRadius: '50%', background: bg, border, boxShadow: shadow,
                      color: '#fff', fontSize: '2.5rem', fontWeight: '900', cursor: trapStatus !== 'idle' ? 'default' : 'crosshair',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform, textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}
                    onMouseEnter={(e) => {
                      if (trapStatus === 'idle') {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = 'inset -10px -10px 20px rgba(0,0,0,0.8), 0 0 25px rgba(249,115,22,0.5)';
                        e.currentTarget.style.borderColor = '#f97316';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (trapStatus === 'idle') {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = shadow;
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      }
                    }}
                  >
                    {num}
                  </button>
                )
              })}
            </div>

            <div style={{ minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {trapStatus === 'correct' && (
                <div style={{ color: '#00ff88', fontWeight: '900', fontSize: '1.25rem', animation: 'cellReveal 0.4s ease-out', textShadow: '0 0 15px rgba(0,255,136,0.6)' }}>
                  ¡ESCUDO DESPLEGADO A TIEMPO! 🛡️
                </div>
              )}

              {trapStatus === 'incorrect' && (
                <div style={{ color: '#ef4444', fontSize: '1.15rem', animation: 'cellReveal 0.4s ease-out' }}>
                  <strong style={{ display: 'block', fontSize: '1.25rem', textShadow: '0 0 10px rgba(239,68,68,0.5)' }}>¡IMPACTO CRÍTICO! 💥</strong>
                  <div style={{ color: '#ffaa00', marginTop: 8, fontWeight: 'bold', background: 'rgba(255,170,0,0.1)', padding: '6px 16px', borderRadius: 8, display: 'inline-block' }}>
                    Penalización: Tu próximo lanzamiento será de {penaltyValue === 1 ? '1 casilla' : `${penaltyValue} casillas`}.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
