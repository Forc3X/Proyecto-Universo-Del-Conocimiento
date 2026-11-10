'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  barajar,
  validarPuente,
  type RetoIntruso,
  type RetoPuenteSintactico,
  type RetoTormenta,
  type RetoGuardianBoss,
} from '../../../lib/preguntas-letralia';

export type ModalRetoActivo =
  | { tipo: 'intruso'; reto: RetoIntruso; otorgaSilaba?: string | null }
  | { tipo: 'puente'; reto: RetoPuenteSintactico; esPortal?: boolean; otorgaSilaba?: string | null }
  | { tipo: 'tormenta'; reto: RetoTormenta }
  | { tipo: 'boss'; reto: RetoGuardianBoss };

export interface ResultadoAltar {
  exito: boolean;
  /** +1 en tormenta superada, -1 en tormenta fallida, 0 en el resto */
  desplazamientoExtra?: number;
  silabaObtenida?: string | null;
  esBossFinal?: boolean;
}

interface AltarDecodificacionProps {
  modal: ModalRetoActivo;
  estrellasActuales: number;
  silabasRecolectadas: number;
  onCompletar: (res: ResultadoAltar) => void;
}

const RUNAS_HORIZONTALES = 'R P N Γ R   ⌖   Λ Ψ Ω Δ Σ Φ   ⌖   P M H ⨉ B Δ Σ R N Ω';
const RUNAS_VERTICALES = ['P', 'M', 'K', 'L', 'R', 'P', 'N', 'M', '⌖', 'N', 'M', 'P', 'L', 'K', 'R', 'M'];

const CHISPAS = [
  { x: '18%', y: '34%', s: 4, d: 0 },
  { x: '26%', y: '25%', s: 3, d: 0.4 },
  { x: '37%', y: '44%', s: 3.5, d: 0.8 },
  { x: '48%', y: '22%', s: 4.5, d: 1.1 },
  { x: '56%', y: '42%', s: 3, d: 0.3 },
  { x: '67%', y: '24%', s: 4, d: 0.9 },
  { x: '78%', y: '36%', s: 3.5, d: 1.4 },
  { x: '83%', y: '48%', s: 3, d: 0.6 },
  { x: '22%', y: '52%', s: 3, d: 1.2 },
  { x: '73%', y: '53%', s: 4, d: 0.2 },
];

const ROTACIONES_TABLILLA = [-6, 4, -2, 5, -5, 3];

