'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PreguntaMatematica, RetoArmilarBoss } from '../../../lib/preguntas-numerix';

/* ════════════════════════ COMPONENTES HOLOGRÁFICOS COMPARTIDOS ════════════════════════ */

/** Esfera Armilar Dorada en miniatura para la esquina superior izquierda del marco (Imágenes 3 y 4). */
function EsferaArmilarEsquina() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="overflow-visible select-none pointer-events-none">
      <defs>
        <radialGradient id="cornerArmilarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cornerGoldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="40" fill="url(#cornerArmilarGlow)" />
      <g transform="translate(48 48)">
        <ellipse rx="32" ry="30" fill="none" stroke="url(#cornerGoldGrad)" strokeWidth="5" />
        <ellipse rx="30" ry="15" transform="rotate(-30)" fill="none" stroke="url(#cornerGoldGrad)" strokeWidth="4.5" />
        <ellipse rx="28" ry="13" transform="rotate(35)" fill="none" stroke="url(#cornerGoldGrad)" strokeWidth="4" />
        <circle r="9" fill="#38BDF8" stroke="#FEF08A" strokeWidth="1.5" />
        <circle r="4.5" fill="#FEF9C3" />
      </g>
    </svg>
  );
}

/** Botón exterior derecho "PISTA CUÁNTICA" (Imágenes 3 y 4). */
function BotonPistaCuantica({ onClick }: { onClick: () => void }) {
  return (
    <div className="hidden lg:flex flex-col items-center ml-5 z-30 select-none">
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={onClick}
        className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.5)]"
        style={{
          background: 'radial-gradient(circle, #0E3A5F 0%, #07192E 100%)',
          border: '2px solid #00F0FF',
        }}
        title="Mostrar Pista Cuántica"
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="14" stroke="#00F0FF" strokeWidth="1.6" strokeDasharray="5 3" />
          <circle cx="18" cy="18" r="9" stroke="#7DD3FC" strokeWidth="1.4" />
          <circle cx="18" cy="18" r="4" fill="#00F0FF" />
          <path d="M18 2 V7 M18 29 V34 M2 18 H7 M29 18 H34" stroke="#00F0FF" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </motion.button>
      <span className="mt-2 text-[11px] font-black tracking-widest text-[#BAE6FD] text-center leading-tight">
        PISTA
        <br />
        CUÁNTICA
      </span>
    </div>
  );
}

