'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

export interface NodoCubo {
  index: number; // 0..19
  numero: string; // "01".."20"
  x: number;
  y: number;
  tipo: 'normal' | 'especial' | 'trampa' | 'boss';
  opIzq: string;
  opDer: string;
}

export const ESPECIALES_IDX = [3, 7, 11, 15]; // Casillas 04, 08, 12, 16
export const TRAMPAS_IDX = [5, 9, 13]; // Casillas 06, 10, 14

const COORDS_S: { x: number; y: number; opIzq: string; opDer: string }[] = [
  // Tramo 1: Terraza Inferior (derecha a izquierda desde el Portal Cuántico)
  { x: 576, y: 548, opIzq: '01', opDer: '+' }, // 01
  { x: 500, y: 554, opIzq: '−', opDer: '÷' },  // 02
  { x: 422, y: 548, opIzq: '+', opDer: '×' },  // 03
  { x: 346, y: 534, opIzq: '×', opDer: '+' },  // 04 (Especial 1)
  { x: 274, y: 504, opIzq: '+', opDer: '÷' },  // 05
  { x: 230, y: 452, opIzq: '√', opDer: '∑' },  // 06 (Trampa 1)

  // Tramo 2: Cresta Diagonal Central Ascendente (izquierda a derecha)
  { x: 268, y: 394, opIzq: '+', opDer: '÷' },  // 07
  { x: 332, y: 356, opIzq: '+', opDer: '×' },  // 08 (Especial 2)
  { x: 396, y: 318, opIzq: '×', opDer: '−' },  // 09
  { x: 460, y: 280, opIzq: '√', opDer: '∑' },  // 10 (Trampa 2)
  { x: 522, y: 242, opIzq: 'π', opDer: '÷' },  // 11
  { x: 576, y: 202, opIzq: '×', opDer: '+' },  // 12 (Especial 3)
  { x: 604, y: 152, opIzq: '+', opDer: '−' },  // 13

  // Tramo 3: Cumbre Superior (derecha a izquierda hacia el Santuario Armilar, sin solapar la esfera)
  { x: 564, y: 108, opIzq: '√', opDer: '∑' },  // 14 (Trampa 3)
  { x: 500, y: 98, opIzq: 'π', opDer: '÷' },   // 15
  { x: 436, y: 104, opIzq: '×', opDer: '+' },  // 16 (Especial 4)
  { x: 374, y: 120, opIzq: '×', opDer: '÷' },  // 17
  { x: 318, y: 146, opIzq: '−', opDer: '+' },  // 18
  { x: 272, y: 178, opIzq: '+', opDer: '=' },  // 19
  { x: 184, y: 248, opIzq: '★', opDer: '★' },  // 20 (Guardián del Nivel)
];

export const NODOS_NUMERIX: NodoCubo[] = COORDS_S.map((c, idx) => {
  const tipo: NodoCubo['tipo'] =
    idx === 19
      ? 'boss'
      : ESPECIALES_IDX.includes(idx)
        ? 'especial'
        : TRAMPAS_IDX.includes(idx)
          ? 'trampa'
          : 'normal';
  return {
    index: idx,
    numero: String(idx + 1).padStart(2, '0'),
    x: c.x,
    y: c.y,
    tipo,
    opIzq: c.opIzq,
    opDer: c.opDer,
  };
});

/** Genera un path SVG suave Catmull-Rom que pasa por todos los nodos del riel. */
function construirPathRiel(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const PATH_RIEL = construirPathRiel(
  NODOS_NUMERIX.map((n) => ({ x: n.x, y: n.y + 8 })),
);

/** Ramillete de cristales bioluminiscentes sobre las terrazas de la montaña. */
function CristalesMontaña({
  x,
  y,
  escala = 1,
  variante = 'violeta',
}: {
  x: number;
  y: number;
  escala?: number;
  variante?: 'violeta' | 'ambar' | 'cian';
}) {
  const colores = {
    violeta: { a: '#E879F9', b: '#A855F7', c: '#FBBF24' },
    ambar: { a: '#FDE047', b: '#F59E0B', c: '#FB7185' },
    cian: { a: '#67E8F9', b: '#00E5FF', c: '#38BDF8' },
  }[variante];

  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <ellipse cx="0" cy="4" rx="20" ry="6" fill={colores.a} opacity="0.28" />
      <polygon
        points="-11,2 -16,-19 -6,-28 -1,-14 -2,2"
        fill={colores.b}
        stroke="#FFFFFF"
        strokeOpacity="0.65"
        strokeWidth="0.9"
      />
      <polygon
        points="-2,4 -4,-30 5,-39 10,-22 6,4"
        fill={colores.a}
        stroke="#FFFFFF"
        strokeOpacity="0.8"
        strokeWidth="1"
      />
      <polygon
        points="5,3 10,-17 18,-23 19,-10 12,3"
        fill={colores.c}
        stroke="#FFFFFF"
        strokeOpacity="0.65"
        strokeWidth="0.9"
      />
    </g>
  );
}