/** Pluma estelar decorativa de los costados del marco (fiel a la imagen de referencia 2). */
function PlumaEstelar({ lado }: { lado: 'izq' | 'der' }) {
  const espejo = lado === 'der' ? 'scale(-1, 1)' : undefined;
  return (
    <svg width="76" height="150" viewBox="0 0 76 150" className="overflow-visible select-none pointer-events-none">
      <defs>
        <linearGradient id={`plumaGrad-${lado}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="50%" stopColor="#A5B4FC" />
          <stop offset="100%" stopColor="#C4B5FD" />
        </linearGradient>
        <filter id={`plumaGlow-${lado}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g transform={ lado === 'der' ? 'translate(76, 0) scale(-1, 1)' : undefined } filter={`url(#plumaGlow-${lado})`}>
        <path
          d="M12 12 C28 16 52 38 60 76 C52 72 44 68 38 64 C47 76 55 90 61 108 C45 103 33 93 26 82 C33 96 42 110 55 122 C35 116 20 98 14 72 C10 52 9 30 12 12 Z"
          fill={`url(#plumaGrad-${lado})`}
          stroke="#E0F2FE"
          strokeWidth="1.4"
        />
        <path
          d="M14 16 C28 45 45 84 66 138"
          stroke="#F8FAFC"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

/** Tablilla de pergamino crema con bisel 3D cálido y muescas ornamentales. */
function TablillaPergamino({
  texto,
  inclinacion = 0,
  seleccionada = false,
  estado = 'normal',
  compacta = false,
  onClick,
  disabled = false,
}: {
  texto: string;
  inclinacion?: number;
  seleccionada?: boolean;
  estado?: 'normal' | 'intruso' | 'correcta' | 'error';
  compacta?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const estilosEstado = {
    normal: {
      bg: 'linear-gradient(180deg, #FFFDF7 0%, #FDF6E3 68%, #F2E3C6 100%)',
      border: '#D5BE97',
      bevel: '#B3986E',
      text: '#1E1B4B',
      glow: '0 6px 16px rgba(15, 23, 42, 0.38)',
    },
    intruso: {
      bg: 'linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 70%, #FECDD3 100%)',
      border: '#FDA4AF',
      bevel: '#E11D48',
      text: '#881337',
      glow: '0 0 22px rgba(253, 164, 175, 0.75)',
    },
    correcta: {
      bg: 'linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 70%, #A7F3D0 100%)',
      border: '#6EE7B7',
      bevel: '#059669',
      text: '#064E3B',
      glow: '0 0 24px rgba(110, 231, 183, 0.85)',
    },
    error: {
      bg: 'linear-gradient(180deg, #FFF1F2 0%, #FECDD3 100%)',
      border: '#FB7185',
      bevel: '#BE123C',
      text: '#881337',
      glow: '0 0 18px rgba(251, 113, 133, 0.65)',
    },
  }[estado];

  return (
    <motion.button
      type="button"
      layout
      whileHover={disabled ? undefined : { scale: 1.06, y: -4 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: seleccionada ? 0.35 : 1,
        scale: 1,
        rotate: inclinacion,
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative group select-none rounded-xl transition-shadow ${
        compacta ? 'px-3.5 py-2 text-sm sm:text-base' : 'px-5 py-2.5 sm:px-6 sm:py-3 text-base sm:text-xl'
      } font-extrabold tracking-tight ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
      style={{
        background: estilosEstado.bg,
        border: `2px solid ${estilosEstado.border}`,
        borderBottomWidth: '6px',
        borderBottomColor: estilosEstado.bevel,
        color: estilosEstado.text,
        boxShadow: estilosEstado.glow,
      }}
    >
      {/* Muescas decorativas tipo tablilla antigua */}
      <span
        className="absolute top-0 left-3 w-2 h-1 rounded-b-sm opacity-50"
        style={{ background: estilosEstado.bevel }}
      />
      <span
        className="absolute bottom-0 right-4 w-2 h-1 rounded-t-sm opacity-50"
        style={{ background: estilosEstado.bevel }}
      />
      <span className="relative z-10 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">{texto}</span>
    </motion.button>
  );
}

/** Ranura luminosa sobre el puente del Altar (Verde Menta a la izquierda, Azul Cielo a la derecha). */
function RanuraAltar({
  indice,
  total,
  contenido,
  resaltada = false,
  estado = 'normal',
  onClick,
  etiquetaVacia,
}: {
  indice: number;
  total: number;
  contenido: string | null;
  resaltada?: boolean;
  estado?: 'normal' | 'correcta' | 'intruso' | 'error';
  onClick?: () => void;
  etiquetaVacia?: string;
}) {
  const esMenta = indice < Math.ceil(total / 2);
  const colorBase = estado === 'error' || estado === 'intruso'
    ? '#FDA4AF'
    : estado === 'correcta'
      ? '#6EE7B7'
      : esMenta
        ? '#6EE7B7'
        : '#7DD3FC';
  const colorFondo = estado === 'error' || estado === 'intruso'
    ? 'linear-gradient(180deg, #FFE4E6 0%, #FDA4AF 100%)'
    : esMenta
      ? 'linear-gradient(180deg, #D1FAE5 0%, #6EE7B7 100%)'
      : 'linear-gradient(180deg, #E0F2FE 0%, #7DD3FC 100%)';

  // Ligera curvatura del arco del puente
  const centro = (total - 1) / 2;
  const dist = indice - centro;
  const rotacion = dist * 2.5;
  const elevacion = Math.abs(dist) * 4;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        transform: `translateY(${elevacion}px) rotate(${rotacion}deg)`,
      }}
    >
      {/* Haz de luz ascendente desde la ranura */}
      <div
        className="pointer-events-none absolute -top-14 w-20 sm:w-24 h-16 opacity-55 transition-opacity duration-300"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${colorBase}44 65%, ${colorBase}88 100%)`,
          clipPath: 'polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Marco de piedra tallada de la ranura */}
      <motion.div
        whileHover={onClick ? { scale: 1.04 } : undefined}
        whileTap={onClick ? { scale: 0.96 } : undefined}
        onClick={onClick}
        className={`relative z-10 min-w-[78px] sm:min-w-[106px] md:min-w-[118px] h-[44px] sm:h-[52px] px-2.5 rounded-xl flex items-center justify-center transition-all ${
          onClick ? 'cursor-pointer' : ''
        }`}
        style={{
          background: '#B69F82',
          border: `2px solid ${resaltada ? '#FEF08A' : '#8A7256'}`,
          boxShadow: `0 4px 0 #6E583F, 0 0 20px ${colorBase}55`,
        }}
      >
        {/* Interior luminoso del receptáculo */}
        <div
          className="w-full h-[32px] sm:h-[38px] rounded-lg flex items-center justify-center px-2 transition-all"
          style={{
            background: contenido
              ? estado === 'intruso' || estado === 'error'
                ? 'linear-gradient(180deg, #FFF1F2 0%, #FECDD3 100%)'
                : estado === 'correcta'
                  ? 'linear-gradient(180deg, #ECFDF5 0%, #A7F3D0 100%)'
                  : 'linear-gradient(180deg, #FFFDF7 0%, #FDF6E3 75%, #EAD7B7 100%)'
              : colorFondo,
            border: `2px solid ${contenido ? (estado === 'correcta' ? '#34D399' : estado === 'intruso' ? '#FB7185' : '#D5BE97') : '#FFFFFF'}`,
            boxShadow: `inset 0 0 12px ${colorBase}88, 0 0 12px ${colorBase}66`,
          }}
        >
          {contenido ? (
            <span
              className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight truncate max-w-[130px]"
              style={{
                color: estado === 'intruso' || estado === 'error' ? '#9F1239' : estado === 'correcta' ? '#065F46' : '#1E1B4B',
              }}
            >
              {contenido}
            </span>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-950/45 select-none">
              {etiquetaVacia ?? ''}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AltarDecodificacion({
  modal,
  estrellasActuales,
  silabasRecolectadas,
  onCompletar,
}: AltarDecodificacionProps) {
  const [mostrarPista, setMostrarPista] = useState(false);
  const [explicacionActiva, setExplicacionActiva] = useState<string | null>(null);
  const [mensajeApoyo, setMensajeApoyo] = useState<string | null>(null);
  const [resueltoExito, setResueltoExito] = useState< boolean | null >(null);

  /* ── Estado Mecánica 1: Caza del Intruso ── */
  const [intrusoDetectado, setIntrusoDetectado] = useState(false);
  const [indiceTocado, setIndiceTocado] = useState<number | null>(null);
  const [reemplazoElegido, setReemplazoElegido] = useState<string | null>(null);

  const opcionesIntruso = useMemo(() => {
    if (modal.tipo !== 'intruso') return [];
    return barajar(modal.reto.opciones);
  }, [modal]);

  /* ── Estado Mecánica 2: Constructor de Puentes ── */
  const fichasInicialesPuente = useMemo(() => {
    if (modal.tipo !== 'puente') return [];
    const base = modal.reto.ordenCorrecto.map((texto, idx) => ({ id: `f-${idx}`, texto }));
    let mezcladas = barajar(base);
    if (mezcladas.every((f, i) => f.texto === base[i].texto) && mezcladas.length > 1) {
      mezcladas = [...mezcladas.slice(1), mezcladas[0]];
    }
    return mezcladas;
  }, [modal]);

  const [ranurasPuente, setRanurasPuente] = useState<( { id: string; texto: string } | null )[]>([]);

  useEffect(() => {
    if (modal.tipo === 'puente') {
      setRanurasPuente(Array(modal.reto.ordenCorrecto.length).fill(null));
    }
  }, [modal]);

  /* ── Estado Mecánica 3: Tormenta de Meteoritos Acústicos ── */
  const fichasTormenta = useMemo(() => {
    if (modal.tipo !== 'tormenta') return [];
    return barajar(modal.reto.palabras);
  }, [modal]);

  const [seleccionTormenta, setSeleccionTormenta] = useState<string[]>([]);
  const [segundosRestantes, setSegundosRestantes] = useState(
    modal.tipo === 'tormenta' ? modal.reto.segundos : 18,
  );

  /* ── Estado Mecánica 4: Guardián del Vórtice (Boss Final) ── */
  const [faseBoss, setFaseBoss] = useState<0 | 1 | 2>(0);
  const [respuestasBoss, setRespuestasBoss] = useState<[string | null, string | null, string | null]>([
    null,
    null,
    null,
  ]);
  const [opcionBossActual, setOpcionBossActual] = useState<string | null>(null);

  const opcionesFaseBoss = useMemo(() => {
    if (modal.tipo !== 'boss') return [];
    return barajar(modal.reto.fases[faseBoss].opciones);
  }, [modal, faseBoss]);

  // Reiniciar estados al cambiar de reto
  useEffect(() => {
    setMostrarPista(false);
    setExplicacionActiva(null);
    setMensajeApoyo(null);
    setResueltoExito(null);
    setIntrusoDetectado(false);
    setIndiceTocado(null);
    setReemplazoElegido(null);
    setSeleccionTormenta([]);
    setFaseBoss(0);
    setRespuestasBoss([null, null, null]);
    setOpcionBossActual(null);
    if (modal.tipo === 'tormenta') {
      setSegundosRestantes(modal.reto.segundos);
    }
  }, [modal]);

  // Temporizador amigable de 18s para la Tormenta Acústica
  useEffect(() => {
    if (modal.tipo !== 'tormenta' || resueltoExito !== null) return;
    if (segundosRestantes <= 0) {
      setResueltoExito(false);
      setExplicacionActiva(
        `¡Pasó la tormenta! Las 3 palabras correctas eran: ${modal.reto.correctas.join(', ')}. ${modal.reto.explicacion}`,
      );
      return;
    }
    const timer = setTimeout(() => setSegundosRestantes((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [modal, segundosRestantes, resueltoExito]);

  /* ── Pista según mecánica ── */
  const pistaTexto = useMemo(() => {
    if (modal.tipo === 'intruso') return modal.reto.pista;
    if (modal.tipo === 'puente') return modal.reto.pista;
    if (modal.tipo === 'tormenta') return modal.reto.pista;
    return modal.reto.fases[faseBoss].enunciado;
  }, [modal, faseBoss]);

  /* ── Manejadores de interacción ── */

  // Mecánica 1: Tocar palabra de la oración
  const handleTocarPalabraOracion = (idx: number) => {
    if (modal.tipo !== 'intruso' || resueltoExito !== null) return;
    setIndiceTocado(idx);
    if (idx === modal.reto.indiceIntruso) {
      setIntrusoDetectado(true);
      setMensajeApoyo('¡Encontraste la palabra intrusa! Ahora elige la tablilla correcta para repararla.');
    } else {
      setMensajeApoyo(`«${modal.reto.palabras[idx]}» está bien escrita. ¡Busca otra palabra que tenga un error!`);
    }
  };

  // Mecánica 2: Colocar o devolver tablilla en el Puente Sintáctico
  const handleColocarFichaPuente = (ficha: { id: string; texto: string }) => {
    if (resueltoExito !== null) return;
    setMensajeApoyo(null);
    const yaColocadaIdx = ranurasPuente.findIndex((r) => r?.id === ficha.id);
    if (yaColocadaIdx !== -1) {
      const copia = [...ranurasPuente];
      copia[yaColocadaIdx] = null;
      setRanurasPuente(copia);
      return;
    }
    const huecoIdx = ranurasPuente.findIndex((r) => r === null);
    if (huecoIdx !== -1) {
      const copia = [...ranurasPuente];
      copia[huecoIdx] = ficha;
      setRanurasPuente(copia);
    }
  };

  const handleQuitarDeRanuraPuente = (idx: number) => {
    if (resueltoExito !== null) return;
    setMensajeApoyo(null);
    const copia = [...ranurasPuente];
    copia[idx] = null;
    setRanurasPuente(copia);
  };

  // Mecánica 3: Seleccionar tablilla en la Tormenta Acústica
  const handleTogglePalabraTormenta = (palabra: string) => {
    if (resueltoExito !== null) return;
    setMensajeApoyo(null);
    setSeleccionTormenta((prev) => {
      if (prev.includes(palabra)) return prev.filter((p) => p !== palabra);
      if (prev.length >= 3) return prev;
      return [...prev, palabra];
    });
  };

  // Botón principal COMPROBAR / CONTINUAR
  const handleComprobarOContinuar = useCallback(() => {
    // Si ya se resolvió el reto, cerrar y notificar al tablero
    if (resueltoExito !== null) {
      if (modal.tipo === 'intruso') {
        onCompletar({
          exito: resueltoExito,
          silabaObtenida: resueltoExito ? modal.otorgaSilaba ?? null : null,
        });
      } else if (modal.tipo === 'puente') {
        onCompletar({
          exito: resueltoExito,
          silabaObtenida: resueltoExito ? modal.otorgaSilaba ?? null : null,
        });
      } else if (modal.tipo === 'tormenta') {
        onCompletar({
          exito: resueltoExito,
          desplazamientoExtra: resueltoExito ? 1 : -1,
        });
      } else if (modal.tipo === 'boss') {
        if (faseBoss < 2) {
          // Avanzar al siguiente sello del Guardián
          setFaseBoss((f) => (f + 1) as 0 | 1 | 2);
          setOpcionBossActual(null);
          setResueltoExito(null);
          setExplicacionActiva(null);
          setMensajeApoyo(null);
          return;
        }
        onCompletar({
          exito: true,
          esBossFinal: true,
        });
      }
      return;
    }

    // Validación según la mecánica activa
    if (modal.tipo === 'intruso') {
      if (!intrusoDetectado) {
        setMensajeApoyo('Primero toca la tablilla de la oración que tiene un error ortográfico o de tilde.');
        return;
      }
      if (!reemplazoElegido) {
        setMensajeApoyo('Toca una de las 3 tablillas de reemplazo para reparar la oración.');
        return;
      }
      if (reemplazoElegido === modal.reto.correcta) {
        setResueltoExito(true);
        setMensajeApoyo(null);
        setExplicacionActiva(modal.reto.explicacion);
      } else {
        setMensajeApoyo(`«${reemplazoElegido}» no es la forma correcta. Pista: ${modal.reto.pista}`);
      }
      return;
    }

    if (modal.tipo === 'puente') {
      if (ranurasPuente.some((r) => r === null)) {
        setMensajeApoyo('Coloca todas las tablillas de pergamino en las ranuras luminosas del Altar.');
        return;
      }
      const palabrasOrdenadas = ranurasPuente.map((r) => r!.texto);
      if (validarPuente(modal.reto, palabrasOrdenadas)) {
        setResueltoExito(true);
        setMensajeApoyo(null);
        setExplicacionActiva(modal.reto.explicacion);
      } else {
        setMensajeApoyo('La oración aún no suena coherente. ¡Toca una tablilla del puente para cambiarla de lugar!');
      }
      return;
    }

    if (modal.tipo === 'tormenta') {
      if (seleccionTormenta.length < 3) {
        setMensajeApoyo('Selecciona 3 tablillas para activar las 3 ranuras del escudo del Altar.');
        return;
      }
      const aciertos = seleccionTormenta.every((p) => modal.reto.correctas.includes(p));
      setResueltoExito(aciertos);
      setMensajeApoyo(null);
      setExplicacionActiva(
        aciertos
          ? `¡Escudo Astral activado (+1 casilla de impulso)! ${modal.reto.explicacion}`
          : `La tormenta te hace retroceder 1 casilla. Las 3 correctas eran: ${modal.reto.correctas.join(', ')}. ${modal.reto.explicacion}`,
      );
      return;
    }

    if (modal.tipo === 'boss') {
      const fase = modal.reto.fases[faseBoss];
      if (!opcionBossActual) {
        setMensajeApoyo('Elige una tablilla para desencriptar el sello actual del códice.');
        return;
      }
      if (opcionBossActual === fase.correcta) {
        const nuevas: [string | null, string | null, string | null] = [...respuestasBoss];
        nuevas[faseBoss] = opcionBossActual;
        setRespuestasBoss(nuevas);
        setResueltoExito(true);
        setMensajeApoyo(null);
        setExplicacionActiva(fase.explicacion);
      } else {
        setMensajeApoyo('Esa pieza no encaja en el códice del Guardián. ¡Lee con atención el relato e inténtalo de nuevo!');
      }
    }
  }, [
    resueltoExito,
    modal,
    intrusoDetectado,
    reemplazoElegido,
    ranurasPuente,
    seleccionTormenta,
    faseBoss,
    opcionBossActual,
    respuestasBoss,
    onCompletar,
  ]);

  // Renderizado del relato del Guardián con las 3 ranuras {0}, {1}, {2}
  const renderRelatoGuardian = () => {
    if (modal.tipo !== 'boss') return null;
    const partes = modal.reto.relato.split(/(\{\d\})/g);
    return (
      <div className="bg-[#FDF6E3] border-2 border-[#D5BE97] rounded-2xl p-4 sm:p-5 text-[#1E1B4B] shadow-lg max-w-2xl mx-auto mb-4 leading-relaxed text-sm sm:text-base font-medium">
        <div className="flex items-center justify-between border-b border-[#E6D5B8] pb-2 mb-2.5">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-900/70">
            ✦ Códice del Guardián: {modal.reto.titulo}
          </span>
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-violet-200 text-indigo-950">
            Sello {faseBoss + 1} de 3
          </span>
        </div>
        <p className="text-indigo-950 leading-7">
          {partes.map((fragmento, idx) => {
            const match = /^\{(\d)\}$/.exec(fragmento);
            if (!match) return <span key={idx}>{fragmento}</span>;
            const numSello = Number(match[1]) as 0 | 1 | 2;
            const valorResuelto = respuestasBoss[numSello];
            const esActual = numSello === faseBoss;
            const preview = esActual && opcionBossActual ? opcionBossActual : null;
            return (
              <span
                key={idx}
                className={`inline-flex items-center mx-1 px-2.5 py-0.5 rounded-lg font-extrabold text-xs sm:text-sm border-2 transition-all ${
                  valorResuelto
                    ? 'bg-emerald-200 border-emerald-500 text-emerald-950 shadow-[0_0_12px_rgba(110,231,183,0.7)]'
                    : esActual
                      ? 'bg-sky-200 border-sky-400 text-indigo-950 animate-pulse shadow-[0_0_12px_rgba(125,211,252,0.8)]'
                      : 'bg-violet-100 border-violet-300 text-indigo-900/60'
                }`}
              >
                {valorResuelto ?? preview ?? `Sello ${numSello + 1}`}
              </span>
            );
          })}
        </p>
      </div>
    );
  };

  // Segmentos de energía superiores
  const segmentosEnergia = modal.tipo === 'tormenta'
    ? Math.max(0, Math.ceil((segundosRestantes / modal.reto.segundos) * 4))
    : 4;

  const textoBotonPrincipal = useMemo(() => {
    if (resueltoExito === null) return 'COMPROBAR';
    if (modal.tipo === 'boss' && faseBoss < 2) return 'SIGUIENTE SELLO ✦';
    if (modal.tipo === 'boss' && faseBoss === 2) return 'RESTAURAR ARCHIVO ✦';
    return 'CONTINUAR ✦';
  }, [resueltoExito, modal.tipo, faseBoss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 45%, rgba(49, 69, 118, 0.96) 0%, rgba(28, 40, 72, 0.98) 65%, rgba(17, 24, 45, 0.99) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* ── Estrellas de fondo del Altar ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {CHISPAS.map((c, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: c.x,
              top: c.y,
              width: c.s * 2,
              height: c.s * 2,
              background: i % 2 === 0 ? '#FEF08A' : '#C4B5FD',
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#FDE047' : '#A78BFA'}`,
            }}
            animate={{ opacity: [0.25, 0.95, 0.25], scale: [0.8, 1.25, 0.8] }}
            transition={{ duration: 2.4 + (i % 3) * 0.6, repeat: Infinity, delay: c.d }}
          />
        ))}
      </div>

      {/* ── Ornamentos de las 4 esquinas exteriores (como en la Imagen 2) ── */}
      <div className="pointer-events-none hidden md:flex fixed top-3 left-3 items-center gap-2">
        <div className="w-11 h-11 rounded-full bg-[#6D82C4]/40 border-2 border-[#A5B4FC] flex items-center justify-center text-indigo-100 shadow-lg">
          ✦
        </div>
        <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-[#A5B4FC] to-transparent opacity-60" />
      </div>
      <div className="pointer-events-none hidden md:flex fixed top-3 right-3 items-center gap-2">
        <div className="w-24 h-1.5 rounded-full bg-gradient-to-l from-[#A5B4FC] to-transparent opacity-60" />
        <div className="w-11 h-11 rounded-full bg-[#6D82C4]/40 border-2 border-[#A5B4FC] flex items-center justify-center text-indigo-100 shadow-lg">
          🪶
        </div>
      </div>
      <div className="pointer-events-none hidden md:flex fixed bottom-3 left-3 items-center gap-2 bg-[#283556]/90 border-2 border-[#93A8E8] rounded-full px-3 py-1.5 shadow-lg">
        <span className="w-7 h-7 rounded-full bg-amber-300/30 border border-amber-300 flex items-center justify-center text-amber-300 text-sm">
          ⚡
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className="w-2.5 h-3.5 rounded-xs"
              style={{
                background: i < 4 ? '#FB923C' : i < 7 ? '#FACC15' : '#6EE7B7',
              }}
            />
          ))}
        </div>
      </div>
      <div className="pointer-events-none hidden md:flex fixed bottom-3 right-3 items-center gap-2">
        <div className="w-24 h-1.5 rounded-full bg-gradient-to-l from-[#A5B4FC] to-transparent opacity-60" />
        <div className="w-11 h-11 rounded-full bg-[#6D82C4]/40 border-2 border-[#A5B4FC] flex items-center justify-center text-indigo-100 shadow-lg">
          ✺
        </div>
      </div>

      {/* ══════════ CONTENEDOR PRINCIPAL DEL ALTAR DE DECODIFICACIÓN ══════════ */}
      <div className="relative flex items-center justify-center w-full max-w-[960px] my-auto">
        <motion.div
          initial={{ scale: 0.92, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="relative w-full max-w-[850px] rounded-[26px] p-[18px] sm:p-[24px] shadow-[0_24px_80px_rgba(10,16,34,0.85)]"
          style={{
            background: 'linear-gradient(180deg, #B8C4F0 0%, #98A7E2 50%, #8696D8 100%)',
            border: '3px solid #D9E2FF',
          }}
        >
          {/* ── Inscripciones rúnicas del marco (Arriba, Abajo, Izquierda, Derecha) ── */}
          <div className="pointer-events-none absolute top-1 left-8 right-8 h-4 flex items-center justify-between text-[10px] font-mono font-bold tracking-[0.35em] text-[#3F4C85] overflow-hidden opacity-85">
            <span>{RUNAS_HORIZONTALES}</span>
            <span>{RUNAS_HORIZONTALES}</span>
          </div>
          <div className="pointer-events-none absolute bottom-1 left-8 right-8 h-4 flex items-center justify-between text-[10px] font-mono font-bold tracking-[0.35em] text-[#3F4C85] overflow-hidden opacity-85">
            <span>{RUNAS_HORIZONTALES}</span>
            <span>{RUNAS_HORIZONTALES}</span>
          </div>
          <div className="pointer-events-none absolute top-8 bottom-8 left-1.5 w-4 flex flex-col items-center justify-between text-[10px] font-mono font-bold text-[#3F4C85] opacity-85">
            {RUNAS_VERTICALES.map((r, i) => (
              <span key={i}>{r}</span>
            ))}
          </div>
          <div className="pointer-events-none absolute top-8 bottom-8 right-1.5 w-4 flex flex-col items-center justify-between text-[10px] font-mono font-bold text-[#3F4C85] opacity-85">
            {RUNAS_VERTICALES.map((r, i) => (
              <span key={i}>{r}</span>
            ))}
          </div>

          {/* 4 Esquinas rúnicas cuadradas */}
          {['top-1.5 left-1.5', 'top-1.5 right-1.5', 'bottom-1.5 left-1.5', 'bottom-1.5 right-1.5'].map((pos, i) => (
            <div
              key={i}
              className={`pointer-events-none absolute ${pos} w-5 h-5 rounded-sm bg-[#8B9CE0] border border-[#495692] flex items-center justify-center text-[10px] font-bold text-[#2D386C]`}
            >
              ⋈
            </div>
          ))}

          {/* ── Plumas Estelares Flotantes a Izquierda y Derecha ── */}
          <motion.div
            className="hidden sm:block absolute -left-10 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
            animate={{ y: [-6, 6, -6], rotate: [-4, 2, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PlumaEstelar lado="izq" />
          </motion.div>
          <motion.div
            className="hidden sm:block absolute -right-10 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
            animate={{ y: [6, -6, 6], rotate: [4, -2, 4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PlumaEstelar lado="der" />
          </motion.div>

          {/* ── Placa Superior "ALTAR DE DECODIFICACIÓN" ── */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-[540px]">
            <div
              className="relative px-6 py-2.5 sm:py-3 rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(15,23,42,0.5)]"
              style={{
                background: 'linear-gradient(180deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
                border: '2px solid #FEF9C3',
              }}
            >
              {/* Gemas laterales del cartel */}
              <div className="hidden sm:flex absolute -left-3 w-7 h-7 rotate-45 rounded-xs bg-[#FDE68A] border-2 border-[#B45309] items-center justify-center shadow">
                <div className="w-3.5 h-3.5 bg-[#7DD3FC] border border-white" />
              </div>
              <div className="hidden sm:flex absolute -right-3 w-7 h-7 rotate-45 rounded-xs bg-[#FDE68A] border-2 border-[#B45309] items-center justify-center shadow">
                <div className="w-3.5 h-3.5 bg-[#7DD3FC] border border-white" />
              </div>

              <div
                className="w-full py-1.5 px-4 rounded-xl text-center"
                style={{
                  background: 'linear-gradient(180deg, #EEF2FF 0%, #DDD6FE 60%, #C4B5FD 100%)',
                  border: '1.5px solid #A78BFA',
                }}
              >
                <h2 className="text-base sm:text-xl md:text-2xl font-black tracking-wider text-[#1E1B4B] drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                  ALTAR DE DECODIFICACIÓN
                </h2>
              </div>
            </div>
          </div>

          {/* ── Interior Azul Crepúsculo del Altar ── */}
          <div
            className="relative rounded-[18px] pt-10 pb-12 px-4 sm:px-8 min-h-[450px] sm:min-h-[500px] flex flex-col justify-between overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at 50% 62%, #3B5284 0%, #283556 58%, #1E293B 100%)',
              border: '2px solid #64748B',
              boxShadow: 'inset 0 0 60px rgba(15, 23, 42, 0.7)',
            }}
          >
            {/* ── Barra de estado interna (Energía/Tiempo a la izq, Estrellas/Sílabas a la der) ── */}
            <div className="relative z-20 flex items-center justify-between gap-2 mb-3">
              {/* Píldora izquierda: Energía o Temporizador de Tormenta */}
              <div className="flex items-center gap-2 bg-[#334168]/90 border border-[#818CF8]/50 rounded-full px-3 py-1 shadow-md">
                <span className="w-6 h-6 rounded-full bg-amber-400/25 border border-amber-300 flex items-center justify-center text-amber-300 text-xs font-bold">
                  ⚡
                </span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="w-2.5 h-3.5 rounded-xs transition-all duration-300"
                      style={{
                        background: i < segmentosEnergia ? '#FACC15' : 'rgba(255,255,255,0.15)',
                        boxShadow: i < segmentosEnergia ? '0 0 8px #FACC15' : 'none',
                      }}
                    />
                  ))}
                </div>
                {modal.tipo === 'tormenta' && (
                  <span
                    className={`ml-1 text-xs font-black tracking-wide ${
                      segundosRestantes <= 5 ? 'text-rose-300 animate-pulse' : 'text-amber-200'
                    }`}
                  >
                    {segundosRestantes}s
                  </span>
                )}
              </div>

              {/* Botón móvil de Ayuda + Píldora derecha de Sílabas/Estrellas */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarPista((v) => !v)}
                  className="lg:hidden flex items-center gap-1 bg-violet-400/25 hover:bg-violet-400/40 border border-violet-300 rounded-full px-3 py-1 text-xs font-extrabold text-violet-100 cursor-pointer"
                >
                  🪶 AYUDA
                </button>
                <div className="flex items-center gap-1.5 bg-[#334168]/90 border border-[#818CF8]/50 rounded-full px-3.5 py-1 shadow-md">
                  <span className="text-amber-300 text-sm">★</span>
                  <span className="text-xs sm:text-sm font-black text-white tracking-wide">
                    {silabasRecolectadas}/4
                  </span>
                </div>
              </div>
            </div>

            {/* ── Consigna / Instrucción Pedagógica ── */}
            <div className="relative z-20 text-center mb-3">
              {modal.tipo === 'intruso' && (
                <>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-violet-300/20 border border-violet-300/40 text-violet-200 mb-1">
                    Mecánica 1 · Caza del Intruso ({modal.reto.categoria})
                  </span>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-[#FDF6E3] drop-shadow">
                    {!intrusoDetectado
                      ? 'Toca la palabra intrusa que tiene un error:'
                      : '¡Elige la tablilla correcta para reparar el Altar!'}
                  </h3>
                </>
              )}

              {modal.tipo === 'puente' && (
                <>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-emerald-300/20 border border-emerald-300/40 text-emerald-200 mb-1">
                    {modal.esPortal
                      ? 'Portal de Convergencia · 4.ª Sílaba Clave'
                      : 'Mecánica 2 · Constructor de Puentes Sintácticos'}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-[#FDF6E3] drop-shadow">
                    Decodifica el mensaje:
                  </h3>
                </>
              )}

              {modal.tipo === 'tormenta' && (
                <>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-rose-300/25 border border-rose-300/50 text-rose-200 mb-1">
                    Mecánica 3 · Tormenta de Meteoritos Acústicos
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold text-[#FDF6E3] drop-shadow max-w-xl mx-auto">
                    {modal.reto.consigna}
                  </h3>
                </>
              )}

              {modal.tipo === 'boss' && (
                <>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-sky-300/25 border border-sky-300/50 text-sky-200 mb-1">
                    Guardián del Vórtice Gramatical · {modal.reto.fases[faseBoss].titulo}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#FDF6E3] drop-shadow max-w-2xl mx-auto">
                    {modal.reto.fases[faseBoss].enunciado}
                  </h3>
                </>
              )}
            </div>

            {/* ── Pista Desplegable (cuando se pulsa AYUDA) ── */}
            <AnimatePresence>
              {mostrarPista && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="relative z-30 mx-auto mb-3 max-w-xl bg-[#FDF6E3] border-2 border-[#A78BFA] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1E1B4B] shadow-lg flex items-center gap-2.5"
                >
                  <span className="text-lg">🪶</span>
                  <span>
                    <strong>Pista Astral:</strong> {pistaTexto}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Zona Central: Tablillas Flotantes (Arriba) ── */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-center my-1">
              {/* Mecánica 1: Opciones de reemplazo cuando ya se detectó el intruso */}
              {modal.tipo === 'intruso' && (
                <div className="min-h-[82px] flex flex-wrap items-center justify-center gap-4 px-2">
                  {!intrusoDetectado ? (
                    <p className="text-xs sm:text-sm font-semibold text-sky-200/90 bg-slate-900/40 px-4 py-2 rounded-full border border-sky-300/30">
                      👇 Toca directamente sobre el puente la tablilla que contiene el error
                    </p>
                  ) : (
                    opcionesIntruso.map((op, i) => (
                      <TablillaPergamino
                        key={op}
                        texto={op}
                        inclinacion={ROTACIONES_TABLILLA[i % ROTACIONES_TABLILLA.length]}
                        estado={
                          reemplazoElegido === op
                            ? resueltoExito
                              ? 'correcta'
                              : 'intruso'
                            : 'normal'
                        }
                        onClick={() => {
                          if (resueltoExito !== null) return;
                          setReemplazoElegido(op);
                          setMensajeApoyo(null);
                        }}
                      />
                    ))
                  )}
                </div>
              )}

              {/* Mecánica 2: Tablillas desordenadas flotando sobre el puente */}
              {modal.tipo === 'puente' && (
                <div className="min-h-[96px] flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-2 max-w-2xl">
                  {fichasInicialesPuente.map((ficha, i) => {
                    const usada = ranurasPuente.some((r) => r?.id === ficha.id);
                    return (
                      <TablillaPergamino
                        key={ficha.id}
                        texto={ficha.texto}
                        inclinacion={ROTACIONES_TABLILLA[i % ROTACIONES_TABLILLA.length]}
                        seleccionada={usada}
                        onClick={() => handleColocarFichaPuente(ficha)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Mecánica 3: 6 Meteoritos de pergamino flotando suavemente */}
              {modal.tipo === 'tormenta' && (
                <div className="min-h-[104px] flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-2 max-w-2xl">
                  {fichasTormenta.map((palabra, i) => {
                    const elegida = seleccionTormenta.includes(palabra);
                    return (
                      <motion.div
                        key={palabra}
                        animate={{ y: [i % 2 === 0 ? -5 : 5, i % 2 === 0 ? 5 : -5, i % 2 === 0 ? -5 : 5] }}
                        transition={{ duration: 2.2 + (i % 3) * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <TablillaPergamino
                          texto={palabra}
                          inclinacion={ROTACIONES_TABLILLA[i % ROTACIONES_TABLILLA.length]}
                          seleccionada={elegida}
                          onClick={() => handleTogglePalabraTormenta(palabra)}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Mecánica 4: Relato del Guardián + Opciones de la fase actual */}
              {modal.tipo === 'boss' && (
                <div className="w-full flex flex-col items-center">
                  {renderRelatoGuardian()}
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-2">
                    {opcionesFaseBoss.map((op, i) => (
                      <TablillaPergamino
                        key={op}
                        texto={op}
                        compacta={op.length > 22}
                        inclinacion={ROTACIONES_TABLILLA[i % ROTACIONES_TABLILLA.length]}
                        estado={
                          opcionBossActual === op
                            ? resueltoExito
                              ? 'correcta'
                              : 'normal'
                            : 'normal'
                        }
                        onClick={() => {
                          if (resueltoExito !== null) return;
                          setOpcionBossActual(op);
                          setMensajeApoyo(null);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── PUENTE ARQUEADO DEL ALTAR Y RANURAS LUMINOSAS (Fiel a Imagen 2) ── */}
            <div className="relative z-20 mt-4 pt-3 pb-1 flex flex-col items-center">
              {/* Base arquitectónica del puente curvado */}
              <div className="relative w-full max-w-[740px] px-3 py-3 rounded-[28px] bg-gradient-to-b from-[#D5C1A3] via-[#B89F7D] to-[#8F7657] border-2 border-[#EDE0CA] shadow-[0_10px_0_#5E4B35,0_16px_30px_rgba(0,0,0,0.5)]">
                {/* Grabados laterales del puente */}
                <span className="hidden sm:flex absolute left-2.5 top-1/2 -translate-y-1/2 w-5 h-8 rounded bg-[#9E8565] border border-[#6E583F] items-center justify-center text-xs font-bold text-[#4A3A28]">
                  ϟ
                </span>
                <span className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-8 rounded bg-[#9E8565] border border-[#6E583F] items-center justify-center text-xs font-bold text-[#4A3A28]">
                  ϟ
                </span>

                {/* Ranuras según la mecánica */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-2 sm:px-6">
                  {modal.tipo === 'intruso' &&
                    modal.reto.palabras.map((pal, idx) => {
                      const esIntruso = idx === modal.reto.indiceIntruso;
                      const mostrarReemplazo = esIntruso && reemplazoElegido ? reemplazoElegido : pal;
                      const estadoSlot =
                        esIntruso && resueltoExito
                          ? 'correcta'
                          : esIntruso && intrusoDetectado
                            ? 'intruso'
                            : indiceTocado === idx && !esIntruso
                              ? 'error'
                              : 'normal';
                      return (
                        <RanuraAltar
                          key={idx}
                          indice={idx}
                          total={modal.reto.palabras.length}
                          contenido={mostrarReemplazo}
                          resaltada={esIntruso && intrusoDetectado}
                          estado={estadoSlot}
                          onClick={() => handleTocarPalabraOracion(idx)}
                        />
                      );
                    })}

                  {modal.tipo === 'puente' &&
                    ranurasPuente.map((slot, idx) => (
                      <RanuraAltar
                        key={idx}
                        indice={idx}
                        total={ranurasPuente.length}
                        contenido={slot?.texto ?? null}
                        estado={resueltoExito ? 'correcta' : 'normal'}
                        etiquetaVacia={`${idx + 1}`}
                        onClick={() => slot && handleQuitarDeRanuraPuente(idx)}
                      />
                    ))}

                  {modal.tipo === 'tormenta' &&
                    [0, 1, 2].map((idx) => {
                      const pal = seleccionTormenta[idx] ?? null;
                      return (
                        <RanuraAltar
                          key={idx}
                          indice={idx}
                          total={3}
                          contenido={pal}
                          estado={
                            resueltoExito === null
                              ? 'normal'
                              : pal && modal.reto.correctas.includes(pal)
                                ? 'correcta'
                                : 'error'
                          }
                          etiquetaVacia={`Escudo ${idx + 1}`}
                          onClick={() => pal && handleTogglePalabraTormenta(pal)}
                        />
                      );
                    })}

                  {modal.tipo === 'boss' &&
                    [0, 1, 2].map((idx) => {
                      const num = idx as 0 | 1 | 2;
                      const textoSello =
                        respuestasBoss[num] ?? (num === faseBoss ? opcionBossActual : null);
                      return (
                        <RanuraAltar
                          key={idx}
                          indice={idx}
                          total={3}
                          contenido={textoSello}
                          resaltada={num === faseBoss}
                          estado={
                            respuestasBoss[num]
                              ? 'correcta'
                              : num === faseBoss && resueltoExito
                                ? 'correcta'
                                : 'normal'
                          }
                          etiquetaVacia={`Sello ${idx + 1}`}
                        />
                      );
                    })}
                </div>
              </div>

              {/* ── Pedestal Circular "Altar" con Círculo Mágico Luminoso (Imagen 2) ── */}
              <div className="relative -mt-1 flex flex-col items-center">
                {/* Cono de luz proyectado hacia el puente */}
                <div
                  className="pointer-events-none absolute -top-10 w-52 h-14 opacity-60"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 80%, rgba(254, 240, 138, 0.65) 0%, rgba(125, 211, 252, 0.35) 55%, transparent 80%)',
                  }}
                />
                <div
                  className="relative w-44 sm:w-52 h-12 rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
                  style={{
                    background: 'linear-gradient(180deg, #B4A696 0%, #7C6E63 100%)',
                    border: '2px solid #D6C7B2',
                  }}
                >
                  <div
                    className="w-32 sm:w-36 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        'radial-gradient(circle, #FEF9C3 0%, #BAE6FD 55%, #38BDF8 100%)',
                      boxShadow: '0 0 20px #7DD3FC, inset 0 0 10px #FEF08A',
                    }}
                  >
                    <div className="w-20 h-3.5 rounded-full border border-amber-300/80" />
                  </div>
                  <span className="absolute -bottom-2 px-3 py-0.5 rounded-md bg-[#8F7F72] border border-[#D6C7B2] text-[11px] font-black tracking-wider text-[#FDF6E3] shadow">
                    Altar
                  </span>
                </div>
              </div>
            </div>

            {/* ── Mensajes de apoyo o Explicación Formativa al Resolver ── */}
            <AnimatePresence mode="wait">
              {explicacionActiva ? (
                <motion.div
                  key="explicacion"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`relative z-30 mt-3 mx-auto max-w-2xl rounded-2xl p-3.5 sm:p-4 border-2 shadow-xl flex items-start gap-3 ${
                    resueltoExito
                      ? 'bg-[#ECFDF5] border-[#6EE7B7] text-[#064E3B]'
                      : 'bg-[#FFF1F2] border-[#FDA4AF] text-[#881337]'
                  }`}
                >
                  <span className="text-2xl shrink-0">{resueltoExito ? '✨' : '💫'}</span>
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <p className="font-black uppercase tracking-wider mb-0.5">
                      {resueltoExito
                        ? modal.tipo !== 'tormenta' && modal.tipo !== 'boss' && modal.otorgaSilaba
                          ? `¡Excelente! Ganaste el Cristal de Sílaba «${modal.otorgaSilaba}»`
                          : '¡Decodificación Correcta!'
                        : 'Nota del Archivo Astral'}
                    </p>
                    <p className="font-semibold">{explicacionActiva}</p>
                  </div>
                </motion.div>
              ) : mensajeApoyo ? (
                <motion.div
                  key="apoyo"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="relative z-30 mt-3 mx-auto max-w-xl rounded-xl px-4 py-2 bg-[#FEF3C7] border-2 border-[#FCD34D] text-[#78350F] text-xs sm:text-sm font-bold text-center shadow"
                >
                  {mensajeApoyo}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* ── Botón Inferior Central "COMPROBAR" (Hexagonal Ámbar como en Imagen 2) ── */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleComprobarOContinuar}
              className="relative px-9 sm:px-12 py-3 rounded-2xl font-black text-base sm:text-lg tracking-wider text-[#1E1B4B] cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
              style={{
                background:
                  resueltoExito !== null
                    ? 'linear-gradient(180deg, #A7F3D0 0%, #34D399 55%, #059669 100%)'
                    : 'linear-gradient(180deg, #FDE68A 0%, #FBBF24 45%, #D97706 100%)',
                border: '3px solid #E0F2FE',
                boxShadow:
                  resueltoExito !== null
                    ? '0 5px 0 #065F46, 0 10px 24px rgba(16,185,129,0.5)'
                    : '0 5px 0 #92400E, 0 10px 24px rgba(245,158,11,0.45)',
              }}
            >
              {textoBotonPrincipal}
            </motion.button>
          </div>
        </motion.div>

        {/* ── Botón Exterior Derecho "AYUDA" con Pluma Estelar (Fiel a Imagen 2) ── */}
        <div className="hidden lg:flex flex-col items-center ml-5 z-30">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setMostrarPista((v) => !v)}
            className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-[0_0_25px_rgba(167,139,250,0.45)]"
            style={{
              background: 'radial-gradient(circle, #43538A 0%, #283556 100%)',
              border: '2px solid #A5B4FC',
            }}
            title="Mostrar pista pedagógica"
          >
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <path
                d="M28 6 C18 8 11 15 8 26 L6 30 L10 28 C18 25 25 18 28 6 Z"
                fill="#C4B5FD"
                stroke="#E0F2FE"
                strokeWidth="1.5"
              />
              <path d="M7 29 L24 12" stroke="#FEF08A" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </motion.button>
          <span className="mt-1.5 text-xs font-black tracking-widest text-[#E0E7FF]">
            AYUDA
          </span>
        </div>
      </div>
    </motion.div>
  );
}

