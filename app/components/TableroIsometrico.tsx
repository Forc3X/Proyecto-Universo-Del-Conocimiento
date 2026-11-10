'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Dado3D from './Dado3D';
import MapaMontañaCuantica, {
  ESPECIALES_IDX,
  NODOS_NUMERIX,
  TRAMPAS_IDX,
} from './numerix/MapaMontañaCuantica';
import {
  ModalReactorCuantico,
  ModalAlertaImpacto,
  ModalGuardianArmilar,
  type CondicionAsteroide,
} from './numerix/ModalesNumerix';
import {
  getRandomPregunta,
  getRandomRetoBoss,
  type PreguntaMatematica,
  type RetoArmilarBoss,
} from '../../lib/preguntas-numerix';

interface Props {
  planetColor?: string;
  planetGlow?: string;
  onPositionChange?: (pos: number) => void;
}

const TOTAL = 20;

const OPERADORES_NUCLEO: { op: '+' | '−' | '×' | '÷'; nombre: string; color: string; glow: string }[] = [
  { op: '+', nombre: 'Adición', color: '#FBBF24', glow: 'rgba(251, 191, 36, 0.7)' },
  { op: '−', nombre: 'Sustracción', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.7)' },
  { op: '×', nombre: 'Producto', color: '#00F0FF', glow: 'rgba(0, 240, 255, 0.75)' },
  { op: '÷', nombre: 'Cociente', color: '#34D399', glow: 'rgba(52, 211, 153, 0.75)' },
];

const CONDICIONES_TRAMPA: {
  etiqueta: string;
  generar: () => { asteroides: number[]; condicion: CondicionAsteroide };
}[] = [
  {
    etiqueta: 'PAR',
    generar: () => {
      const par = (Math.floor(Math.random() * 40) + 6) * 2; // ej. 68
      const imp1 = (Math.floor(Math.random() * 40) + 5) * 2 + 1; // ej. 29
      let imp2 = (Math.floor(Math.random() * 40) + 5) * 2 + 1;
      if (imp2 === imp1) imp2 += 2;
      const asteroides = [par, imp1, imp2].sort(() => Math.random() - 0.5);
      return {
        asteroides,
        condicion: {
          etiqueta: 'PAR',
          explicacion: `El número ${par} es PAR porque termina en cifra par (${par % 10}) y es divisible exactamente entre 2.`,
          cumple: (n) => n % 2 === 0,
        },
      };
    },
  },
  {
    etiqueta: 'IMPAR',
    generar: () => {
      const impar = (Math.floor(Math.random() * 35) + 5) * 2 + 1;
      const par1 = (Math.floor(Math.random() * 35) + 6) * 2;
      let par2 = (Math.floor(Math.random() * 35) + 6) * 2;
      if (par2 === par1) par2 += 2;
      const asteroides = [impar, par1, par2].sort(() => Math.random() - 0.5);
      return {
        asteroides,
        condicion: {
          etiqueta: 'IMPAR',
          explicacion: `El número ${impar} es IMPAR porque al dividirlo entre 2 sobra 1 (termina en ${impar % 10}).`,
          cumple: (n) => n % 2 !== 0,
        },
      };
    },
  },
  {
    etiqueta: 'MÚLTIPLO DE 5',
    generar: () => {
      const mult5 = (Math.floor(Math.random() * 16) + 3) * 5;
      let n1 = mult5 + 2;
      let n2 = mult5 + 3;
      const asteroides = [mult5, n1, n2].sort(() => Math.random() - 0.5);
      return {
        asteroides,
        condicion: {
          etiqueta: 'MÚLTIPLO DE 5',
          explicacion: `El número ${mult5} es múltiplo de 5 porque termina en 0 o en 5.`,
          cumple: (n) => n % 5 === 0,
        },
      };
    },
  },
];