/** Portal de Cristal Cuántico detrás de la Casilla 01 (fiel a Imagen 1). */
function PortalInicio({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="18" rx="46" ry="18" fill="url(#portalFloorGlow)" />
      <polygon points="-36,16 -44,-8 -32,-18 -24,12" fill="#0284C7" stroke="#67E8F9" strokeWidth="1" />
      <polygon points="32,20 42,-4 30,-14 22,16" fill="#0369A1" stroke="#67E8F9" strokeWidth="1" />
      <polygon
        points="-26,18 -30,-42 0,-76 30,-42 26,18 14,22 16,-34 0,-54 -16,-34 -14,22"
        fill="url(#portalArchGrad)"
        stroke="#A5F3FC"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <polygon
        points="-15,16 -16,-34 0,-53 16,-34 15,16"
        fill="url(#portalEnergyGrad)"
        opacity="0.88"
      />
      <ellipse cx="0" cy="-14" rx="9" ry="22" fill="none" stroke="#E0F2FE" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.8">
        <animateTransform attributeName="transform" type="rotate" values="0 0 -14;360 0 -14" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="0" cy="-14" r="4" fill="#FFFFFF" opacity="0.9" />
    </g>
  );
}

/** Santuario del Guardián en la Casilla 20 con Altar Escalonado y Esfera Armilar Dorada. */
function SantuarioGuardian({
  x,
  y,
  activo,
  desbloqueado,
}: {
  x: number;
  y: number;
  activo: boolean;
  desbloqueado: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Halo de energía en la cima */}
      <ellipse cx="0" cy="16" rx="86" ry="36" fill="url(#bossHaloGrad)" />

      {/* Plataforma escalonada isométrica de cuarzo (3 peldaños) */}
      {[
        { dy: 22, w: 64, h: 28, d: 10, fillTop: '#38BDF8', fillLeft: '#0369A1', fillRight: '#075985' },
        { dy: 12, w: 50, h: 22, d: 10, fillTop: '#7DD3FC', fillLeft: '#0284C7', fillRight: '#0369A1' },
        { dy: 2, w: 36, h: 16, d: 9, fillTop: '#E0F2FE', fillLeft: '#38BDF8', fillRight: '#0284C7' },
      ].map((step, idx) => (
        <g key={idx} transform={`translate(0 ${step.dy})`}>
          <polygon
            points={`0,${-step.h} ${step.w},0 0,${step.h} ${-step.w},0`}
            fill={step.fillTop}
            fillOpacity="0.88"
            stroke="#A5F3FC"
            strokeWidth="1.2"
          />
          <polygon
            points={`${-step.w},0 0,${step.h} 0,${step.h + step.d} ${-step.w},${step.d}`}
            fill={step.fillLeft}
            stroke="#67E8F9"
            strokeWidth="1"
          />
          <polygon
            points={`${step.w},0 0,${step.h} 0,${step.h + step.d} ${step.w},${step.d}`}
            fill={step.fillRight}
            stroke="#67E8F9"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* Escalinatas luminosas */}
      {[-3, 1, 5, 9].map((ky, i) => (
        <line
          key={`st-l-${i}`}
          x1={-26 + i * 2}
          y1={12 + ky}
          x2={-11 + i * 2}
          y2={20 + ky}
          stroke="#E0F2FE"
          strokeWidth="1.6"
        />
      ))}
      {[-3, 1, 5, 9].map((ky, i) => (
        <line
          key={`st-r-${i}`}
          x1={26 - i * 2}
          y1={12 + ky}
          x2={11 - i * 2}
          y2={20 + ky}
          stroke="#E0F2FE"
          strokeWidth="1.6"
        />
      ))}

      {/* Pilares de cristal en las esquinas del altar */}
      <polygon points="-46,12 -50,-14 -42,-22 -38,10" fill="#67E8F9" stroke="#FFFFFF" strokeWidth="1" />
      <polygon points="0,32 -5,4 0,-6 5,4" fill="#A5F3FC" stroke="#FFFFFF" strokeWidth="1.1" />
      <polygon points="46,12 50,-14 42,-22 38,10" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />

      {/* Base circular dorada del reactor */}
      <ellipse cx="0" cy="-2" rx="26" ry="11" fill="#D97706" stroke="#FEF08A" strokeWidth="1.5" />
      <ellipse cx="0" cy="-4" rx="18" ry="7" fill="#FEF08A" opacity="0.88" />

      {/* Cono de luz dorado-cian ascendente */}
      <polygon
        points="-18,-4 -38,-72 38,-72 18,-4"
        fill="url(#armilarBeamGrad)"
        opacity="0.55"
      />

      {/* ── GRAN ESFERA ARMILAR DORADA ── */}
      <g transform="translate(0 -52)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 -50; 0 -56; 0 -50"
          dur="3.4s"
          repeatCount="indefinite"
        />
        <circle r="38" fill="url(#armilarCoreGlow)" opacity="0.65" />

        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0;360"
            dur={desbloqueado ? '12s' : '22s'}
            repeatCount="indefinite"
          />
          <ellipse rx="32" ry="30" fill="none" stroke="url(#goldRingGrad)" strokeWidth="5.5" />
          <ellipse rx="32" ry="30" fill="none" stroke="#78350F" strokeWidth="1.2" strokeDasharray="3 5" />
        </g>

        <g transform="rotate(-32)">
          <ellipse rx="29" ry="15" fill="none" stroke="url(#goldRingGrad)" strokeWidth="5" />
          <ellipse rx="29" ry="15" fill="none" stroke="#FEF9C3" strokeWidth="1" strokeDasharray="2 6" />
        </g>

        <g transform="rotate(38)">
          <ellipse rx="26" ry="13" fill="none" stroke="url(#goldRingGrad)" strokeWidth="4.5" />
        </g>

        <circle r="10" fill="#0284C7" stroke="#7DD3FC" strokeWidth="1.5" />
        <circle r="6.5" fill="#FEF08A">
          <animate attributeName="r" values="5.5;8;5.5" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="#FFFFFF" />
      </g>

      {/* Etiqueta flotante GUARDIÁN DEL NIVEL */}
      <g transform="translate(0 -104)">
        <rect
          x="-72"
          y="-11"
          width="144"
          height="22"
          rx="11"
          fill="#09192F"
          fillOpacity="0.9"
          stroke={activo ? '#00F0FF' : '#FB7185'}
          strokeWidth="1.5"
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10"
          fontWeight="900"
          letterSpacing="1.5"
          fill="#FB7185"
          style={{ filter: 'drop-shadow(0 0 6px rgba(251,113,133,0.8))' }}
        >
          GUARDIÁN DEL NIVEL
        </text>
      </g>
    </g>
  );
}

/** Cubo Isométrico 3D de Cristal Traslúcido con bordes neón y operadores matemáticos. */
function CuboIsometricoSVG({
  nodo,
  activo,
  visitado,
}: {
  nodo: NodoCubo;
  activo: boolean;
  visitado: boolean;
}) {
  if (nodo.tipo === 'boss') return null;

  const W = 30;
  const H = 15;
  const D = 27;
  const { x, y, tipo, numero, opIzq, opDer } = nodo;

  const paleta = {
    normal: {
      top: activo ? 'rgba(0, 240, 255, 0.45)' : visitado ? 'rgba(0, 229, 255, 0.3)' : 'rgba(0, 195, 255, 0.2)',
      left: 'rgba(6, 78, 130, 0.62)',
      right: 'rgba(4, 47, 86, 0.72)',
      stroke: activo ? '#FFFFFF' : '#00F0FF',
      innerStroke: 'rgba(0, 240, 255, 0.35)',
      textTop: '#E0F2FE',
      textSide: '#38BDF8',
      glow: 'rgba(0, 240, 255, 0.55)',
    },
    especial: {
      top: activo ? 'rgba(251, 191, 36, 0.52)' : 'rgba(245, 158, 11, 0.35)',
      left: 'rgba(146, 64, 14, 0.66)',
      right: 'rgba(113, 46, 10, 0.76)',
      stroke: '#FBBF24',
      innerStroke: 'rgba(253, 224, 71, 0.4)',
      textTop: '#FEF08A',
      textSide: '#FBBF24',
      glow: 'rgba(251, 191, 36, 0.65)',
    },
    trampa: {
      top: activo ? 'rgba(251, 113, 133, 0.5)' : 'rgba(249, 115, 22, 0.35)',
      left: 'rgba(154, 52, 18, 0.66)',
      right: 'rgba(124, 45, 18, 0.76)',
      stroke: '#FB7185',
      innerStroke: 'rgba(251, 113, 133, 0.38)',
      textTop: '#FFE4E6',
      textSide: '#FB7185',
      glow: 'rgba(249, 115, 22, 0.65)',
    },
  }[tipo];

  const topPts = `${x},${y - H * 2} ${x + W},${y - H} ${x},${y} ${x - W},${y - H}`;
  const leftPts = `${x - W},${y - H} ${x},${y} ${x},${y + D} ${x - W},${y - H + D}`;
  const rightPts = `${x + W},${y - H} ${x},${y} ${x},${y + D} ${x + W},${y - H + D}`;

  return (
    <g
      id={`cell-${nodo.index}`}
      style={{
        filter: `drop-shadow(0 0 ${activo ? 14 : 8}px ${paleta.glow})`,
      }}
    >
      {activo && (
        <polygon
          points={`${x},${y - H * 2 - 4} ${x + W + 5},${y - H} ${x},${y + D + 4} ${x - W - 5},${y - H}`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeOpacity="0.85"
        >
          <animate attributeName="stroke-opacity" values="0.9;0.25;0.9" dur="1.3s" repeatCount="indefinite" />
        </polygon>
      )}

      <line x1={x} y1={y - H * 2} x2={x} y2={y - H * 2 + D} stroke={paleta.innerStroke} strokeWidth="1" strokeDasharray="2 2" />
      <line x1={x - W} y1={y - H + D} x2={x} y2={y - H * 2 + D} stroke={paleta.innerStroke} strokeWidth="1" strokeDasharray="2 2" />
      <line x1={x + W} y1={y - H + D} x2={x} y2={y - H * 2 + D} stroke={paleta.innerStroke} strokeWidth="1" strokeDasharray="2 2" />

      <polygon points={leftPts} fill={paleta.left} stroke={paleta.stroke} strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points={rightPts} fill={paleta.right} stroke={paleta.stroke} strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points={topPts} fill={paleta.top} stroke={paleta.stroke} strokeWidth={activo ? 2.4 : 1.7} strokeLinejoin="round" />

      <text
        x={x}
        y={y - H}
        textAnchor="middle"
        dominantBaseline="central"
        fill={paleta.textTop}
        fontSize="11"
        fontWeight="900"
        style={{ fontFamily: "'Orbitron', monospace" }}
      >
        {numero}
      </text>

      <text
        transform={`translate(${x - W * 0.48} ${y + D * 0.34}) skewY(26)`}
        textAnchor="middle"
        dominantBaseline="central"
        fill={paleta.textSide}
        fontSize="11.5"
        fontWeight="900"
      >
        {opIzq}
      </text>

      <text
        transform={`translate(${x + W * 0.48} ${y + D * 0.34}) skewY(-26)`}
        textAnchor="middle"
        dominantBaseline="central"
        fill={paleta.textSide}
        fontSize="11.5"
        fontWeight="900"
      >
        {opDer}
      </text>

      {tipo === 'especial' && (
        <g fill="#FEF08A">
          <text x={x - W - 6} y={y - H - 8} fontSize="10" fontWeight="900">+</text>
          <text x={x + W + 2} y={y - 2} fontSize="9" fontWeight="900">✦</text>
        </g>
      )}
    </g>
  );
}

/** Token del Jugador: Joven Astronauta Explorador. */
function JovenAstronauta({ caminando }: { caminando: boolean }) {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="13" ry="5" fill="#020617" opacity="0.45" />
      <rect x="-11" y="-28" width="22" height="16" rx="4" fill="#CBD5E1" stroke="#475569" strokeWidth="1.2" />
      <circle cx="-8" cy="-20" r="2.2" fill="#00F0FF" />
      <circle cx="8" cy="-20" r="2.2" fill="#FBBF24" />

      <g>
        {caminando && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -3; 0 0"
            dur="0.28s"
            repeatCount="indefinite"
          />
        )}
        <rect x="-7" y="-12" width="6" height="9" rx="2.5" fill="#F8FAFC" stroke="#475569" strokeWidth="1.1" />
        <rect x="1" y="-12" width="6" height="9" rx="2.5" fill="#F8FAFC" stroke="#475569" strokeWidth="1.1" />
        <rect x="-8" y="-4" width="7.5" height="4.5" rx="2" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
        <rect x="0.5" y="-4" width="7.5" height="4.5" rx="2" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
      </g>

      <rect x="-9.5" y="-27" width="19" height="16" rx="6" fill="#FFFFFF" stroke="#475569" strokeWidth="1.2" />
      <rect x="-9.5" y="-16" width="19" height="3.5" rx="1.2" fill="#334155" />
      <rect x="-3" y="-16.5" width="6" height="4.5" rx="1" fill="#FBBF24" stroke="#78350F" strokeWidth="0.8" />
      <rect x="-5" y="-23" width="10" height="5" rx="1.5" fill="#0284C7" stroke="#38BDF8" strokeWidth="0.9" />

      <g transform="translate(-9.5 -24) rotate(-28)">
        <rect x="-7" y="-2" width="8" height="5" rx="2.5" fill="#FFFFFF" stroke="#475569" strokeWidth="1.1" />
        <circle cx="-7.5" cy="0.5" r="2.6" fill="#38BDF8" stroke="#1E293B" strokeWidth="0.9" />
      </g>
      <g transform="translate(9.5 -23) rotate(22)">
        <rect x="-1" y="-2" width="8" height="5" rx="2.5" fill="#FFFFFF" stroke="#475569" strokeWidth="1.1" />
        <circle cx="7.5" cy="0.5" r="2.6" fill="#38BDF8" stroke="#1E293B" strokeWidth="0.9" />
      </g>

      <circle cx="0" cy="-41" r="12.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.4" />
      <circle cx="0" cy="-40" r="9.5" fill="#FCD5B5" />
      <path
        d="M-9.5 -42 C-9.5 -51 9.5 -51 9.5 -42 C6 -45 2 -43 -1 -45 C-4 -43 -7 -44 -9.5 -42 Z"
        fill="#78350F"
      />
      <circle cx="-3.6" cy="-39.5" r="1.4" fill="#0F172A" />
      <circle cx="3.6" cy="-39.5" r="1.4" fill="#0F172A" />
      <circle cx="-3.1" cy="-40" r="0.5" fill="#FFFFFF" />
      <circle cx="4.1" cy="-40" r="0.5" fill="#FFFFFF" />
      <ellipse cx="-5.8" cy="-37.2" rx="1.8" ry="1" fill="#FB7185" opacity="0.55" />
      <ellipse cx="5.8" cy="-37.2" rx="1.8" ry="1" fill="#FB7185" opacity="0.55" />
      <path d="M-2.2 -36.5 Q0 -34.6 2.2 -36.5" stroke="#7C2D12" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      <circle cx="0" cy="-41" r="12.5" fill="url(#helmetGlassGrad)" stroke="#7DD3FC" strokeWidth="1.4" />
      <path d="M-7 -48 Q-2 -51 4 -49" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
      <rect x="-14.5" y="-44" width="3" height="6" rx="1.5" fill="#FBBF24" stroke="#78350F" strokeWidth="0.9" />
      <rect x="11.5" y="-44" width="3" height="6" rx="1.5" fill="#FBBF24" stroke="#78350F" strokeWidth="0.9" />
    </g>
  );
}