/** Cubo Cuántico 3D Traslúcido flotante (fiel a Imágenes 3 y 4). */
function CuboCuantico3D({
  texto,
  seleccionado = false,
  estado = 'normal',
  inclinacion = 0,
  compacto = false,
  onClick,
  disabled = false,
}: {
  texto: string;
  seleccionado?: boolean;
  estado?: 'normal' | 'correcto' | 'error';
  inclinacion?: number;
  compacto?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const w = compacto ? 104 : 116;
  const h = compacto ? 104 : 116;

  const colores = {
    normal: {
      topStroke: seleccionado ? '#FFFFFF' : '#FBBF24',
      sideStroke: '#00F0FF',
      topFill: seleccionado ? 'rgba(251, 191, 36, 0.42)' : 'rgba(180, 120, 20, 0.28)',
      leftFill: seleccionado ? 'rgba(0, 240, 255, 0.38)' : 'rgba(6, 95, 130, 0.42)',
      rightFill: seleccionado ? 'rgba(14, 165, 233, 0.45)' : 'rgba(8, 65, 105, 0.52)',
      text: '#FEF08A',
      glow: seleccionado ? '0 0 26px rgba(0, 240, 255, 0.85)' : '0 8px 22px rgba(0, 229, 255, 0.35)',
    },
    correcto: {
      topStroke: '#6EE7B7',
      sideStroke: '#00FF88',
      topFill: 'rgba(16, 185, 129, 0.45)',
      leftFill: 'rgba(5, 150, 105, 0.5)',
      rightFill: 'rgba(4, 120, 87, 0.6)',
      text: '#ECFDF5',
      glow: '0 0 28px rgba(0, 255, 136, 0.85)',
    },
    error: {
      topStroke: '#FB7185',
      sideStroke: '#EF4444',
      topFill: 'rgba(225, 29, 72, 0.45)',
      leftFill: 'rgba(159, 18, 57, 0.5)',
      rightFill: 'rgba(136, 19, 55, 0.6)',
      text: '#FFE4E6',
      glow: '0 0 24px rgba(239, 68, 68, 0.8)',
    },
  }[estado];

  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.07, y: -5 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      animate={{ rotate: inclinacion }}
      onClick={onClick}
      disabled={disabled}
      className={`relative group select-none focus:outline-none ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
      style={{
        width: w,
        height: h,
        filter: `drop-shadow(${colores.glow})`,
      }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
        {/* Aristas internas traslúcidas */}
        <line x1="60" y1="12" x2="60" y2="66" stroke="#7DD3FC" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="3 3" />
        <line x1="14" y1="84" x2="60" y2="66" stroke="#7DD3FC" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="3 3" />
        <line x1="106" y1="84" x2="60" y2="66" stroke="#7DD3FC" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="3 3" />

        {/* Cara Izquierda */}
        <polygon
          points="14,36 60,58 60,108 14,84"
          fill={colores.leftFill}
          stroke={colores.sideStroke}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Cara Derecha */}
        <polygon
          points="106,36 60,58 60,108 106,84"
          fill={colores.rightFill}
          stroke={colores.sideStroke}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Cara Superior (Rombo) */}
        <polygon
          points="60,12 106,36 60,58 14,36"
          fill={colores.topFill}
          stroke={colores.topStroke}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />

        {/* Destellos internos en las caras */}
        <line x1="26" y1="54" x2="46" y2="86" stroke="#FEF08A" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
        <line x1="92" y1="54" x2="74" y2="86" stroke="#7DD3FC" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />

        {/* Símbolos + decorativos en las esquinas */}
        <text x="96" y="47" fill="#FEF08A" fontSize="10" fontWeight="900">+</text>
        <text x="18" y="48" fill="#7DD3FC" fontSize="9" fontWeight="900">✦</text>

        {/* Valor numérico grande en la parte superior/central */}
        <text
          x="60"
          y={texto.length > 5 ? '40' : '38'}
          textAnchor="middle"
          dominantBaseline="central"
          fill={colores.text}
          fontSize={texto.length > 6 ? '15' : texto.length > 3 ? '19' : '24'}
          fontWeight="900"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85))',
          }}
        >
          {texto}
        </text>
      </svg>
    </motion.button>
  );
}

/** Base del Reactor Circular Dorado y Cian con 4 ranuras luminosas superiores (Imágenes 3 y 4). */
function BaseReactorCuantico({
  ranuras,
  onSlotClick,
}: {
  ranuras?: (string | null)[];
  onSlotClick?: (idx: number) => void;
}) {
  const slots = ranuras ?? [null, null, null, null];
  const posRanuras = [
    { left: '16%', top: '12%', rot: -14 },
    { left: '38%', top: '2%', rot: -5 },
    { left: '62%', top: '2%', rot: 5 },
    { left: '84%', top: '12%', rot: 14 },
  ];

  return (
    <div className="relative w-full max-w-[680px] h-[155px] sm:h-[175px] mx-auto select-none">
      {/* SVG de la Turbina / Reactor Circular 3D */}
      <svg viewBox="0 0 680 180" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="reactorGoldRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FEF08A" />
            <stop offset="75%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <radialGradient id="reactorCyanCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="45%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#0369A1" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Sombra y faldón metálico exterior */}
        <ellipse cx="340" cy="140" rx="310" ry="72" fill="#091526" stroke="#1E3A5F" strokeWidth="2" />
        <ellipse cx="340" cy="126" rx="280" ry="66" fill="#1E293B" stroke="#D97706" strokeWidth="3" />

        {/* Anillo exterior dorado biselado */}
        <ellipse cx="340" cy="112" rx="252" ry="58" fill="url(#reactorGoldRim)" stroke="#FEF08A" strokeWidth="2" />

        {/* Foso energético cian interior */}
        <ellipse cx="340" cy="110" rx="195" ry="44" fill="#041E36" stroke="#00F0FF" strokeWidth="3" />
        <ellipse cx="340" cy="110" rx="162" ry="35" fill="none" stroke="#00F0FF" strokeWidth="2" strokeDasharray="12 8" />

        {/* 3 Brazos radiales dorados de la turbina */}
        <path d="M 210 102 L 305 108 L 300 118 L 200 114 Z" fill="url(#reactorGoldRim)" stroke="#78350F" strokeWidth="1.5" />
        <path d="M 470 102 L 375 108 L 380 118 L 480 114 Z" fill="url(#reactorGoldRim)" stroke="#78350F" strokeWidth="1.5" />
        <path d="M 332 142 L 335 116 L 345 116 L 348 142 Z" fill="url(#reactorGoldRim)" stroke="#78350F" strokeWidth="1.5" />

        {/* Núcleo central de la turbina */}
        <ellipse cx="340" cy="108" rx="46" ry="16" fill="url(#reactorGoldRim)" stroke="#FEF08A" strokeWidth="2" />
        <ellipse cx="340" cy="105" rx="28" ry="9" fill="url(#reactorCyanCore)" />

        {/* Segmentos luminosos cian en el borde frontal */}
        <rect x="208" y="136" width="22" height="10" rx="3" transform="rotate(14 208 136)" fill="#00F0FF" />
        <rect x="450" y="136" width="22" height="10" rx="3" transform="rotate(-14 450 136)" fill="#00F0FF" />
      </svg>

      {/* 4 Ranuras Luminosas Cian en el arco superior del reactor */}
      {slots.map((valor, idx) => {
        const cfg = posRanuras[idx % 4];
        return (
          <div
            key={idx}
            onClick={() => onSlotClick?.(idx)}
            style={{
              left: cfg.left,
              top: cfg.top,
              transform: `translate(-50%, 0) rotate(${cfg.rot}deg)`,
            }}
            className={`absolute flex flex-col items-center ${
              valor && onSlotClick ? 'cursor-pointer' : ''
            }`}
          >
            {/* Haz de luz cian proyectado hacia arriba */}
            <div
              className="pointer-events-none absolute -top-12 w-16 sm:w-20 h-14 opacity-60"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(0,240,255,0.25) 60%, rgba(0,240,255,0.75) 100%)',
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
              }}
            />
            <div
              className="w-16 sm:w-22 h-9 sm:h-11 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: valor
                  ? 'linear-gradient(180deg, #FEF08A 0%, #F59E0B 100%)'
                  : 'linear-gradient(180deg, #A5F3FC 0%, #00F0FF 100%)',
                border: '2.5px solid #E0F2FE',
                boxShadow: valor
                  ? '0 0 20px rgba(251, 191, 36, 0.85), inset 0 0 10px #FFFFFF'
                  : '0 0 18px rgba(0, 240, 255, 0.8), inset 0 0 10px #FFFFFF',
              }}
            >
              <span className="font-black text-xs sm:text-base text-[#082F49] tracking-tight">
                {valor ?? ''}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════ TARJETA 1: REACTOR DE PROPULSIÓN / CÁMARA DE CÁLCULO (IMAGEN 3) ════════════════════════ */

interface ModalReactorProps {
  modo: 'secuencia' | 'pregunta';
  estrellas: number;
  nucleosActivos: number;
  // Para modo secuencia
  secuencia?: number[];
  seleccionSecuencia?: number[];
  estadoSecuencia?: 'idle' | 'correct' | 'incorrect';
  onToggleNumeroSecuencia?: (num: number) => void;
  onConfirmarSecuencia?: () => void;
  // Para modo pregunta
  pregunta?: PreguntaMatematica;
  opcionSeleccionada?: number | null;
  estadoPregunta?: 'idle' | 'correct' | 'incorrect';
  onSeleccionarOpcion?: (idx: number) => void;
  onConfirmarPregunta?: () => void;
}

export function ModalReactorCuantico({
  modo,
  estrellas,
  nucleosActivos,
  secuencia = [],
  seleccionSecuencia = [],
  estadoSecuencia = 'idle',
  onToggleNumeroSecuencia,
  onConfirmarSecuencia,
  pregunta,
  opcionSeleccionada = null,
  estadoPregunta = 'idle',
  onSeleccionarOpcion,
  onConfirmarPregunta,
}: ModalReactorProps) {
  const [mostrarPista, setMostrarPista] = useState(false);

  const esSecuencia = modo === 'secuencia';
  const estadoActual = esSecuencia ? estadoSecuencia : estadoPregunta;

  const textoPista = esSecuencia
    ? 'Compara las decenas de cada cubo y colócalos del número más pequeño al más grande.'
    : pregunta?.pista ?? pregunta?.explicacionBreve ?? 'Descompón los números en decenas y unidades para calcular con facilidad.';

  const ranurasReactor: (string | null)[] = esSecuencia
    ? [0, 1, 2, 3].map((i) => (seleccionSecuencia[i] !== undefined ? String(seleccionSecuencia[i]) : null))
    : [0, 1, 2, 3].map((i) =>
        opcionSeleccionada === i && pregunta ? pregunta.opciones[i] : null,
      );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 45%, rgba(12, 36, 68, 0.95) 0%, rgba(6, 19, 38, 0.98) 70%, rgba(3, 10, 22, 0.99) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Ornamentos de las 4 esquinas exteriores */}
      <div className="pointer-events-none hidden md:flex fixed top-3 left-3 items-center gap-2">
        <div className="w-11 h-11 rounded-full bg-[#0C2D4D]/80 border-2 border-[#00F0FF] flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          ✦
        </div>
        <div className="w-28 h-1 rounded-full bg-gradient-to-r from-[#00F0FF] to-transparent" />
      </div>
      <div className="pointer-events-none hidden md:flex fixed top-3 right-3 items-center gap-2">
        <div className="w-28 h-1 rounded-full bg-gradient-to-l from-[#00F0FF] to-transparent" />
        <div className="w-11 h-11 rounded-full bg-[#0C2D4D]/80 border-2 border-[#00F0FF] flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          📐
        </div>
      </div>
      <div className="pointer-events-none hidden md:flex fixed bottom-3 left-3 items-center gap-2 bg-[#0A1E38]/90 border-2 border-[#00F0FF]/70 rounded-full px-3 py-1.5 shadow-lg">
        <span className="w-7 h-7 rounded-full bg-amber-400/25 border border-amber-300 flex items-center justify-center text-amber-300 text-sm">
          ⚡
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className="w-2.5 h-3.5 rounded-xs"
              style={{
                background: i < 4 ? '#FB923C' : i < 7 ? '#FACC15' : '#00F0FF',
              }}
            />
          ))}
        </div>
      </div>
      <div className="pointer-events-none hidden md:flex fixed bottom-3 right-3 items-center gap-2">
        <div className="w-28 h-1 rounded-full bg-gradient-to-l from-[#00F0FF] to-transparent" />
        <div className="w-11 h-11 rounded-full bg-[#0C2D4D]/80 border-2 border-[#00F0FF] flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          ✺
        </div>
      </div>

      <div className="relative flex items-center justify-center w-full max-w-[960px] my-auto">
        <motion.div
          initial={{ scale: 0.92, y: 14, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="relative w-full max-w-[850px] rounded-[24px] p-[14px] sm:p-[18px] shadow-[0_0_70px_rgba(0,229,255,0.28)]"
          style={{
            background: 'linear-gradient(180deg, #164E78 0%, #0C2D4A 50%, #09223A 100%)',
            border: '2.5px solid #00F0FF',
          }}
        >
          {/* Esfera Armilar Dorada en la esquina superior izquierda (Imagen 3) */}
          <div className="hidden sm:block absolute -top-9 -left-9 z-40 pointer-events-none">
            <EsferaArmilarEsquina />
          </div>

          {/* Esquinero geométrico dorado arriba a la derecha (Imagen 3) */}
          <div
            className="hidden sm:flex absolute -top-2 -right-2 w-14 h-14 z-30 rounded-tr-xl border-t-4 border-r-4 border-[#FBBF24] pointer-events-none items-start justify-end p-1.5"
            style={{ background: 'linear-gradient(225deg, rgba(245,158,11,0.35), transparent 70%)' }}
          >
            <div className="w-4 h-4 rotate-45 bg-[#FDE68A] border border-[#92400E]" />
          </div>

          {/* Placa de Título Superior */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-[560px]">
            <div
              className="relative px-5 py-2 sm:py-2.5 rounded-2xl flex items-center justify-center shadow-[0_8px_28px_rgba(0,0,0,0.65)]"
              style={{
                background: 'linear-gradient(180deg, #FDE68A 0%, #D97706 55%, #92400E 100%)',
                border: '2px solid #FEF08A',
              }}
            >
              <div className="hidden sm:flex absolute -left-3 w-7 h-7 rotate-45 bg-[#FDE68A] border-2 border-[#78350F] items-center justify-center">
                <div className="w-3.5 h-3.5 bg-[#00F0FF]" />
              </div>
              <div className="hidden sm:flex absolute -right-3 w-7 h-7 rotate-45 bg-[#FDE68A] border-2 border-[#78350F] items-center justify-center">
                <div className="w-3.5 h-3.5 bg-[#00F0FF]" />
              </div>

              <div
                className="w-full py-1.5 px-4 rounded-xl text-center"
                style={{
                  background: 'linear-gradient(180deg, #0D3559 0%, #082038 100%)',
                  border: '1.5px solid #00F0FF',
                }}
              >
                <h2 className="text-sm sm:text-lg md:text-xl font-black tracking-wider text-[#BAE6FD] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
                  {esSecuencia ? 'REACTOR DE PROPULSIÓN CUÁNTICA' : 'CÁMARA DE CÁLCULO CUÁNTICO'}
                </h2>
              </div>
            </div>
          </div>

          {/* Interior de Cristal Zafiro Oscuro */}
          <div
            className="relative rounded-[18px] pt-10 pb-10 px-4 sm:px-8 min-h-[470px] sm:min-h-[510px] flex flex-col justify-between overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at 50% 60%, #103156 0%, #091E38 60%, #061325 100%)',
              border: '2px solid #00E5FF',
              boxShadow: 'inset 0 0 60px rgba(0, 229, 255, 0.16)',
            }}
          >
            {/* Barras verticales de telemetría a izquierda y derecha */}
            <div className="pointer-events-none hidden sm:flex absolute left-3 top-36 bottom-28 w-3 flex-col justify-end gap-1 p-0.5 rounded bg-[#07192E] border border-[#00E5FF]/40">
              {Array.from({ length: 8 }, (_, i) => (
                <span
                  key={i}
                  className="w-full h-2.5 rounded-xs"
                  style={{ background: i < 4 ? '#FBBF24' : '#34D399' }}
                />
              ))}
            </div>
            <div className="pointer-events-none hidden sm:flex absolute right-3 top-36 bottom-28 w-3 flex-col justify-end gap-1 p-0.5 rounded bg-[#07192E] border border-[#00E5FF]/40">
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className="w-full h-2 rounded-xs"
                  style={{ background: i < 5 ? '#FB923C' : '#6EE7B7' }}
                />
              ))}
            </div>

            {/* Cabecera interna: Energía, Telemetría y Estrellas */}
            <div className="relative z-20 flex items-start justify-between gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-[#0C2542]/90 border border-[#00F0FF]/50 rounded-full px-3 py-1">
                  <span className="w-6 h-6 rounded-full bg-amber-400/25 border border-amber-300 flex items-center justify-center text-amber-300 text-xs font-bold">
                    ⚡
                  </span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} className="w-2.5 h-3.5 rounded-xs bg-[#FBBF24] shadow-[0_0_6px_#FBBF24]" />
                    ))}
                  </div>
                </div>
                {/* Mini panel de telemetría izquierdo */}
                <div className="hidden sm:flex flex-col gap-1 p-2 rounded-lg bg-[#081C34]/85 border border-[#00F0FF]/40 w-36">
                  <div className="h-1.5 w-20 rounded bg-[#00F0FF]" />
                  <div className="h-1.5 w-28 rounded bg-[#38BDF8]/70" />
                  <div className="h-1.5 w-16 rounded bg-[#00F0FF]/60" />
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMostrarPista((v) => !v)}
                    className="lg:hidden px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-300 text-xs font-black text-cyan-100 cursor-pointer"
                  >
                    💡 PISTA
                  </button>
                  <div className="flex items-center gap-1.5 bg-[#0C2542]/90 border border-[#00F0FF]/50 rounded-full px-3.5 py-1">
                    <span className="text-amber-300 text-sm">★</span>
                    <span className="text-xs sm:text-sm font-black text-white">
                      {nucleosActivos}/4
                    </span>
                  </div>
                </div>
                {/* Mini gráfico de barras derecho */}
                <div className="hidden sm:flex items-end gap-1 p-2 rounded-lg bg-[#081C34]/85 border border-[#00F0FF]/40 w-36 h-11 justify-between">
                  {[40, 75, 55, 90, 65, 95, 50, 80].map((h, i) => (
                    <span
                      key={i}
                      className="w-2 rounded-t bg-[#00F0FF]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Consigna / Enunciado */}
            <div className="relative z-20 text-center my-2 px-2">
              {esSecuencia ? (
                <>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-cyan-300 mb-1">
                    Secuencia de Propulsión · Ordena de Menor a Mayor
                  </p>
                  <h3 className="text-lg sm:text-2xl font-black text-white drop-shadow">
                    Calcula y encaja la energía:
                  </h3>
                </>
              ) : (
                <div className="max-w-xl mx-auto px-5 py-3 rounded-2xl bg-[#0A2542]/90 border-2 border-[#00F0FF]/70 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
                  <p className="text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-1">
                    🛰️ Reto de Cálculo Cuántico {pregunta?.operador ? `(${pregunta.operador})` : ''}
                  </p>
                  <h3 className="text-base sm:text-xl font-extrabold text-white leading-snug">
                    {pregunta?.enunciado}
                  </h3>
                </div>
              )}
            </div>

            {/* Pista Cuántica Desplegable */}
            <AnimatePresence>
              {mostrarPista && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="relative z-30 mx-auto my-1 max-w-xl rounded-xl px-4 py-2 bg-[#082F49] border-2 border-[#00F0FF] text-cyan-100 text-xs sm:text-sm font-bold text-center shadow-lg"
                >
                  💡 <strong>Pista Cuántica:</strong> {textoPista}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 4 CUBOS CUÁNTICOS TRASLÚCIDOS FLOTANTES */}
            <div className="relative z-20 flex flex-wrap items-center justify-center gap-3 sm:gap-6 my-2">
              {esSecuencia &&
                secuencia.map((num, idx) => {
                  const yaElegido = seleccionSecuencia.includes(num);
                  const inclinaciones = [-8, -2, 3, 9];
                  return (
                    <CuboCuantico3D
                      key={num}
                      texto={String(num)}
                      seleccionado={yaElegido}
                      estado={
                        estadoSecuencia === 'correct'
                          ? 'correcto'
                          : estadoSecuencia === 'incorrect' && yaElegido
                            ? 'error'
                            : 'normal'
                      }
                      inclinacion={inclinaciones[idx % 4]}
                      onClick={() => onToggleNumeroSecuencia?.(num)}
                      disabled={estadoSecuencia !== 'idle'}
                    />
                  );
                })}

              {!esSecuencia &&
                pregunta?.opciones.map((opt, idx) => {
                  const elegida = opcionSeleccionada === idx;
                  const esCorrecta = idx === pregunta.indiceRespuestaCorrecta;
                  const inclinaciones = [-7, -2, 2, 7];
                  return (
                    <CuboCuantico3D
                      key={idx}
                      texto={opt}
                      seleccionado={elegida}
                      estado={
                        estadoPregunta === 'idle'
                          ? 'normal'
                          : esCorrecta
                            ? 'correcto'
                            : elegida
                              ? 'error'
                              : 'normal'
                      }
                      inclinacion={inclinaciones[idx % 4]}
                      onClick={() => onSeleccionarOpcion?.(idx)}
                      disabled={estadoPregunta !== 'idle'}
                    />
                  );
                })}
            </div>

            {/* BASE DEL REACTOR CIRCULAR CON LAS 4 RANURAS CIAN */}
            <div className="relative z-10 -mb-4">
              <BaseReactorCuantico
                ranuras={ranurasReactor}
                onSlotClick={(slotIdx) => {
                  if (esSecuencia && seleccionSecuencia[slotIdx] !== undefined) {
                    onToggleNumeroSecuencia?.(seleccionSecuencia[slotIdx]);
                  }
                }}
              />
            </div>

            {/* Mensaje de Retroalimentación / Explicación */}
            <AnimatePresence>
              {estadoActual !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`relative z-30 mt-2 mx-auto max-w-2xl rounded-2xl px-4 py-2.5 border-2 text-xs sm:text-sm font-bold text-center shadow-xl ${
                    estadoActual === 'correct'
                      ? 'bg-emerald-950/95 border-emerald-400 text-emerald-100'
                      : 'bg-rose-950/95 border-rose-400 text-rose-100'
                  }`}
                >
                  {esSecuencia ? (
                    estadoSecuencia === 'correct' ? (
                      <span>
                        🚀 <strong>¡PROPULSIÓN CUÁNTICA ACTIVADA!</strong> Orden correcto de menor a
                        mayor ({[...secuencia].sort((a, b) => a - b).join(' → ')}). ¡Avanzas +2
                        casillas y activas un Núcleo Cuántico!
                      </span>
                    ) : (
                      <span>
                        ⚠️ <strong>Secuencia descalibrada.</strong> El orden correcto de menor a
                        mayor era: {[...secuencia].sort((a, b) => a - b).join(' → ')}.
                      </span>
                    )
                  ) : estadoPregunta === 'correct' ? (
                    <span>
                      ✨ <strong>¡CÁLCULO EXACTO (+1 ⭐)!</strong> {pregunta?.explicacionBreve}
                    </span>
                  ) : (
                    <span>
                      ⚠️ <strong>Sistema descalibrado:</strong> {pregunta?.explicacionBreve}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botón Inferior Dorado Hexagonal */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={esSecuencia ? onConfirmarSecuencia : onConfirmarPregunta}
              className="px-8 sm:px-11 py-3 rounded-2xl font-black text-sm sm:text-base tracking-wider text-[#0F172A] uppercase cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
              style={{
                background:
                  estadoActual !== 'idle'
                    ? 'linear-gradient(180deg, #6EE7B7 0%, #10B981 55%, #047857 100%)'
                    : 'linear-gradient(180deg, #FEF08A 0%, #F59E0B 50%, #B45309 100%)',
                border: '2.5px solid #00F0FF',
                boxShadow: '0 4px 0 #78350F, 0 0 20px rgba(245,158,11,0.45)',
              }}
            >
              {estadoActual !== 'idle'
                ? 'CONTINUAR ✦'
                : esSecuencia
                  ? 'ACTIVAR PROPULSIÓN'
                  : 'COMPROBAR CÁLCULO'}
            </motion.button>
          </div>
        </motion.div>

        <BotonPistaCuantica onClick={() => setMostrarPista((v) => !v)} />
      </div>
    </motion.div>
  );
}

/* ════════════════════════ TARJETA 2: ALERTA DE IMPACTO — ESCUDO ANTIMATERIA (IMAGEN 2) ════════════════════════ */

export interface CondicionAsteroide {
  etiqueta: string; // "PAR" | "IMPAR" | "MÚLTIPLO DE 3" | "MÚLTIPLO DE 5"
  explicacion: string;
  cumple: (n: number) => boolean;
}

interface ModalAlertaImpactoProps {
  asteroides: number[];
  condicion: CondicionAsteroide;
  seleccionadoIdx: number | null;
  estado: 'idle' | 'correct' | 'incorrect';
  onDisparar: (idx: number) => void;
  onCerrar: () => void;
}

/** Asteroide Espacial 3D con cristales bioluminiscentes incrustados y mira táctica [ ] (fiel a Imagen 2). */
function AsteroideCristalSVG({
  numero,
  variante,
  seleccionado,
  estado,
  esCorrecto,
  onClick,
  disabled,
}: {
  numero: number;
  variante: 'cian' | 'magenta' | 'ambar';
  seleccionado: boolean;
  estado: 'idle' | 'correct' | 'incorrect';
  esCorrecto: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  const cfg = {
    cian: {
      c1: '#00F0FF',
      c2: '#0284C7',
      glow: 'rgba(0, 240, 255, 0.75)',
      bracket: '#FDE047',
    },
    magenta: {
      c1: '#E879F9',
      c2: '#9333EA',
      glow: 'rgba(232, 121, 249, 0.7)',
      bracket: '#38BDF8',
    },
    ambar: {
      c1: '#FBBF24',
      c2: '#D97706',
      glow: 'rgba(251, 191, 36, 0.7)',
      bracket: '#38BDF8',
    },
  }[variante];

  const colorMira =
    estado !== 'idle' && esCorrecto
      ? '#00FF88'
      : estado === 'incorrect' && seleccionado
        ? '#EF4444'
        : seleccionado
          ? '#FDE047'
          : cfg.bracket;

  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.07 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center select-none focus:outline-none ${
        disabled ? 'cursor-default' : 'cursor-crosshair'
      }`}
      style={{
        filter: `drop-shadow(0 0 18px ${cfg.glow})`,
      }}
    >
      <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
        {/* Mira táctica [ ] en las 4 esquinas */}
        <g stroke={colorMira} strokeWidth="3.2" fill="none" strokeLinecap="round">
          <path d="M 18 36 V 18 H 36" />
          <path d="M 142 36 V 18 H 124" />
          <path d="M 18 124 V 142 H 36" />
          <path d="M 142 124 V 142 H 124" />
        </g>

        {/* Cuerpo rocoso 3D del asteroide */}
        <polygon
          points="80,16 122,28 144,66 134,114 96,142 52,138 20,108 18,58 44,24"
          fill="#263248"
          stroke="#64748B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Facetas de sombra de la roca */}
        <polygon points="80,16 122,28 106,58 64,46" fill="#3B4A68" />
        <polygon points="20,108 52,138 96,142 134,114 102,94 48,96" fill="#172033" />

        {/* Cristales bioluminiscentes incrustados en el asteroide */}
        <polygon points="80,26 98,52 80,66 62,52" fill={cfg.c1} stroke="#FFFFFF" strokeWidth="1.2" />
        <polygon points="44,58 68,72 54,98 34,82" fill={cfg.c2} stroke={cfg.c1} strokeWidth="1.2" />
        <polygon points="116,60 126,88 102,98 92,72" fill={cfg.c1} stroke="#FFFFFF" strokeWidth="1.2" />
        <polygon points="78,96 98,118 76,130 58,114" fill={cfg.c1} stroke="#FFFFFF" strokeWidth="1.2" />

        {/* Placa central y número grande del asteroide */}
        <circle cx="80" cy="82" r="34" fill="#0F172A" fillOpacity="0.68" stroke={cfg.c1} strokeWidth="1.8" />
        <text
          x="80"
          y="83"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="40"
          fontWeight="900"
          fill="#FEF3C7"
          stroke="#451A03"
          strokeWidth="1.5"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.9))',
          }}
        >
          {numero}
        </text>
      </svg>
    </motion.button>
  );
}