/** Cápsula Tecnológica Vertical para los 4 Núcleos Cuánticos (+, −, ×, ÷) del HUD (fiel a Imagen 1). */
function CapsulaNucleo({
  operador,
  activo,
  color,
  glow,
}: {
  operador: string;
  activo: boolean;
  color: string;
  glow: string;
}) {
  return (
    <motion.div
      animate={activo ? { scale: [1, 1.07, 1] } : undefined}
      className="relative h-[78px] rounded-full p-1 flex flex-col items-center justify-between transition-all"
      style={{
        background: activo
          ? 'linear-gradient(180deg, #163C63 0%, #091D34 50%, #123254 100%)'
          : 'linear-gradient(180deg, #0B1B2E 0%, #06101E 100%)',
        border: activo ? `2px solid ${color}` : '1.5px solid #1E3A5F',
        boxShadow: activo ? `0 0 16px ${glow}, inset 0 0 10px ${glow}` : 'inset 0 2px 6px rgba(0,0,0,0.6)',
      }}
    >
      {/* Tapa metálica superior */}
      <div
        className="w-7 h-2.5 rounded-t-full border-b"
        style={{
          background: activo ? color : '#1E293B',
          borderColor: activo ? '#FFFFFF' : '#334155',
          opacity: activo ? 0.9 : 0.45,
        }}
      />

      {/* Ventana central con el operador en cubo isométrico */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg transition-all"
        style={{
          background: activo
            ? `radial-gradient(circle, ${color}33 0%, rgba(8,47,73,0.9) 100%)`
            : 'rgba(15, 23, 42, 0.7)',
          border: activo ? `1.5px solid ${color}` : '1px solid #334155',
          color: activo ? color : '#475569',
          textShadow: activo ? `0 0 8px ${color}` : 'none',
        }}
      >
        {activo ? operador : '?'}
      </div>

      {/* Tapa metálica inferior */}
      <div
        className="w-7 h-2.5 rounded-b-full border-t"
        style={{
          background: activo ? color : '#1E293B',
          borderColor: activo ? '#FFFFFF' : '#334155',
          opacity: activo ? 0.9 : 0.45,
        }}
      />
    </motion.div>
  );
}

export default function TableroIsometrico({ onPositionChange }: Props) {
  const router = useRouter();

  /* ── Posición en el recorrido lineal de 20 cubos (0..19 = Casilla 01..20) ── */
  const [pos, setPos] = useState(0);
  const [caminando, setCaminando] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(1);
  const [stars, setStars] = useState(0);

  /* ── 4 Núcleos Cuánticos (+, −, ×, ÷) ── */
  const [collectedCores, setCollectedCores] = useState<[boolean, boolean, boolean, boolean]>([
    false,
    false,
    false,
    false,
  ]);

  /* ── Mensaje dinámico de la píldora inferior ── */
  const [avisoFlotante, setAvisoFlotante] = useState(
    '¡Lanza el dado cuántico para avanzar por los cubos de Numérix!',
  );

  /* ── Estado de Pregunta Matemática (Cámara de Cálculo Cuántico) ── */
  const [question, setQuestion] = useState<PreguntaMatematica | null>(null);
  const [qStatus, setQStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const usadasRef = useRef<Set<number>>(new Set());

  /* ── Estado de Minijuego A: Secuencia de Propulsión (Casillas Especiales 04, 08, 12, 16) ── */
  const [specialSequence, setSpecialSequence] = useState<number[]>([]);
  const [specialSelection, setSpecialSelection] = useState<number[]>([]);
  const [specialStatus, setSpecialStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  /* ── Estado de Minijuego B: Alerta de Impacto / Escudo Antimateria (Casillas Trampa 06, 10, 14) ── */
  const [trapAsteroids, setTrapAsteroids] = useState<number[]>([]);
  const [trapCondition, setTrapCondition] = useState<CondicionAsteroide | null>(null);
  const [trapStatus, setTrapStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [trapSelected, setTrapSelected] = useState<number | null>(null);

  /* ── Estado del Guardián del Nivel: Núcleo Armilar (Casilla 20) ── */
  const [bossBattleActive, setBossBattleActive] = useState(false);
  const [bossPhase, setBossPhase] = useState<1 | 2 | 3>(1);
  const [bossReto, setBossReto] = useState<RetoArmilarBoss>(() => getRandomRetoBoss());
  const [bossSelectedOpt, setBossSelectedOpt] = useState<number | null>(null);
  const [bossStatus, setBossStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const usadosBossRef = useRef<Set<string>>(new Set());

  /* ── Modal de Fórmulas y Guía + Victoria ── */
  const [mostrarGuia, setMostrarGuia] = useState(false);
  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    onPositionChange?.(pos);
  }, [pos, onPositionChange]);

  const nucleosActivosCount = useMemo(
    () => collectedCores.filter(Boolean).length,
    [collectedCores],
  );
  const llaveLista = nucleosActivosCount === 4;
  const progresoPct = Math.round((pos / (TOTAL - 1)) * 100);

  const modalAbierto =
    question !== null ||
    specialSequence.length > 0 ||
    trapAsteroids.length > 0 ||
    bossBattleActive ||
    showWin;

  /* ── Otorgar Núcleo Cuántico correspondiente según el avance ── */
  const desbloquearNucleoPorPosicion = useCallback((indiceCasilla: number) => {
    setCollectedCores((prev) => {
      const nuevo: [boolean, boolean, boolean, boolean] = [...prev];
      // Hitos en casillas 4 (idx 3), 8 (idx 7), 12 (idx 11), 16 (idx 15)
      if (indiceCasilla >= 3 && !nuevo[0]) nuevo[0] = true;
      else if (indiceCasilla >= 7 && !nuevo[1]) nuevo[1] = true;
      else if (indiceCasilla >= 11 && !nuevo[2]) nuevo[2] = true;
      else if (indiceCasilla >= 15 && !nuevo[3]) nuevo[3] = true;
      return nuevo;
    });
  }, []);

  /* ── Caminar paso a paso por los cubos ── */
  const moverPasoAPaso = useCallback(
    (desde: number, hasta: number, alTerminar: (posFinal: number) => void) => {
      if (desde === hasta) {
        alTerminar(hasta);
        return;
      }
      setCaminando(true);
      const dir = hasta > desde ? 1 : -1;
      let actual = desde;

      const iv = setInterval(() => {
        actual += dir;
        setPos(actual);
        if (actual === hasta) {
          clearInterval(iv);
          setCaminando(false);
          alTerminar(actual);
        }
      }, 290);
    },
    [],
  );

  /* ── Iniciar Minijuego A: Reactor de Propulsión Cuántica (Secuencia) ── */
  const startSpecialMinigame = useCallback(() => {
    // Generar una serie clara de 4 números de 2 cifras (p. ej. múltiplos de 12, 15, 11 o decenas)
    const pasosPosibles = [6, 8, 9, 11, 12, 14, 15];
    const paso = pasosPosibles[Math.floor(Math.random() * pasosPosibles.length)];
    const base = Math.floor(Math.random() * 3 + 1) * paso;
    const ordenada = [base, base + paso, base + paso * 2, base + paso * 3];
    let desordenada = [...ordenada].sort(() => Math.random() - 0.5);
    if (desordenada.every((n, i) => n === ordenada[i])) {
      desordenada = [ordenada[2], ordenada[0], ordenada[3], ordenada[1]];
    }
    setSpecialSequence(desordenada);
    setSpecialSelection([]);
    setSpecialStatus('idle');
    setAvisoFlotante('¡Casilla Especial! Ordena los 4 cubos cuánticos de menor a mayor en el reactor.');
  }, []);

  /* ── Iniciar Minijuego B: Alerta de Impacto — Escudo Antimateria ── */
  const startTrapMinigame = useCallback(() => {
    const generador = CONDICIONES_TRAMPA[Math.floor(Math.random() * CONDICIONES_TRAMPA.length)];
    const { asteroides, condicion } = generador.generar();
    setTrapAsteroids(asteroides);
    setTrapCondition(condicion);
    setTrapSelected(null);
    setTrapStatus('idle');
    setAvisoFlotante(`¡Alerta de impacto! Dispara al asteroide con número ${condicion.etiqueta}.`);
  }, []);

  /* ── Iniciar Duelo del Guardián Armilar en la Casilla 20 ── */
  const startBossBattle = useCallback(() => {
    setCollectedCores([true, true, true, true]);
    const primerReto = getRandomRetoBoss(usadosBossRef.current);
    usadosBossRef.current.add(primerReto.id);
    setBossReto(primerReto);
    setBossPhase(1);
    setBossSelectedOpt(null);
    setBossStatus('idle');
    setBossBattleActive(true);
    setAvisoFlotante('¡Has llegado a la cima! Alinea los 3 anillos de la Esfera Armilar Dorada.');
  }, []);

  /* ── Activar evento de la casilla donde aterriza el astronauta ── */
  const activarEventoCasilla = useCallback(
    (indiceDestino: number) => {
      if (indiceDestino >= TOTAL - 1) {
        setTimeout(() => startBossBattle(), 380);
      } else if (ESPECIALES_IDX.includes(indiceDestino)) {
        setTimeout(() => startSpecialMinigame(), 380);
      } else if (TRAMPAS_IDX.includes(indiceDestino)) {
        setTimeout(() => startTrapMinigame(), 380);
      } else {
        setTimeout(() => {
          const preg = getRandomPregunta(usadasRef.current);
          usadasRef.current.add(preg.id);
          setQuestion(preg);
          setQStatus('idle');
          setSelectedOpt(null);
          setAvisoFlotante(`Casilla ${String(indiceDestino + 1).padStart(2, '0')}: Resuelve el cálculo cuántico.`);
        }, 380);
      }
    },
    [startBossBattle, startSpecialMinigame, startTrapMinigame],
  );

  /* ── Lanzar el Dado 3D Cuántico ── */
  const handleIniciarSalto = useCallback(() => {
    if (rolling || caminando || modalAbierto) return;
    if (pos >= TOTAL - 1) {
      startBossBattle();
      return;
    }
    const resultado = Math.floor(Math.random() * 6) + 1;
    setDiceResult(resultado);
    setRolling(true);
    setAvisoFlotante('Calculando vector de salto cuántico...');
  }, [rolling, caminando, modalAbierto, pos, startBossBattle]);

  const handleRollComplete = useCallback(() => {
    setRolling(false);
    const destino = Math.min(TOTAL - 1, pos + diceResult);
    setAvisoFlotante(`¡Salto cuántico de +${diceResult} ${diceResult === 1 ? 'cubo' : 'cubos'}!`);
    moverPasoAPaso(pos, destino, (posFinal) => {
      activarEventoCasilla(posFinal);
    });
  }, [pos, diceResult, moverPasoAPaso, activarEventoCasilla]);

  /* ── Interacción en Tarjeta 1 (Modo Secuencia de Propulsión) ── */
  const handleToggleNumeroSecuencia = useCallback(
    (num: number) => {
      if (specialStatus !== 'idle') return;
      setSpecialSelection((prev) =>
        prev.includes(num) ? prev.filter((n) => n !== num) : prev.length < 4 ? [...prev, num] : prev,
      );
    },
    [specialStatus],
  );

  const handleConfirmarSecuencia = useCallback(() => {
    if (specialStatus !== 'idle') {
      const fueCorrecto = specialStatus === 'correct';
      setSpecialSequence([]);
      setSpecialSelection([]);
      setSpecialStatus('idle');
      if (fueCorrecto) {
        const destinoImpulso = Math.min(TOTAL - 1, pos + 2);
        setAvisoFlotante('¡Propulsión activada! Avanzas +2 cubos adicionales.');
        moverPasoAPaso(pos, destinoImpulso, (posFinal) => {
          desbloquearNucleoPorPosicion(posFinal);
          if (posFinal >= TOTAL - 1) {
            setTimeout(() => startBossBattle(), 400);
          }
        });
      }
      return;
    }

    if (specialSelection.length < 4) {
      setAvisoFlotante('Encaja los 4 cubos cuánticos en las ranuras del reactor antes de activar.');
      return;
    }

    const ordenada = [...specialSequence].sort((a, b) => a - b);
    const esCorrecta = specialSelection.every((val, i) => val === ordenada[i]);
    if (esCorrecta) {
      setSpecialStatus('correct');
      setStars((s) => s + 2);
      desbloquearNucleoPorPosicion(pos);
    } else {
      setSpecialStatus('incorrect');
    }
  }, [
    specialStatus,
    specialSelection,
    specialSequence,
    pos,
    moverPasoAPaso,
    desbloquearNucleoPorPosicion,
    startBossBattle,
  ]);

  /* ── Interacción en Tarjeta 1 (Modo Pregunta Matemática) ── */
  const handleConfirmarPregunta = useCallback(() => {
    if (!question) return;
    if (qStatus !== 'idle') {
      setQuestion(null);
      setQStatus('idle');
      setSelectedOpt(null);
      return;
    }
    if (selectedOpt === null) return;

    if (selectedOpt === question.indiceRespuestaCorrecta) {
      setQStatus('correct');
      setStars((s) => s + 1);
      desbloquearNucleoPorPosicion(pos);
      setAvisoFlotante('¡Cálculo verificado! Ganaste +1 Estrella Cuántica.');
    } else {
      setQStatus('incorrect');
      setAvisoFlotante('Revisa la explicación del reactor y prepárate para el próximo salto.');
    }
  }, [question, qStatus, selectedOpt, pos, desbloquearNucleoPorPosicion]);

  /* ── Interacción en Tarjeta 2 (Alerta de Impacto — Escudo Antimateria) ── */
  const handleDispararAsteroide = useCallback(
    (idx: number) => {
      if (trapStatus !== 'idle' || !trapCondition) return;
      setTrapSelected(idx);
      const numero = trapAsteroids[idx];
      if (trapCondition.cumple(numero)) {
        setTrapStatus('correct');
        setStars((s) => s + 1);
        desbloquearNucleoPorPosicion(pos);
      } else {
        setTrapStatus('incorrect');
      }
    },
    [trapStatus, trapCondition, trapAsteroids, pos, desbloquearNucleoPorPosicion],
  );

  const handleCerrarAlertaImpacto = useCallback(() => {
    const fallo = trapStatus === 'incorrect';
    setTrapAsteroids([]);
    setTrapCondition(null);
    setTrapSelected(null);
    setTrapStatus('idle');

    if (fallo) {
      const destinoRetroceso = Math.max(0, pos - 2);
      setAvisoFlotante('El impacto del asteroide te hizo retroceder 2 casillas.');
      moverPasoAPaso(pos, destinoRetroceso, () => {});
    } else {
      setAvisoFlotante('¡Escudo antimateria intacto! Lanza el dado para continuar.');
    }
  }, [trapStatus, pos, moverPasoAPaso]);

  /* ── Interacción en Tarjeta 3 (Guardián del Nivel — Núcleo Armilar) ── */
  const handleAlinearAnillo = useCallback(() => {
    if (bossStatus === 'correct') {
      if (bossPhase < 3) {
        const siguienteReto = getRandomRetoBoss(usadosBossRef.current);
        usadosBossRef.current.add(siguienteReto.id);
        setBossReto(siguienteReto);
        setBossPhase((f) => (f + 1) as 1 | 2 | 3);
        setBossSelectedOpt(null);
        setBossStatus('idle');
      } else {
        setBossBattleActive(false);
        setStars((s) => s + 3);
        setShowWin(true);
        setAvisoFlotante('¡Núcleo Armilar de Numérix restaurado al 100%!');
      }
      return;
    }

    if (bossStatus === 'incorrect') {
      // Si el jugador se equivoca en el desafío final, cambiamos la pregunta por otra nueva y barajada
      const nuevoReto = getRandomRetoBoss(usadosBossRef.current);
      usadosBossRef.current.add(nuevoReto.id);
      setBossReto(nuevoReto);
      setBossSelectedOpt(null);
      setBossStatus('idle');
      return;
    }

    if (bossSelectedOpt === null) return;
    if (bossSelectedOpt === bossReto.indiceCorrecto) {
      setBossStatus('correct');
    } else {
      setBossStatus('incorrect');
    }
  }, [bossStatus, bossPhase, bossSelectedOpt, bossReto]);

  /* ── Reiniciar partida ── */
  const handleRestart = useCallback(() => {
    setPos(0);
    setStars(0);
    setCollectedCores([false, false, false, false]);
    setQuestion(null);
    setSpecialSequence([]);
    setTrapAsteroids([]);
    setBossBattleActive(false);
    setShowWin(false);
    usadasRef.current.clear();
    usadosBossRef.current.clear();
    setAvisoFlotante('¡Nueva misión en Numérix! Lanza el dado cuántico para avanzar.');
  }, []);

  return (
    <div
      className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #071326 0%, #0C213B 55%, #08182E 100%)',
      }}
    >
      {/* ════════════════════ ESCENARIO PRINCIPAL: MONTAÑA CUÁNTICA (IZQUIERDA / CENTRO) ════════════════════ */}
      <div className="relative flex-1 h-[62vh] lg:h-full overflow-hidden flex items-center justify-center">
        {/* ── Arriba a la Izquierda: Botón Cápsula "← Mapa" ── */}
        <div className="absolute top-3 left-3 z-30 flex items-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/planeta/1')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm text-[#E0F2FE] shadow-lg cursor-pointer"
            style={{
              background: 'linear-gradient(180deg, #123258 0%, #0A1E38 100%)',
              border: '2px solid #38BDF8',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.35)',
            }}
          >
            <span>←</span>
            <span>Mapa</span>
          </motion.button>
        </div>

        {/* ── Arriba al Centro: Banderín Trapezoidal "◀ SALTO CUÁNTICO ▶" (Fiel a Imagen 1) ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-start pointer-events-none">
          {/* Ala tecnológica izquierda */}
          <div
            className="hidden sm:flex h-9 w-11 items-center justify-center rounded-bl-xl border-b-2 border-l-2 border-[#00F0FF]"
            style={{
              background: 'linear-gradient(180deg, #102C4E 0%, #091A32 100%)',
              transform: 'skewX(20deg)',
            }}
          >
            <span className="text-[11px] text-[#FBBF24]" style={{ transform: 'skewX(-20deg)' }}>
              ◀
            </span>
          </div>

          {/* Placa central dorada/ámbar biselada */}
          <div
            className="px-6 sm:px-9 py-1.5 rounded-b-2xl border-x-2 border-b-2 border-[#FEF08A] shadow-[0_6px_24px_rgba(245,158,11,0.45)] flex items-center gap-2"
            style={{
              background: 'linear-gradient(180deg, #FDE68A 0%, #F59E0B 55%, #B45309 100%)',
            }}
          >
            <span
              className="text-xs sm:text-sm font-black tracking-[0.18em] text-[#0F172A] uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              SALTO CUÁNTICO
            </span>
          </div>

          {/* Ala tecnológica derecha */}
          <div
            className="hidden sm:flex h-9 w-11 items-center justify-center rounded-br-xl border-b-2 border-r-2 border-[#00F0FF]"
            style={{
              background: 'linear-gradient(180deg, #102C4E 0%, #091A32 100%)',
              transform: 'skewX(-20deg)',
            }}
          >
            <span className="text-[11px] text-[#FBBF24]" style={{ transform: 'skewX(20deg)' }}>
              ▶
            </span>
          </div>
        </div>

        {/* ── Lienzo SVG de la Montaña Planetaria y los 20 Cubos Isométricos ── */}
        <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
          <MapaMontañaCuantica
            pos={pos}
            caminando={caminando}
            santuarioDesbloqueado={llaveLista}
          />
        </div>

        {/* ── Abajo al Centro: Píldora Flotante de Instrucciones (Fiel a Imagen 1) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={avisoFlotante}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-[92%] sm:max-w-lg px-5 py-2 rounded-full bg-[#091D36]/92 border-2 border-[#00E5FF]/80 backdrop-blur-md shadow-[0_0_24px_rgba(0,229,255,0.3)] flex items-center gap-2 text-xs sm:text-sm font-bold text-[#E0F2FE] text-center"
          >
            <span className="text-[#00F0FF]">✦</span>
            <span>{avisoFlotante}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ════════════════════ HUD LATERAL DERECHO (MISMO TAMAÑO Y MÓDULOS QUE LETRALIA, FIEL A IMAGEN 1) ════════════════════ */}
      <aside className="relative z-30 w-full lg:w-[330px] xl:w-[350px] lg:h-full p-2 sm:p-3 flex flex-col justify-center shrink-0">
        <div
          className="relative w-full h-full max-h-[820px] rounded-[28px] p-3.5 sm:p-4 flex flex-col justify-between overflow-y-auto"
          style={{
            background: 'linear-gradient(180deg, rgba(13, 35, 64, 0.94) 0%, rgba(8, 22, 42, 0.96) 100%)',
            border: '2.5px solid #00E5FF',
            boxShadow:
              'inset 0 0 25px rgba(0, 229, 255, 0.18), 0 0 35px rgba(0, 229, 255, 0.25)',
          }}
        >
          {/* ── 1. CABECERA: NUMÉRIX — TABLERO CUÁNTICO ── */}
          <div className="text-center pt-0.5 pb-2.5 border-b border-[#00E5FF]/40">
            <h1
              className="text-2xl sm:text-3xl font-black tracking-wider leading-none select-none"
              style={{
                color: '#0E3A5F',
                WebkitTextStroke: '1.8px #00F0FF',
                textShadow: '0 0 18px rgba(0, 240, 255, 0.65)',
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              NUMÉRIX
            </h1>
            <p className="mt-1.5 text-[11px] font-extrabold tracking-[0.22em] text-[#BAE6FD] uppercase">
              TABLERO CUÁNTICO
            </p>
          </div>

          {/* ── 2. CAJA DEL DADO 3D CUÁNTICO HOLOGRÁFICO ── */}
          <div
            className="relative my-2 py-4 rounded-2xl flex flex-col items-center justify-center overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, #103A60 0%, #081F38 65%, #051324 100%)',
              border: '2px solid rgba(0, 240, 255, 0.55)',
              boxShadow: 'inset 0 0 30px rgba(0, 240, 255, 0.25)',
            }}
          >
            {/* Destellos en las esquinas de la cámara del dado */}
            <span className="pointer-events-none absolute top-2 left-3 text-[#00F0FF] text-sm">✦</span>
            <span className="pointer-events-none absolute bottom-2 right-3 text-[#00F0FF] text-sm">✦</span>

            {/* Plataforma energética bajo el dado */}
            <div
              className="pointer-events-none absolute bottom-2 w-28 h-5 rounded-full opacity-65"
              style={{
                background: 'radial-gradient(ellipse, #00F0FF 0%, transparent 75%)',
              }}
            />

            <div
              onClick={handleIniciarSalto}
              className={
                rolling || caminando || modalAbierto
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer hover:scale-105 transition-transform'
              }
              title="Haz clic para iniciar el salto cuántico"
            >
              <Dado3D
                size={88}
                rolling={rolling}
                result={diceResult}
                onRollComplete={handleRollComplete}
                faceColor="#083344"
                borderColor="#00F0FF"
                pipColor="#67E8F9"
              />
            </div>
          </div>

          {/* ── 3. PANEL DE TELEMETRÍA: PROGRESO + 4 NÚCLEOS CUÁNTICOS + LLAVE DEL GUARDIÁN ── */}
          <div
            className="relative rounded-2xl p-3 sm:p-3.5 my-1"
            style={{
              background: 'linear-gradient(180deg, #0D2644 0%, #081A30 100%)',
              border: '1.5px solid rgba(0, 229, 255, 0.45)',
            }}
          >
            {/* Barra de Progreso (0% a 100% — Casilla X/20) */}
            <div className="mb-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black tracking-wider text-[#BAE6FD] uppercase">
                  PROGRESO
                </span>
                <span className="text-xs font-black text-[#00F0FF]">
                  {progresoPct}% ({pos + 1}/{TOTAL})
                </span>
              </div>

              <div className="relative h-5 rounded-full bg-[#051324] border-2 border-[#00E5FF]/60 p-0.5 shadow-inner">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: '5%' }}
                  animate={{ width: `${Math.max(6, progresoPct)}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    background: 'linear-gradient(90deg, #0284C7 0%, #00F0FF 65%, #6EE7B7 100%)',
                    boxShadow: '0 0 12px #00F0FF',
                  }}
                />
                {/* 3 Hitos de estrellas a lo largo de la barra */}
                {[32, 66, 95].map((pct, idx) => {
                  const alcanzada = progresoPct >= pct;
                  return (
                    <span
                      key={idx}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{
                        left: `${pct}%`,
                        background: alcanzada ? '#FBBF24' : '#0B223D',
                        color: alcanzada ? '#0F172A' : '#38BDF8',
                        border: alcanzada ? '1.5px solid #FEF08A' : '1.5px solid #00E5FF',
                        boxShadow: alcanzada ? '0 0 10px #FBBF24' : 'none',
                      }}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Núcleos Cuánticos (0/4 Cristales — 4 Cápsulas Verticales +, −, ×, ÷) */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black tracking-wider text-[#BAE6FD] uppercase">
                  NÚCLEOS CUÁNTICOS
                </span>
                <span className="text-[10px] font-extrabold text-[#00F0FF] bg-[#06182C] px-2.5 py-0.5 rounded-full border border-[#00E5FF]/50">
                  {nucleosActivosCount}/4 Cristales
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {OPERADORES_NUCLEO.map((item, idx) => (
                  <CapsulaNucleo
                    key={item.op}
                    operador={item.op}
                    activo={collectedCores[idx]}
                    color={item.color}
                    glow={item.glow}
                  />
                ))}
              </div>

              {/* Recuadro de Estado: LLAVE DEL GUARDIÁN */}
              <div
                className="mt-3 rounded-xl px-3 py-2.5 flex items-center justify-between border transition-all"
                style={{
                  background: llaveLista
                    ? 'linear-gradient(90deg, rgba(16,185,129,0.22) 0%, rgba(0,240,255,0.22) 100%)'
                    : 'rgba(6, 18, 34, 0.85)',
                  borderColor: llaveLista ? '#00F0FF' : 'rgba(56, 189, 248, 0.35)',
                  boxShadow: llaveLista ? '0 0 16px rgba(0, 240, 255, 0.35)' : 'none',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{llaveLista ? '🗝️' : '🔒'}</span>
                  <div className="leading-tight">
                    <p className="text-[11px] font-black uppercase tracking-wider text-white">
                      LLAVE DEL GUARDIÁN
                    </p>
                    <p className="text-[11px] font-semibold text-cyan-200/80">
                      {llaveLista
                        ? '¡4 núcleos listos para el Núcleo Armilar!'
                        : 'Reúne los 4 núcleos en el camino'}
                    </p>
                  </div>
                </div>
                {stars > 0 && (
                  <span className="text-xs font-black text-amber-300 bg-amber-400/15 border border-amber-300/40 px-2 py-0.5 rounded-full">
                    ⭐ {stars}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── 4. DOS BOTONES GRANDES INFERIORES (INICIAR SALTO y FÓRMULAS Y GUÍA) ── */}
          <div className="flex flex-col gap-2.5 mt-2">
            <motion.button
              type="button"
              whileHover={rolling || caminando || modalAbierto ? undefined : { scale: 1.02, y: -1 }}
              whileTap={rolling || caminando || modalAbierto ? undefined : { scale: 0.97 }}
              onClick={handleIniciarSalto}
              disabled={rolling || caminando || modalAbierto}
              className="w-full py-3 rounded-2xl font-black text-sm sm:text-base tracking-widest uppercase transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(180deg, #FEF08A 0%, #F59E0B 55%, #B45309 100%)',
                border: '2px solid #FEF9C3',
                boxShadow: '0 4px 0 #78350F, 0 0 20px rgba(245, 158, 11, 0.4)',
                color: '#0F172A',
              }}
            >
              <span>🎲</span>
              <span>
                {rolling
                  ? 'CALCULANDO...'
                  : caminando
                    ? 'SALTANDO...'
                    : 'INICIAR SALTO'}
              </span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMostrarGuia(true)}
              className="w-full py-2.5 rounded-2xl font-black text-xs sm:text-sm tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(180deg, #10365C 0%, #081E36 100%)',
                border: '2px solid #00E5FF',
                boxShadow: '0 4px 0 #061527, 0 0 14px rgba(0, 229, 255, 0.25)',
                color: '#E0F2FE',
              }}
            >
              <span>📐</span>
              <span>FÓRMULAS Y GUÍA</span>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* ════════════════════ MODALES DE LAS MECÁNICAS DE NUMÉRIX ════════════════════ */}

      {/* Tarjeta 1A: Reactor de Propulsión Cuántica (Secuencia en Casillas Especiales) */}
      <AnimatePresence>
        {specialSequence.length > 0 && (
          <ModalReactorCuantico
            modo="secuencia"
            estrellas={stars}
            nucleosActivos={nucleosActivosCount}
            secuencia={specialSequence}
            seleccionSecuencia={specialSelection}
            estadoSecuencia={specialStatus}
            onToggleNumeroSecuencia={handleToggleNumeroSecuencia}
            onConfirmarSecuencia={handleConfirmarSecuencia}
          />
        )}
      </AnimatePresence>

      {/* Tarjeta 1B: Cámara de Cálculo Cuántico (Pregunta Matemática en Casillas Normales) */}
      <AnimatePresence>
        {question && !bossBattleActive && (
          <ModalReactorCuantico
            modo="pregunta"
            estrellas={stars}
            nucleosActivos={nucleosActivosCount}
            pregunta={question}
            opcionSeleccionada={selectedOpt}
            estadoPregunta={qStatus}
            onSeleccionarOpcion={setSelectedOpt}
            onConfirmarPregunta={handleConfirmarPregunta}
          />
        )}
      </AnimatePresence>

      {/* Tarjeta 2: Alerta de Impacto — Escudo Antimateria (Casillas Trampa) */}
      <AnimatePresence>
        {trapAsteroids.length > 0 && trapCondition && (
          <ModalAlertaImpacto
            asteroides={trapAsteroids}
            condicion={trapCondition}
            seleccionadoIdx={trapSelected}
            estado={trapStatus}
            onDisparar={handleDispararAsteroide}
            onCerrar={handleCerrarAlertaImpacto}
          />
        )}
      </AnimatePresence>

      {/* Tarjeta 3: Guardián del Nivel — Núcleo Armilar (Duelo Final en Casilla 20) */}
      <AnimatePresence>
        {bossBattleActive && (
          <ModalGuardianArmilar
            reto={bossReto}
            faseActual={bossPhase}
            nucleos={collectedCores}
            estrellas={stars}
            opcionElegida={bossSelectedOpt}
            estado={bossStatus}
            onElegirOpcion={setBossSelectedOpt}
            onAlinearAnillo={handleAlinearAnillo}
          />
        )}
      </AnimatePresence>

      {/* Modal de Fórmulas y Guía Cuántica */}
      <AnimatePresence>
        {mostrarGuia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[115] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setMostrarGuia(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl p-6 bg-[#0B213D] border-2 border-[#00F0FF] text-[#E0F2FE] shadow-[0_0_50px_rgba(0,240,255,0.3)]"
            >
              <div className="flex items-center justify-between border-b border-[#00E5FF]/30 pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-black tracking-wider text-[#00F0FF]">
                  📐 Manual Cuántico de Numérix
                </h3>
                <button
                  type="button"
                  onClick={() => setMostrarGuia(false)}
                  className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 font-black text-cyan-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-[#071629] border border-cyan-400/40">
                  <p className="font-black text-cyan-300 mb-0.5">◈ Cubos de Cristal Cian (Cálculo):</p>
                  <p className="text-slate-200">
                    Activan la <strong>Cámara de Cálculo Cuántico</strong> con retos de suma, resta,
                    multiplicación y división exacta.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#071629] border border-amber-400/50">
                  <p className="font-black text-amber-300 mb-0.5">
                    ★ Cubos Dorados (Casillas 04, 08, 12 y 16 — Propulsión):
                  </p>
                  <p className="text-slate-200">
                    Ordena los 4 cubos de menor a mayor en el <strong>Reactor de Propulsión</strong>{' '}
                    para avanzar <strong>+2 casillas</strong> y encender uno de los{' '}
                    <strong>4 Núcleos Cuánticos</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#071629] border border-rose-400/50">
                  <p className="font-black text-rose-300 mb-0.5">
                    ⚠️ Cubos Coral (Casillas 06, 10 y 14 — Alerta de Impacto):
                  </p>
                  <p className="text-slate-200">
                    Dispara con el cañón al asteroide que cumpla la condición (Par, Impar o Múltiplo)
                    para activar el escudo y evitar retroceder 2 casillas.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#071629] border border-emerald-400/50">
                  <p className="font-black text-emerald-300 mb-0.5">
                    🌐 Cima Casilla 20 (Guardián del Nivel — Núcleo Armilar):
                  </p>
                  <p className="text-slate-200">
                    Resuelve las 3 fases para alinear los 3 anillos de la Esfera Armilar Dorada.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setMostrarGuia(false)}
                  className="px-6 py-2 rounded-xl bg-gradient-to-b from-[#FEF08A] to-[#F59E0B] text-[#0F172A] font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pantalla de Victoria Cuántica */}
      <AnimatePresence>
        {showWin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.86, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg rounded-[32px] p-6 sm:p-8 text-center bg-[#0B213D] border-3 border-[#00F0FF] text-white shadow-[0_0_80px_rgba(0,240,255,0.4)]"
            >
              <div className="flex justify-center gap-3 mb-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -25 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15 + i * 0.15, type: 'spring', stiffness: 300 }}
                    className="text-4xl sm:text-5xl drop-shadow-[0_0_14px_rgba(251,191,36,0.8)]"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-300 text-xs font-black uppercase tracking-widest text-cyan-200 mb-2">
                ¡Núcleo Armilar Restaurado!
              </span>

              <h2
                className="text-2xl sm:text-3xl font-black text-[#FEF08A] mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                ¡VICTORIA EN NUMÉRIX!
              </h2>
              <p className="text-sm sm:text-base text-cyan-100/85 mb-5">
                Alineaste los 3 anillos de la Esfera Armilar Dorada y activaste los 4 Núcleos
                Cuánticos de la montaña. Estrellas acumuladas: <strong>⭐ {stars}</strong>.
              </p>

              <div className="flex justify-center gap-3 mb-6">
                {OPERADORES_NUCLEO.map((n) => (
                  <span
                    key={n.op}
                    className="w-12 h-12 rounded-2xl bg-[#071629] border-2 border-[#FBBF24] flex items-center justify-center font-black text-xl text-[#FEF08A] shadow-[0_0_15px_rgba(251,191,36,0.45)]"
                  >
                    {n.op}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-b from-[#FEF08A] to-[#F59E0B] border-2 border-white text-[#0F172A] shadow-lg cursor-pointer"
                >
                  🔄 Jugar de Nuevo
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/planeta/1')}
                  className="px-6 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-b from-[#12365E] to-[#091E38] border-2 border-[#00F0FF] text-[#E0F2FE] shadow-lg cursor-pointer"
                >
                  ← Volver a Numérix
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