/**
 * Montaña 3D Escalonada de Obsidiana y Zafiro con acantilados tallados,
 * raíces de roca flotante, neblina bioluminiscente y 3 mesetas de altura (fiel a Imagen 1).
 */
const EscenarioMontaña = memo(function EscenarioMontaña() {
  return (
    <g>
      {/* ── Nebulosas y Bruma Volumétrica Cian de Fondo ── */}
      <ellipse cx="390" cy="340" rx="370" ry="240" fill="url(#cyanNebulaGrad)" />
      <ellipse cx="180" cy="240" rx="210" ry="140" fill="url(#cyanNebulaGrad)" />
      <ellipse cx="580" cy="490" rx="220" ry="110" fill="url(#cyanNebulaGrad)" />

      {/* ── Anillo Orbital Superior Izquierdo (Telemetría) ── */}
      <g transform="translate(102 82) rotate(-22)">
        <ellipse rx="76" ry="24" fill="none" stroke="#38BDF8" strokeOpacity="0.35" strokeWidth="1.2" />
        <ellipse rx="50" ry="15" fill="none" stroke="#38BDF8" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="-48" cy="-12" r="3" fill="#E0F2FE" />
        <circle cx="64" cy="9" r="4" fill="#7DD3FC" />
      </g>

      {/* ── Asteroide de Cristal Prisma Cian con Anillo Orbital Arriba a la Derecha ── */}
      <g transform="translate(692 88)">
        <g transform="rotate(24)">
          <ellipse rx="72" ry="20" fill="none" stroke="#7DD3FC" strokeOpacity="0.45" strokeWidth="1.5" />
          <ellipse rx="54" ry="14" fill="none" stroke="#38BDF8" strokeOpacity="0.3" strokeWidth="1" />
        </g>
        <polygon points="0,-34 21,-8 8,30 -17,20 -21,-11" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="1.2" />
        <polygon points="0,-34 21,-8 2,4" fill="#A5F3FC" opacity="0.85" />
        <polygon points="-21,-11 2,4 -17,20" fill="#0284C7" opacity="0.85" />
      </g>

      {/* ══════════════════ 1. RAÍCES Y ACANTILADOS INFERIORES DE LA MONTAÑA FLOTANTE ══════════════════ */}
      {/* Sombra profunda y picos de roca colgantes debajo de la isla-montaña */}
      <g>
        {/* Pared de acantilado izquierda inferior (iluminada en azul zafiro) */}
        <polygon
          points="78,350 96,475 168,572 228,618 265,520 155,390"
          fill="url(#cliffLitGrad)"
          stroke="#0284C7"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        {/* Pared de acantilado izquierda sombra */}
        <polygon
          points="228,618 308,582 342,626 265,520"
          fill="#050E1D"
          stroke="#0369A1"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {/* Gran picacho central inferior de la montaña */}
        <polygon
          points="308,582 342,626 418,632 455,540 335,520"
          fill="url(#cliffLitGrad)"
          stroke="#0284C7"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        <polygon
          points="418,632 496,595 545,622 455,540"
          fill="#040B18"
          stroke="#0284C7"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {/* Acantilado derecho bajo el Portal Cuántico */}
        <polygon
          points="496,595 545,622 638,592 698,510 726,390 650,410 530,520"
          fill="url(#cliffDarkGrad)"
          stroke="#00E5FF"
          strokeOpacity="0.4"
          strokeWidth="1.3"
        />
        {/* Facetas rocosas verticales en el acantilado derecho */}
        <polygon points="638,592 698,510 662,455 592,535" fill="#0B213F" stroke="#0284C7" strokeOpacity="0.4" strokeWidth="1" />
        <polygon points="545,622 638,592 592,535 518,555" fill="#07152B" />

        {/* Grietas bioluminiscentes cian en los acantilados inferiores */}
        <path
          d="M 156 485 L 182 538 L 174 562 M 372 566 L 392 608 M 586 538 L 612 582 M 668 446 L 685 495"
          stroke="#00F0FF"
          strokeWidth="1.8"
          strokeOpacity="0.65"
          fill="none"
        />
      </g>

      {/* ══════════════════ 2. MESETA BASE INFERIOR (TERRAZA 1: CUBOS 01..06 Y PORTAL) ══════════════════ */}
      <g>
        {/* Pared vertical frontal de la Terraza 1 (efecto grosor de roca 3D) */}
        <path
          d="M 80 356 C 95 455, 165 535, 295 572 C 435 604, 595 588, 696 502 L 718 402 C 625 535, 440 562, 290 532 C 165 502, 105 420, 80 356 Z"
          fill="url(#cliffWallGrad)"
          stroke="#00E5FF"
          strokeOpacity="0.45"
          strokeWidth="1.4"
        />
        {/* Superficie superior curva de la Terraza 1 */}
        <path
          d="M 80 356 C 72 260, 145 180, 320 112 C 475 68, 625 92, 682 195 C 735 288, 732 418, 668 486 C 580 568, 425 582, 285 548 C 162 518, 88 438, 80 356 Z"
          fill="url(#terrace1TopGrad)"
          stroke="#00E5FF"
          strokeOpacity="0.6"
          strokeWidth="2"
        />
      </g>

      {/* ══════════════════ 3. MESETA INTERMEDIA ESCALONADA (TERRAZA 2: CUBOS 07..15) ══════════════════ */}
      <g>
        {/* Pared de acantilado vertical entre la Terraza 2 y la Terraza 1 (da altura real a la montaña) */}
        <path
          d="M 148 418 C 225 462, 345 458, 455 398 C 562 340, 642 265, 654 182 L 654 226 C 638 308, 558 382, 448 442 C 338 498, 222 496, 148 456 Z"
          fill="url(#innerCliffGrad)"
          stroke="#0284C7"
          strokeOpacity="0.65"
          strokeWidth="1.5"
        />
        {/* Estrías verticales talladas en el escalón intermedio */}
        {[220, 275, 335, 395, 455, 515, 575, 620].map((kx, i) => (
          <line
            key={i}
            x1={kx}
            y1={390 - i * 22}
            x2={kx + 4}
            y2={428 - i * 22}
            stroke="#00E5FF"
            strokeOpacity="0.28"
            strokeWidth="1.5"
          />
        ))}

        {/* Superficie superior de la Meseta Intermedia (Terraza 2) */}
        <path
          d="M 118 348 C 110 245, 195 145, 365 92 C 505 58, 635 88, 654 182 C 642 265, 562 340, 455 398 C 345 458, 215 462, 148 418 C 125 398, 120 374, 118 348 Z"
          fill="url(#terrace2TopGrad)"
          stroke="#38BDF8"
          strokeOpacity="0.75"
          strokeWidth="2"
        />

        {/* Segundo escalón topográfico sobre la Meseta 2 */}
        <path
          d="M 142 325 C 148 228, 232 142, 388 98 C 508 72, 608 98, 622 172 C 608 238, 532 305, 435 358 C 338 408, 225 408, 165 368 Z"
          fill="#163560"
          fillOpacity="0.7"
          stroke="#00E5FF"
          strokeOpacity="0.45"
          strokeWidth="1.4"
        />
      </g>

      {/* ══════════════════ 4. CUMBRE ALTA DEL GUARDIÁN (TERRAZA 3: CIMA IZQUIERDA) ══════════════════ */}
      <g>
        {/* Gran pared de acantilado oscuro que eleva la Cumbre del Santuario sobre el resto de la montaña */}
        <path
          d="M 96 268 C 118 332, 208 358, 298 326 C 362 302, 396 248, 384 192 L 384 246 C 394 298, 356 352, 292 376 C 202 408, 114 378, 96 316 Z"
          fill="url(#summitCliffGrad)"
          stroke="#00E5FF"
          strokeOpacity="0.6"
          strokeWidth="1.6"
        />
        {/* Vetas verticales de roca en el acantilado de la cumbre */}
        {[135, 175, 215, 255, 295, 335, 365].map((kx, i) => (
          <line
            key={i}
            x1={kx}
            y1={315 - Math.abs(3 - i) * 8}
            x2={kx}
            y2={362 - Math.abs(3 - i) * 8}
            stroke="#38BDF8"
            strokeOpacity="0.32"
            strokeWidth="1.6"
          />
        ))}

        {/* Plataforma rocosa superior de la Cumbre (donde reposa el Santuario 20) */}
        <path
          d="M 96 268 C 88 202, 148 148, 238 142 C 322 136, 376 158, 384 192 C 396 248, 362 302, 298 326 C 208 358, 118 332, 96 268 Z"
          fill="url(#summitTopGrad)"
          stroke="#00F0FF"
          strokeOpacity="0.85"
          strokeWidth="2.2"
        />

        {/* Escalón interior violeta-zafiro de la Cumbre */}
        <ellipse
          cx="228"
          cy="238"
          rx="116"
          ry="64"
          transform="rotate(-8 228 238)"
          fill="#1E2B5E"
          fillOpacity="0.65"
          stroke="#67E8F9"
          strokeOpacity="0.5"
          strokeWidth="1.4"
        />
      </g>

      {/* ── Niebla Bioluminiscente Cian flotando en las laderas de la montaña ── */}
      <ellipse cx="135" cy="395" rx="95" ry="32" fill="url(#mistCyanGrad)" />
      <ellipse cx="595" cy="395" rx="105" ry="36" fill="url(#mistCyanGrad)" />
      <ellipse cx="345" cy="565" rx="140" ry="34" fill="url(#mistCyanGrad)" />

      {/* ── Arcos Holográficos de Telemetría Laterales (fiel a Imagen 1) ── */}
      <path
        d="M 88 225 C 18 328, 24 488, 142 578"
        fill="none"
        stroke="#00F0FF"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      <path
        d="M 75 240 C 6 338, 12 495, 130 588"
        fill="none"
        stroke="#00F0FF"
        strokeOpacity="0.28"
        strokeWidth="8"
        strokeDasharray="2 5"
      />
      <path
        d="M 686 210 C 768 302, 772 445, 698 538"
        fill="none"
        stroke="#00F0FF"
        strokeOpacity="0.48"
        strokeWidth="1.8"
      />

      {/* Pantalla holográfica traslúcida flotando a la derecha de la montaña */}
      <g transform="translate(676 262) skewY(16)" opacity="0.58">
        <rect x="0" y="0" width="64" height="42" rx="4" fill="#042F4B" stroke="#00F0FF" strokeWidth="1.2" />
        <line x1="8" y1="10" x2="44" y2="10" stroke="#00F0FF" strokeWidth="2" />
        <line x1="8" y1="18" x2="54" y2="18" stroke="#38BDF8" strokeWidth="1.5" />
        <line x1="8" y1="26" x2="36" y2="26" stroke="#38BDF8" strokeWidth="1.5" />
      </g>

      {/* Constelación geométrica inferior izquierda */}
      <g stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1" fill="#E0F2FE">
        <polyline points="38,522 72,544 104,530 92,570 58,578 38,522" fill="none" />
        <circle cx="38" cy="522" r="2.2" />
        <circle cx="72" cy="544" r="2.2" />
        <circle cx="104" cy="530" r="2.2" />
        <circle cx="92" cy="570" r="2.2" />
        <circle cx="58" cy="578" r="2.2" />
      </g>

      {/* Anillo dorado secundario en la terraza del Santuario */}
      <g transform="translate(178 310)">
        <ellipse rx="22" ry="9" fill="#082F49" stroke="#FBBF24" strokeWidth="3" />
        <ellipse rx="13" ry="5" fill="#00F0FF" opacity="0.5" />
      </g>

      {/* Cristales bioluminiscentes brotando en las terrazas */}
      <CristalesMontaña x={108} y={266} escala={1.05} variante="violeta" />
      <CristalesMontaña x={112} y={382} escala={0.88} variante="ambar" />
      <CristalesMontaña x={172} y={468} escala={0.95} variante="violeta" />
      <CristalesMontaña x={384} y={488} escala={0.92} variante="ambar" />
      <CristalesMontaña x={548} y={382} escala={1.06} variante="violeta" />
      <CristalesMontaña x={658} y={476} escala={0.86} variante="cian" />

      {/* Puntos bioluminiscentes cian sobre las laderas */}
      {[
        [138, 295],
        [162, 342],
        [242, 302],
        [332, 268],
        [485, 362],
        [612, 318],
        [642, 392],
        [458, 490],
        [204, 532],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#00F0FF" opacity="0.88">
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
});

interface MapaMontañaCuanticaProps {
  pos: number;
  caminando: boolean;
  santuarioDesbloqueado: boolean;
}

export default function MapaMontañaCuantica({
  pos,
  caminando,
  santuarioDesbloqueado,
}: MapaMontañaCuanticaProps) {
  const nodoActual = NODOS_NUMERIX[Math.min(pos, NODOS_NUMERIX.length - 1)];

  return (
    <svg
      viewBox="0 0 780 640"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full select-none"
      role="img"
      aria-label="Montaña Cuántica de Numérix"
    >
      <defs>
        <radialGradient id="cyanNebulaGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.24" />
          <stop offset="55%" stopColor="#0284C7" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#071326" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mistCyanGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#0284C7" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cliffLitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B3B68" />
          <stop offset="55%" stopColor="#0E2240" />
          <stop offset="100%" stopColor="#061020" />
        </linearGradient>
        <linearGradient id="cliffDarkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12294A" />
          <stop offset="55%" stopColor="#081529" />
          <stop offset="100%" stopColor="#030914" />
        </linearGradient>
        <linearGradient id="cliffWallGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0D2240" />
          <stop offset="50%" stopColor="#071428" />
          <stop offset="100%" stopColor="#040C1A" />
        </linearGradient>
        <linearGradient id="innerCliffGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#061326" />
          <stop offset="50%" stopColor="#0B2140" />
          <stop offset="100%" stopColor="#123159" />
        </linearGradient>
        <linearGradient id="summitCliffGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050E1F" />
          <stop offset="60%" stopColor="#0D2142" />
          <stop offset="100%" stopColor="#173766" />
        </linearGradient>
        <linearGradient id="terrace1TopGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#173763" />
          <stop offset="55%" stopColor="#0F2647" />
          <stop offset="100%" stopColor="#091830" />
        </linearGradient>
        <linearGradient id="terrace2TopGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#21487E" />
          <stop offset="55%" stopColor="#15315A" />
          <stop offset="100%" stopColor="#0C2040" />
        </linearGradient>
        <linearGradient id="summitTopGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2B5999" />
          <stop offset="55%" stopColor="#1D3D72" />
          <stop offset="100%" stopColor="#132952" />
        </linearGradient>
        <radialGradient id="portalFloorGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="portalArchGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="50%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <radialGradient id="portalEnergyGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="55%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#0284C7" />
        </radialGradient>
        <radialGradient id="bossHaloGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="armilarBeamGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="armilarCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldRingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <radialGradient id="helmetGlassGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.32" />
        </radialGradient>
      </defs>

      <EscenarioMontaña />

      {/* ── RIEL / CONDUCTO CONTINUO DE FIBRA ÓPTICA DORADA Y CIAN ── */}
      <g pointerEvents="none">
        <path
          d={PATH_RIEL}
          fill="none"
          stroke="#00F0FF"
          strokeWidth="22"
          strokeOpacity="0.22"
          strokeLinecap="round"
        />
        <path
          d={PATH_RIEL}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="12"
          strokeOpacity="0.88"
          strokeLinecap="round"
        />
        <path
          d={PATH_RIEL}
          fill="none"
          stroke="#082F49"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={PATH_RIEL}
          fill="none"
          stroke="#00F0FF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>

      {/* ── SANTUARIO CASILLA 20 (GUARDIÁN DEL NIVEL) ── */}
      <SantuarioGuardian
        x={NODOS_NUMERIX[19].x}
        y={NODOS_NUMERIX[19].y}
        activo={pos === 19}
        desbloqueado={santuarioDesbloqueado}
      />

      {/* ── PORTAL DE CRISTAL CUÁNTICO EN CASILLA 01 ── */}
      <PortalInicio x={642} y={512} />

      {/* ── CUBOS ISOMÉTRICOS 01 AL 19 (Ordenados por profundidad Y ascendente) ── */}
      {[...NODOS_NUMERIX]
        .filter((n) => n.tipo !== 'boss')
        .sort((a, b) => a.y - b.y)
        .map((nodo) => (
          <CuboIsometricoSVG
            key={nodo.index}
            nodo={nodo}
            activo={nodo.index === pos}
            visitado={nodo.index < pos}
          />
        ))}

      {/* ── TOKEN DEL JUGADOR: JOVEN ASTRONAUTA EXPLORADOR ── */}
      <motion.g
        initial={false}
        animate={{
          x: nodoActual.x,
          y: nodoActual.tipo === 'boss' ? nodoActual.y - 6 : nodoActual.y - 16,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      >
        <JovenAstronauta caminando={caminando} />
      </motion.g>
    </svg>
  );
}