/** Torreta / Cañón Deflector de Escudo Antimateria en cian y dorado (fiel a Imagen 2). */
function TorretaAntimateriaSVG({ angulo }: { angulo: number }) {
  return (
    <div className="relative w-44 h-32 flex items-center justify-center select-none pointer-events-none">
      <svg viewBox="0 0 180 130" className="w-full h-full overflow-visible">
        {/* Base circular anclada */}
        <ellipse cx="90" cy="112" rx="54" ry="14" fill="#0E3A5F" stroke="#00F0FF" strokeWidth="2.2" />
        <ellipse cx="90" cy="106" rx="40" ry="10" fill="#D97706" stroke="#FEF08A" strokeWidth="1.8" />

        {/* Cuerpo giratorio del cañón */}
        <g transform={`translate(90 96) rotate(${angulo})`}>
          {/* Tubos laterales de plasma cian */}
          <path
            d="M -26 -6 C -46 -12, -46 16, -22 12"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 26 -6 C 46 -12, 46 16, 22 12"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Chasis central azul y dorado */}
          <rect x="-24" y="-26" width="48" height="38" rx="8" fill="#0284C7" stroke="#E0F2FE" strokeWidth="2" />
          <rect x="-16" y="-20" width="32" height="24" rx="4" fill="#D97706" stroke="#FEF08A" strokeWidth="1.5" />

          {/* Cañón anillado apuntando hacia arriba */}
          {[-34, -44, -54, -64].map((ky, i) => (
            <rect
              key={i}
              x={-14 + i * 1.5}
              y={ky}
              width={28 - i * 3}
              height="7"
              rx="2.5"
              fill={i % 2 === 0 ? '#F59E0B' : '#38BDF8'}
              stroke="#0F172A"
              strokeWidth="1.2"
            />
          ))}
          {/* Punta emisora láser */}
          <circle cx="0" cy="-72" r="7" fill="#E0F2FE" stroke="#00F0FF" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export function ModalAlertaImpacto({
  asteroides,
  condicion,
  seleccionadoIdx,
  estado,
  onDisparar,
  onCerrar,
}: ModalAlertaImpactoProps) {
  const angulos = [-34, 0, 34];
  const anguloTorreta = seleccionadoIdx !== null ? angulos[seleccionadoIdx] ?? 0 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 45%, rgba(15, 32, 58, 0.95) 0%, rgba(7, 16, 32, 0.98) 75%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full max-w-[850px] rounded-[24px] p-[14px] sm:p-[18px] shadow-[0_0_80px_rgba(0,229,255,0.3)] my-auto"
        style={{
          background: 'linear-gradient(180deg, #1E3A5F 0%, #0F2440 50%, #09172B 100%)',
          border: '3px solid #F59E0B',
          boxShadow: '0 0 35px rgba(0, 240, 255, 0.35), inset 0 0 20px rgba(245, 158, 11, 0.25)',
        }}
      >
        {/* Placas metálicas atornilladas en las 4 esquinas (fiel a Imagen 2) */}
        {[
          'top-2 left-2',
          'top-2 right-2',
          'bottom-2 left-2',
          'bottom-2 right-2',
        ].map((pos, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute ${pos} w-7 h-7 rounded-md bg-slate-400 border-2 border-slate-700 flex items-center justify-center shadow`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          </div>
        ))}

        {/* Placa Superior "⚠️ ALERTA DE IMPACTO - ESCUDO ANTIMATERIA" */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-[620px]">
          <div
            className="px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.75)]"
            style={{
              background: 'linear-gradient(180deg, #163256 0%, #0B1D36 100%)',
              border: '2.5px solid #F59E0B',
            }}
          >
            <span className="text-xl sm:text-2xl">⚠️</span>
            <h2 className="text-xs sm:text-base md:text-lg font-black tracking-wider uppercase">
              <span className="text-[#FB923C]">ALERTA DE IMPACTO</span>{' '}
              <span className="text-white">- ESCUDO ANTIMATERIA</span>
            </h2>
          </div>
        </div>

        {/* Interior de la Consola Táctica */}
        <div
          className="relative rounded-[18px] pt-10 pb-6 px-4 sm:px-8 min-h-[460px] sm:min-h-[500px] flex flex-col justify-between overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at 50% 54%, #103358 0%, #081C34 62%, #051122 100%)',
            border: '2px solid #F59E0B',
          }}
        >
          {/* Radar Circular Holográfico en el fondo central */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-35">
            <div className="w-[300px] h-[300px] rounded-full border-2 border-[#00F0FF] flex items-center justify-center">
              <div className="w-[210px] h-[210px] rounded-full border border-[#00F0FF] flex items-center justify-center">
                <div className="w-[120px] h-[120px] rounded-full border border-dashed border-[#00F0FF]" />
              </div>
            </div>
            <div className="absolute w-[340px] h-px bg-[#00F0FF]/60" />
            <div className="absolute h-[340px] w-px bg-[#00F0FF]/60" />
          </div>

          {/* Medidores circulares de telemetría en las esquinas (Imagen 2) */}
          <div className="relative z-20 flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-2 p-2 rounded-xl bg-[#071A30]/85 border border-[#00F0FF]/40">
              <div className="w-9 h-9 rounded-full border-2 border-[#00F0FF] flex items-center justify-center text-[10px] font-black text-cyan-300">
                78%
              </div>
              <div className="space-y-1">
                <div className="w-12 h-1.5 rounded bg-[#00F0FF]" />
                <div className="w-8 h-1.5 rounded bg-[#38BDF8]/60" />
              </div>
            </div>

            {/* Subtítulo dinámico con placa dorada brillante */}
            <div className="mx-auto text-center max-w-xl px-2">
              <p className="text-sm sm:text-xl font-extrabold text-white leading-relaxed">
                ¡Dispara al asteroide con número{' '}
                <span
                  className="inline-block mx-1 px-3 py-0.5 rounded-xl font-black text-[#451A03] shadow-[0_0_18px_rgba(251,191,36,0.85)]"
                  style={{
                    background: 'linear-gradient(180deg, #FEF08A 0%, #F59E0B 100%)',
                    border: '2px solid #FFFFFF',
                  }}
                >
                  {condicion.etiqueta}
                </span>{' '}
                para activar el escudo antimateria!
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 p-2 rounded-xl bg-[#071A30]/85 border border-[#00F0FF]/40">
              <div className="w-9 h-9 rounded-full border-2 border-[#FBBF24] flex items-center justify-center text-[10px] font-black text-amber-300">
                RAD
              </div>
            </div>
          </div>

          {/* 3 ASTEROIDES CRISTALINOS 3D */}
          <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 sm:gap-8 my-2">
            {asteroides.map((num, idx) => {
              const variantes: ('cian' | 'magenta' | 'ambar')[] = ['cian', 'magenta', 'ambar'];
              return (
                <AsteroideCristalSVG
                  key={idx}
                  numero={num}
                  variante={variantes[idx % 3]}
                  seleccionado={seleccionadoIdx === idx}
                  estado={estado}
                  esCorrecto={condicion.cumple(num)}
                  onClick={() => onDisparar(idx)}
                  disabled={estado !== 'idle'}
                />
              );
            })}
          </div>

          {/* Cañón Deflector + Rayo Láser Cian Animado */}
          <div className="relative z-20 flex flex-col items-center -mb-2">
            {/* Rayo láser al disparar */}
            <AnimatePresence>
              {seleccionadoIdx !== null && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    transformOrigin: 'bottom center',
                    rotate: `${anguloTorreta}deg`,
                  }}
                  className="pointer-events-none absolute bottom-24 w-2.5 h-36 rounded-full bg-white shadow-[0_0_20px_#00F0FF,0_0_40px_#00F0FF]"
                />
              )}
            </AnimatePresence>

            <TorretaAntimateriaSVG angulo={anguloTorreta} />
          </div>

          {/* Retroalimentación del disparo */}
          <AnimatePresence>
            {estado !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative z-30 mt-2 mx-auto max-w-xl rounded-2xl px-5 py-3 border-2 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl ${
                  estado === 'correct'
                    ? 'bg-emerald-950/95 border-emerald-400 text-emerald-100'
                    : 'bg-rose-950/95 border-rose-400 text-rose-100'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold text-center sm:text-left">
                  {estado === 'correct' ? (
                    <span>
                      🛡️ <strong>¡ESCUDO ANTIMATERIA ACTIVADO (+1 ⭐)!</strong> {condicion.explicacion}
                    </span>
                  ) : (
                    <span>
                      💥 <strong>¡IMPACTO EN EL ESCUDO!</strong> Retrocedes 2 casillas.{' '}
                      {condicion.explicacion}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onCerrar}
                  className="shrink-0 px-5 py-2 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-b from-[#FEF08A] to-[#F59E0B] text-[#0F172A] border border-white cursor-pointer"
                >
                  CONTINUAR ✦
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════ TARJETA 3: GUARDIÁN DEL NIVEL — NÚCLEO ARMILAR (IMAGEN 4) ════════════════════════ */

interface ModalGuardianArmilarProps {
  reto: RetoArmilarBoss;
  faseActual: 1 | 2 | 3; // 1, 2 o 3
  nucleos: boolean[];
  estrellas: number;
  opcionElegida: number | null;
  estado: 'idle' | 'correct' | 'incorrect';
  onElegirOpcion: (idx: number) => void;
  onAlinearAnillo: () => void;
}

export function ModalGuardianArmilar({
  reto,
  faseActual,
  nucleos,
  estrellas,
  opcionElegida,
  estado,
  onElegirOpcion,
  onAlinearAnillo,
}: ModalGuardianArmilarProps) {
  const [mostrarPista, setMostrarPista] = useState(false);

  const ranurasBoss: (string | null)[] = [0, 1, 2].map((i) =>
    opcionElegida === i ? reto.opciones[i] : null,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 45%, rgba(12, 36, 68, 0.96) 0%, rgba(5, 15, 32, 0.99) 75%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="relative flex items-center justify-center w-full max-w-[960px] my-auto">
        <motion.div
          initial={{ scale: 0.92, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="relative w-full max-w-[860px] rounded-[24px] p-[14px] sm:p-[18px] shadow-[0_0_80px_rgba(0,240,255,0.32)]"
          style={{
            background: 'linear-gradient(180deg, #164E78 0%, #0C2D4A 50%, #09223A 100%)',
            border: '2.5px solid #00F0FF',
          }}
        >
          {/* Esfera Armilar en la esquina superior izquierda */}
          <div className="hidden sm:block absolute -top-9 -left-9 z-40 pointer-events-none">
            <EsferaArmilarEsquina />
          </div>

          {/* Cabecera "GUARDIÁN DEL NIVEL - NÚCLEO ARMILAR" */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-[580px]">
            <div
              className="relative px-5 py-2 sm:py-2.5 rounded-2xl flex items-center justify-center shadow-[0_8px_28px_rgba(0,0,0,0.7)]"
              style={{
                background: 'linear-gradient(180deg, #FDE68A 0%, #D97706 55%, #92400E 100%)',
                border: '2px solid #FEF08A',
              }}
            >
              <div
                className="w-full py-1.5 px-4 rounded-xl text-center"
                style={{
                  background: 'linear-gradient(180deg, #0D3559 0%, #082038 100%)',
                  border: '1.5px solid #00F0FF',
                }}
              >
                <h2 className="text-xs sm:text-lg md:text-xl font-black tracking-wider text-[#BAE6FD]">
                  GUARDIÁN DEL NIVEL - NÚCLEO ARMILAR
                </h2>
              </div>
            </div>
          </div>

          {/* Interior del Gran Reactor Armilar */}
          <div
            className="relative rounded-[18px] pt-9 pb-10 px-4 sm:px-8 min-h-[490px] sm:min-h-[530px] flex flex-col justify-between overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at 54% 48%, #143C68 0%, #091E38 62%, #051224 100%)',
              border: '2px solid #00E5FF',
            }}
          >
            {/* Fila Superior: 4 Núcleos Cuánticos a la izq, Barra SELLOS ARMILARES al centro, Estrellas a la der */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-2">
              {/* Los 4 Núcleos Cuánticos recolectados (+, −, ×, ÷) */}
              <div className="flex items-center gap-1.5">
                {(['+', '−', '×', '÷'] as const).map((op, i) => {
                  const activo = nucleos[i] ?? true;
                  return (
                    <div
                      key={op}
                      className="w-9 h-9 rounded-full flex items-center justify-center font-black text-base shadow-md"
                      style={{
                        background: activo
                          ? 'radial-gradient(circle, #0E486E 0%, #08263E 100%)'
                          : 'rgba(15,23,42,0.6)',
                        border: activo ? '2px solid #FBBF24' : '1.5px solid #475569',
                        color: activo ? '#FEF08A' : '#64748B',
                        boxShadow: activo ? '0 0 12px rgba(251,191,36,0.5)' : 'none',
                      }}
                    >
                      {op}
                    </div>
                  );
                })}
              </div>

              {/* Barra Central: SELLOS ARMILARES: FASE X/3 */}
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-[#0A223D] border-2 border-[#38BDF8]/70 shadow-md">
                <div className="w-16 sm:w-24 h-3.5 rounded-full bg-[#061527] border border-amber-300/60 p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FEF08A] transition-all duration-500"
                    style={{ width: `${(faseActual / 3) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-black tracking-wider text-cyan-100 uppercase">
                  SELLOS ARMILARES: FASE {faseActual}/3
                </span>
              </div>

              {/* Estrellas y Pista móvil */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarPista((v) => !v)}
                  className="lg:hidden px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-300 text-xs font-black text-cyan-100"
                >
                  💡 PISTA
                </button>
                <div className="flex items-center gap-1.5 bg-[#0C2542]/90 border border-[#00F0FF]/50 rounded-full px-3.5 py-1">
                  <span className="text-amber-300 text-sm">★</span>
                  <span className="text-xs sm:text-sm font-black text-white">4/4</span>
                </div>
              </div>
            </div>

            {/* Pista Cuántica Desplegable */}
            <AnimatePresence>
              {mostrarPista && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="relative z-30 mx-auto mt-2 max-w-xl rounded-xl px-4 py-2 bg-[#082F49] border-2 border-[#00F0FF] text-cyan-100 text-xs sm:text-sm font-bold text-center shadow-lg"
                >
                  💡 <strong>Pista Cuántica:</strong> {reto.pista}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zona Central: Visor Holográfico del Problema a la Izquierda + Gran Esfera Armilar Dorada al Centro */}
            <div className="relative z-20 grid grid-cols-1 md:grid-cols-12 items-center gap-4 my-2">
              {/* Panel Holográfico Izquierdo con el Problema Matemático (Imagen 4) */}
              <div className="md:col-span-5 bg-[#0A2A4A]/85 border-2 border-[#00F0FF] rounded-2xl p-4 shadow-[0_0_25px_rgba(0,240,255,0.28)]">
                <span className="inline-block text-[10px] font-black uppercase tracking-widest text-cyan-300 mb-1">
                  ◈ Anillo Armilar #{faseActual}
                </span>
                <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {reto.enunciado}
                </p>
              </div>

              {/* Gran Esfera Armilar Dorada en el Centro */}
              <div className="md:col-span-7 flex items-center justify-center">
                <svg width="230" height="210" viewBox="0 0 240 220" className="overflow-visible">
                  <defs>
                    <radialGradient id="bossCenterGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.55" />
                      <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="120" cy="110" r="95" fill="url(#bossCenterGlow)" />

                  <g transform="translate(120 110)">
                    {/* Anillo 1 (Exterior) */}
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0;360"
                        dur="18s"
                        repeatCount="indefinite"
                      />
                      <ellipse
                        rx="82"
                        ry="78"
                        fill="none"
                        stroke={faseActual > 1 || estado === 'correct' ? '#00F0FF' : 'url(#cornerGoldGrad)'}
                        strokeWidth="11"
                      />
                      <ellipse
                        rx="82"
                        ry="78"
                        fill="none"
                        stroke="#FEF08A"
                        strokeWidth="2"
                        strokeDasharray="6 8"
                      />
                    </g>

                    {/* Anillo 2 (Intermedio inclinado -32°) */}
                    <g transform="rotate(-32)">
                      <ellipse
                        rx="76"
                        ry="42"
                        fill="none"
                        stroke={faseActual > 2 ? '#00F0FF' : 'url(#cornerGoldGrad)'}
                        strokeWidth="10"
                      />
                      <ellipse
                        rx="76"
                        ry="42"
                        fill="none"
                        stroke="#78350F"
                        strokeWidth="1.6"
                        strokeDasharray="5 7"
                      />
                    </g>

                    {/* Anillo 3 (Interior inclinado +36°) */}
                    <g transform="rotate(36)">
                      <ellipse
                        rx="70"
                        ry="36"
                        fill="none"
                        stroke="url(#cornerGoldGrad)"
                        strokeWidth="9"
                      />
                    </g>

                    {/* Núcleo Cuántico Estelar */}
                    <circle r="28" fill="#0369A1" stroke="#00F0FF" strokeWidth="2.5" />
                    <circle r="18" fill="#38BDF8" opacity="0.7" />
                    <circle r="10" fill="#FEF08A" />
                    <circle r="4" fill="#FFFFFF" />
                  </g>
                </svg>
              </div>
            </div>

            {/* 3 Cubos Cuánticos de Respuesta sobre la Base del Reactor */}
            <div className="relative z-20 flex flex-col items-center">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 -mb-10 relative z-30">
                {reto.opciones.map((op, idx) => {
                  const elegida = opcionElegida === idx;
                  const esCorrecta = idx === reto.indiceCorrecto;
                  const inclinaciones = [-5, 0, 5];
                  return (
                    <CuboCuantico3D
                      key={op}
                      texto={op}
                      compacto
                      seleccionado={elegida}
                      estado={
                        estado === 'idle'
                          ? 'normal'
                          : esCorrecta
                            ? 'correcto'
                            : elegida
                              ? 'error'
                              : 'normal'
                      }
                      inclinacion={inclinaciones[idx % 3]}
                      onClick={() => onElegirOpcion(idx)}
                      disabled={estado !== 'idle'}
                    />
                  );
                })}
              </div>

              <div className="w-full -mb-4">
                <BaseReactorCuantico ranuras={[ranurasBoss[0], ranurasBoss[1], ranurasBoss[2], null]} />
              </div>
            </div>

            {/* Explicación de la fase del Guardián */}
            <AnimatePresence>
              {estado !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className={`relative z-30 mt-2 mx-auto max-w-2xl rounded-2xl px-4 py-2.5 border-2 text-xs sm:text-sm font-bold text-center shadow-xl ${
                    estado === 'correct'
                      ? 'bg-emerald-950/95 border-emerald-400 text-emerald-100'
                      : 'bg-rose-950/95 border-rose-400 text-rose-100'
                  }`}
                >
                  {estado === 'correct' ? (
                    <span>
                      ✨ <strong>¡Anillo Armilar #{faseActual} alineado!</strong> {reto.explicacion}
                    </span>
                  ) : (
                    <span>
                      ⚠️ <strong>Frecuencia incorrecta:</strong> {reto.explicacion}{' '}
                      <span className="text-amber-300">
                        (¡Intenta alinear este anillo con una nueva pregunta!)
                      </span>
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botón Inferior Dorado "ALINEAR ANILLO" */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onAlinearAnillo}
              className="px-9 sm:px-12 py-3 rounded-2xl font-black text-sm sm:text-base tracking-wider text-[#0F172A] uppercase cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.65)]"
              style={{
                background:
                  estado !== 'idle'
                    ? 'linear-gradient(180deg, #6EE7B7 0%, #10B981 55%, #047857 100%)'
                    : 'linear-gradient(180deg, #FEF08A 0%, #F59E0B 50%, #B45309 100%)',
                border: '2.5px solid #00F0FF',
                boxShadow: '0 4px 0 #78350F, 0 0 20px rgba(245,158,11,0.45)',
              }}
            >
              {estado === 'idle'
                ? 'ALINEAR ANILLO'
                : faseActual < 3 && estado === 'correct'
                  ? 'SIGUIENTE ANILLO ✦'
                  : estado === 'correct'
                    ? 'RESTAURAR NÚCLEO ✦'
                    : 'NUEVA PREGUNTA ↻'}
            </motion.button>
          </div>
        </motion.div>

        <BotonPistaCuantica onClick={() => setMostrarPista((v) => !v)} />
      </div>
    </motion.div>
  );
}

