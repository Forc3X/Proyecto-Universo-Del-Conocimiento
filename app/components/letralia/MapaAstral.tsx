'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ElViajero from './ElViajero';
import {
  ANCHO_CAMINO,
  BOSS_S,
  CASILLA_BOSS,
  CASILLAS_RAMA,
  CASILLAS_START,
  CINTAS,
  INFO_RAMA,
  ISO_MATRIX,
  LARGO_LOSA,
  ORIGEN_S,
  RADIO_HEX,
  TODAS_LAS_CASILLAS,
  VIEW_H,
  VIEW_W,
  polilineaD,
  type Casilla,
  type Pt,
  type Rama,
} from './mapa';

/* ════════════════════════ Utilidades de dibujo ════════════════════════ */

function aleatorio(semilla: number) {
  let s = semilla * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function cerradoSuave(pts: Pt[]): string {
  const n = pts.length;
  const mid = (a: Pt, b: Pt) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  let d = '';
  const m0 = mid(pts[n - 1], pts[0]);
  d += `M${m0.x.toFixed(1)} ${m0.y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const m = mid(p, pts[(i + 1) % n]);
    d += ` Q${p.x.toFixed(1)} ${p.y.toFixed(1)} ${m.x.toFixed(1)} ${m.y.toFixed(1)}`;
  }
  return d + ' Z';
}

function hexPuntos(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(' ');
}

/* ════════════════════════ Islas flotantes ════════════════════════ */

type EstiloIsla = 'lavanda' | 'menta';

interface IslaCfg {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  prof: number;
  estilo: EstiloIsla;
  seed: number;
}

const ISLAS: IslaCfg[] = [
  { cx: 860, cy: 116, rx: 128, ry: 52, prof: 118, estilo: 'lavanda', seed: 8 }, // Santuario
  { cx: 118, cy: 168, rx: 62, ry: 26, prof: 60, estilo: 'lavanda', seed: 11 }, // islote decorativo
  { cx: 476, cy: 164, rx: 108, ry: 36, prof: 72, estilo: 'menta', seed: 4 },
  { cx: 238, cy: 300, rx: 94, ry: 42, prof: 84, estilo: 'lavanda', seed: 3 },
  { cx: 604, cy: 344, rx: 80, ry: 32, prof: 76, estilo: 'menta', seed: 5 },
  { cx: 706, cy: 404, rx: 34, ry: 15, prof: 34, estilo: 'menta', seed: 13 }, // islote
  { cx: 804, cy: 452, rx: 82, ry: 34, prof: 72, estilo: 'lavanda', seed: 6 },
  { cx: 372, cy: 494, rx: 66, ry: 27, prof: 58, estilo: 'menta', seed: 2 }, // Encrucijada
  { cx: 612, cy: 560, rx: 104, ry: 30, prof: 62, estilo: 'menta', seed: 7 },
  { cx: 140, cy: 566, rx: 168, ry: 60, prof: 120, estilo: 'lavanda', seed: 1 }, // Inicio
];

function Isla({ cfg }: { cfg: IslaCfg }) {
  const { cx, cy, rx, ry, prof, estilo, seed } = cfg;
  const N = 34;
  const top: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const r = 1 + 0.06 * Math.sin(3 * t + seed) + 0.04 * Math.sin(7 * t + seed * 2.3);
    top.push({ x: cx + Math.cos(t) * rx * r, y: cy + Math.sin(t) * ry * r });
  }
  const inferior = top.slice(0, N / 2 + 1);
  const fondo: Pt[] = [];
  const M = 11;
  for (let j = 0; j <= M; j++) {
    const t = 1 - j / M; // de derecha a izquierda no: inferior termina a la izquierda → vamos de izq a der
    const tt = 1 - t;
    const x = cx - rx * 0.9 + tt * rx * 1.8;
    const base = Math.pow(Math.sin(Math.PI * (0.06 + 0.88 * tt)), 1.3);
    const dientes = j % 2 === 0 ? 1 : 0.68;
    const ruido = 0.72 + 0.28 * Math.abs(Math.sin(tt * 11 + seed));
    fondo.push({ x, y: cy + ry * 0.45 + prof * base * dientes * ruido });
  }
  const acantilado =
    'M' +
    inferior.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L') +
    ' L' +
    fondo.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L') +
    ' Z';
  const estratos = [0.22, 0.42, 0.62].map((k) =>
    inferior
      .filter((_, i) => i % 2 === 0)
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${(cx + (p.x - cx) * (1 - k * 0.22)).toFixed(1)} ${(p.y + prof * k * 0.55).toFixed(1)}`)
      .join(' '),
  );
  const superficie = cerradoSuave(top);
  const r = aleatorio(seed);
  const motas = Array.from({ length: 7 }, () => ({
    x: cx + (r() - 0.5) * rx * 1.3,
    y: cy + (r() - 0.5) * ry * 1.1,
    rr: 2 + r() * 5,
  }));

  return (
    <g>
      <path d={acantilado} fill={estilo === 'lavanda' ? 'url(#acantiladoLav)' : 'url(#acantiladoArena)'} />
      {estratos.map((d, i) => (
        <path key={i} d={d} stroke={estilo === 'lavanda' ? '#3F3873' : '#5E463C'} strokeOpacity={0.22} strokeWidth={1.4} fill="none" />
      ))}
      <path d={superficie} transform="translate(0 5)" fill={estilo === 'lavanda' ? '#9B8BD6' : '#5FBF9A'} />
      <path d={superficie} fill={estilo === 'lavanda' ? 'url(#cespedLav)' : 'url(#cespedMenta)'} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={1.2} />
      {motas.map((m, i) => (
        <ellipse key={i} cx={m.x} cy={m.y} rx={m.rr} ry={m.rr * 0.45} fill="#FFFFFF" opacity={0.18} />
      ))}
    </g>
  );
}

/* ════════════════════════ Elementos decorativos ════════════════════════ */

function Columna({ x, y, h, rota = false }: { x: number; y: number; h: number; rota?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={2} rx={15} ry={4.5} fill="#2E2A5A" opacity={0.25} />
      <rect x={-12} y={-7} width={24} height={7} rx={2} fill="#D8CEF6" stroke="#8E80C4" strokeWidth={1} />
      <rect x={-8.5} y={-7 - h} width={17} height={h} fill="url(#columnaGrad)" stroke="#8E80C4" strokeWidth={1} />
      <path d={`M-3 -9 V${-5 - h} M3 -9 V${-5 - h}`} stroke="#9F92D2" strokeWidth={1} opacity={0.7} />
      {!rota ? (
        <rect x={-12} y={-14 - h} width={24} height={7} rx={2} fill="#E6DEFA" stroke="#8E80C4" strokeWidth={1} />
      ) : (
        <path d={`M-8.5 ${-7 - h} l5 -5 l4 4 l3 -6 l4.5 7 Z`} fill="#CFC4F2" stroke="#8E80C4" strokeWidth={1} />
      )}
    </g>
  );
}

function Coral({ x, y, s = 1, color = '#F99A84' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth={2.4} strokeLinecap="round" fill="none">
      <path d="M0 0 C-1 -8 -5 -12 -8 -19" />
      <path d="M0 0 C1 -9 3 -15 2 -23" />
      <path d="M1 -11 C4 -13 7 -14 10 -18" />
      <path d="M-4 -10 C-7 -11 -9 -12 -12 -12" />
    </g>
  );
}

function CristalDeco({ x, y, s = 1, color = '#6EE7B7' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <polygon points="0,-16 6,-5 4,3 -4,3 -6,-5" fill={color} stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={0.8} />
      <polygon points="0,-16 6,-5 0,-3" fill="#FFFFFF" opacity={0.45} />
      <polygon points="9,-8 12,-2 11,3 7,3 6,-2" fill={color} opacity={0.85} />
    </g>
  );
}

function Nube({ x, y, s, o = 1 }: { x: number; y: number; s: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={22} rx={120} ry={26} fill="#BFCBEA" opacity={0.55} />
      {[
        [-78, 8, 34],
        [-40, -14, 46],
        [8, -26, 54],
        [58, -10, 44],
        [96, 10, 30],
        [-10, 12, 52],
        [42, 16, 40],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="url(#nubeGrad)" />
      ))}
    </g>
  );
}

function Roca({ x, y, s, color, dur }: { x: number; y: number; s: number; color: 'arena' | 'lav'; dur: number }) {
  const top = color === 'arena' ? '#E2C3A2' : '#CABEF0';
  const lado = color === 'arena' ? '#A9826A' : '#8C7DC4';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -5;0 0" dur={`${dur}s`} repeatCount="indefinite" />
      <polygon points="-9,0 -3,-6 7,-5 10,1 3,9 -6,7" fill={lado} />
      <polygon points="-9,0 -3,-6 7,-5 10,1 1,3" fill={top} />
    </g>
  );
}

const CONSTELACIONES: Pt[][] = [
  [
    { x: 300, y: 64 },
    { x: 336, y: 92 },
    { x: 382, y: 80 },
    { x: 410, y: 108 },
    { x: 392, y: 54 },
  ],
  [
    { x: 520, y: 260 },
    { x: 548, y: 236 },
    { x: 590, y: 246 },
    { x: 606, y: 214 },
  ],
  [
    { x: 410, y: 380 },
    { x: 444, y: 362 },
    { x: 470, y: 392 },
    { x: 502, y: 372 },
  ],
  [
    { x: 660, y: 470 },
    { x: 690, y: 440 },
    { x: 722, y: 460 },
  ],
  [
    { x: 690, y: 40 },
    { x: 722, y: 26 },
    { x: 760, y: 34 },
  ],
];

/** Fondo estático: estrellas, constelaciones, nubes, islas y ruinas. Memoizado. */
const DecoracionFondo = memo(function DecoracionFondo() {
  const r = aleatorio(42);
  const estrellas = Array.from({ length: 70 }, (_, i) => ({
    x: r() * VIEW_W,
    y: r() * VIEW_H * 0.9,
    rr: 0.6 + r() * 1.4,
    tw: i % 4 === 0,
    dur: 2 + r() * 3,
  }));
  const rocas = [
    { x: 196, y: 214, s: 1.1, c: 'arena' as const },
    { x: 262, y: 160, s: 0.8, c: 'lav' as const },
    { x: 556, y: 230, s: 0.9, c: 'arena' as const },
    { x: 690, y: 330, s: 1.2, c: 'arena' as const },
    { x: 520, y: 476, s: 0.9, c: 'lav' as const },
    { x: 446, y: 610, s: 1.3, c: 'arena' as const },
    { x: 952, y: 330, s: 1, c: 'arena' as const },
    { x: 760, y: 610, s: 1.1, c: 'lav' as const },
    { x: 32, y: 390, s: 0.9, c: 'arena' as const },
    { x: 340, y: 300, s: 0.7, c: 'lav' as const },
    { x: 930, y: 230, s: 0.8, c: 'lav' as const },
    { x: 616, y: 70, s: 0.9, c: 'arena' as const },
  ];

  return (
    <g>
      {/* Nebulosas suaves */}
      <ellipse cx={300} cy={150} rx={260} ry={120} fill="#A5B4FC" opacity={0.08} />
      <ellipse cx={720} cy={420} rx={300} ry={160} fill="#C4B5FD" opacity={0.07} />

      {/* Órbita decorativa */}
      <ellipse cx={120} cy={96} rx={100} ry={36} transform="rotate(-18 120 96)" fill="none" stroke="#E0E7FF" strokeOpacity={0.35} strokeWidth={1} />
      <circle r={6} fill="#E0E7FF" opacity={0.85}>
        <animateMotion dur="26s" repeatCount="indefinite" path="M20 96 a100 36 0 1 0 200 0 a100 36 0 1 0 -200 0" />
      </circle>

      {/* Estrellas */}
      {estrellas.map((e, i) => (
        <circle key={i} cx={e.x} cy={e.y} r={e.rr} fill="#F8FAFF" opacity={0.75}>
          {e.tw && <animate attributeName="opacity" values="0.2;1;0.2" dur={`${e.dur}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      {[
        [40, 150],
        [430, 300],
        [640, 26],
        [900, 380],
        [330, 410],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} opacity={0.9}>
          <path d="M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z" fill="#FFF7D6">
            <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2.5 + i * 0.6}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}

      {/* Constelaciones */}
      {CONSTELACIONES.map((c, i) => (
        <g key={i}>
          <path d={polilineaD(c)} stroke="#E0E7FF" strokeOpacity={0.4} strokeWidth={1} fill="none" />
          {c.map((p, j) => (
            <circle key={j} cx={p.x} cy={p.y} r={2} fill="#F1F5FF" opacity={0.85} />
          ))}
        </g>
      ))}

      {/* Nubes traseras */}
      <Nube x={70} y={430} s={0.9} o={0.9} />
      <Nube x={960} y={560} s={1.25} />
      <Nube x={20} y={630} s={1.1} />
      <Nube x={500} y={672} s={0.9} o={0.85} />

      {/* Rocas flotantes */}
      {rocas.map((k, i) => (
        <Roca key={i} x={k.x} y={k.y} s={k.s} color={k.c} dur={3 + (i % 4)} />
      ))}

      {/* Islas */}
      {ISLAS.map((cfg, i) => (
        <Isla key={i} cfg={cfg} />
      ))}

      {/* Ruinas del Santuario */}
      <Columna x={806} y={92} h={58} />
      <Columna x={866} y={70} h={64} />
      <rect x={790} y={6} width={92} height={13} rx={3} transform="rotate(-12 836 12)" fill="#E6DEFA" stroke="#8E80C4" strokeWidth={1.2} />
      <Columna x={938} y={96} h={46} rota />
      <Columna x={918} y={140} h={22} rota />
      <CristalDeco x={780} y={136} s={1.1} color="#6EE7B7" />
      <CristalDeco x={952} y={150} s={0.9} color="#C4B5FD" />
      <Coral x={962} y={118} s={1.1} />
      <Coral x={770} y={104} s={0.8} color="#FDBA74" />

      {/* Ruinas del inicio */}
      <Columna x={30} y={548} h={70} />
      <Columna x={92} y={530} h={52} rota />
      <rect x={6} y={460} width={70} height={12} rx={3} transform="rotate(-6 40 466)" fill="#E6DEFA" stroke="#8E80C4" strokeWidth={1.2} />
      <Coral x={56} y={600} s={1.2} />
      <Coral x={238} y={600} s={0.9} color="#FDBA74" />
      <CristalDeco x={262} y={580} s={0.9} color="#C4B5FD" />

      {/* Escalinata del inicio */}
      {Array.from({ length: 5 }, (_, k) => (
        <g key={k}>
          <polygon
            points={`${150 + k * 6},${604 + k * 9} ${210 + k * 6},${602 + k * 9} ${214 + k * 6},${608 + k * 9} ${154 + k * 6},${610 + k * 9}`}
            fill="#D9CDF6"
            stroke="#8E80C4"
            strokeWidth={0.8}
          />
          <rect x={154 + k * 6} y={610 + k * 9} width={60} height={3} fill="#9E8FD2" />
        </g>
      ))}

      {/* Detalles de islas intermedias */}
      <Columna x={214} y={286} h={30} rota />
      <Coral x={270} y={320} s={0.9} />
      <CristalDeco x={520} y={150} s={1} color="#C4B5FD" />
      <Coral x={430} y={156} s={0.8} color="#FDBA74" />
      <CristalDeco x={628} y={330} s={1} color="#6EE7B7" />
      <Coral x={836} y={444} s={1} />
      <CristalDeco x={772} y={452} s={0.9} color="#C4B5FD" />
      <Coral x={662} y={560} s={0.9} color="#FDBA74" />
      <CristalDeco x={110} y={160} s={0.9} color="#6EE7B7" />
      <Coral x={140} y={156} s={0.8} />

      {/* Pergamino enrollado del inicio */}
      <g transform={`translate(${ORIGEN_S.x - 18} ${ORIGEN_S.y + 4}) rotate(-12)`}>
        <rect x={-6} y={-16} width={14} height={36} rx={7} fill="#F4E8CC" stroke="#CDB68E" strokeWidth={1.2} />
        <ellipse cx={1} cy={-16} rx={7} ry={3.5} fill="#FDF6E3" stroke="#CDB68E" strokeWidth={1} />
        <path d="M-2 -16 a3 1.6 0 1 0 6 0" stroke="#CDB68E" fill="none" strokeWidth={0.8} />
      </g>
    </g>
  );
});

/* ════════════════════════ Casillas ════════════════════════ */

const COLOR_HEX: Record<string, { top: string; lado: string; brillo: string }> = {
  lavanda: { top: '#C4B5FD', lado: '#8F7BE0', brillo: '#EDE9FE' },
  menta: { top: '#6EE7B7', lado: '#2FB584', brillo: '#D1FAE5' },
  coral: { top: '#FDA4AF', lado: '#E5788A', brillo: '#FFE4E6' },
  portal: { top: '#A5F3D0', lado: '#5BBF9C', brillo: '#F0FDF4' },
};

function colorCasilla(c: Casilla) {
  if (c.tipo === 'tormenta') return COLOR_HEX.coral;
  if (c.tipo === 'portal') return COLOR_HEX.portal;
  if (c.tipo === 'cristal') return c.indice === 6 ? COLOR_HEX.menta : COLOR_HEX.lavanda;
  return COLOR_HEX.lavanda;
}

/** Envuelve contenido en coordenadas de suelo, desplazado verticalmente en pantalla. */
function Suelo({ dy = 0, children }: { dy?: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(0 ${dy})`}>
      <g transform={ISO_MATRIX}>{children}</g>
    </g>
  );
}

function CasillaSVG({
  c,
  visitada,
  activa,
  completada,
  atenuada,
}: {
  c: Casilla;
  visitada: boolean;
  activa: boolean;
  completada: boolean;
  atenuada: boolean;
}) {
  const t = `translate(${c.g.x.toFixed(1)} ${c.g.y.toFixed(1)}) rotate(${c.angulo.toFixed(1)})`;
  const W = ANCHO_CAMINO - 6;
  const L = LARGO_LOSA;

  if (c.tipo === 'glifo') {
    return (
      <g opacity={atenuada ? 0.42 : 1}>
        <Suelo dy={0}>
          <rect transform={t} x={-L / 2} y={-W / 2} width={L} height={W} rx={5} fill="#CDB68E" />
        </Suelo>
        <Suelo dy={-2}>
          <rect transform={t} x={-L / 2} y={-W / 2} width={L} height={W} rx={5} fill="#D9C49A" />
        </Suelo>
        <Suelo dy={-4}>
          <g transform={t}>
            <rect x={-L / 2} y={-W / 2} width={L} height={W} rx={5} fill="#FDF6E3" stroke="#E6D5B8" strokeWidth={1.5} />
            <rect x={-L / 2 + 4} y={-W / 2 + 4} width={L - 8} height={W - 8} rx={3} fill="none" stroke="#EFE3C8" strokeWidth={1} />
            {visitada && <rect x={-L / 2} y={-W / 2} width={L} height={W} rx={5} fill="url(#tintaLosa)" opacity={0.5} />}
            {activa && (
              <rect x={-L / 2 - 2} y={-W / 2 - 2} width={L + 4} height={W + 4} rx={6} fill="none" stroke="#7DD3FC" strokeWidth={3}>
                <animate attributeName="stroke-opacity" values="1;0.35;1" dur="1.4s" repeatCount="indefinite" />
              </rect>
            )}
          </g>
        </Suelo>
        <text
          transform={`translate(${c.s.x.toFixed(1)} ${(c.s.y - 4).toFixed(1)}) skewX(-14) scale(1 0.68)`}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={21}
          fontWeight={800}
          fill={visitada ? '#6D5BA8' : '#8B7CC0'}
          opacity={0.9}
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {c.glifo}
        </text>
      </g>
    );
  }

  if (c.tipo === 'encrucijada') {
    return (
      <g opacity={atenuada ? 0.42 : 1}>
        {[0, -2, -4].map((dy) => (
          <Suelo key={dy} dy={dy}>
            <circle cx={c.g.x} cy={c.g.y} r={33} fill="#7FB4D6" />
          </Suelo>
        ))}
        <Suelo dy={-6}>
          <g transform={`translate(${c.g.x} ${c.g.y})`}>
            <circle r={33} fill="#E0F2FE" stroke="#7DD3FC" strokeWidth={2} />
            <circle r={25} fill="none" stroke="#A5B4FC" strokeWidth={1.2} strokeDasharray="3 4" />
            <path d="M0 -22 L5 -5 L22 0 L5 5 L0 22 L-5 5 L-22 0 L-5 -5 Z" fill="#C4B5FD" stroke="#8B7CC0" strokeWidth={1} />
            <circle r={4} fill="#FDBA74" />
            {visitada && <circle r={33} fill="url(#tintaLosa)" opacity={0.35} />}
            {activa && (
              <circle r={36} fill="none" stroke="#7DD3FC" strokeWidth={3}>
                <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        </Suelo>
      </g>
    );
  }

  if (c.tipo === 'boss') return null; // se dibuja aparte

  // Hexágonos: cristal, tormenta, portal
  const col = colorCasilla(c);
  const R = c.tipo === 'portal' ? RADIO_HEX + 5 : RADIO_HEX;
  const pts = hexPuntos(R);
  return (
    <g opacity={atenuada ? 0.42 : 1}>
      {[0, -2, -4, -6].map((dy) => (
        <Suelo key={dy} dy={dy}>
          <polygon transform={t} points={pts} fill={col.lado} />
        </Suelo>
      ))}
      <Suelo dy={-8}>
        <g transform={t}>
          <polygon points={pts} fill={col.top} stroke={col.brillo} strokeWidth={2} strokeLinejoin="round" />
          <polygon points={hexPuntos(R - 7)} fill="none" stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={1.3} />
          {visitada && <polygon points={pts} fill="url(#tintaLosa)" opacity={0.35} />}
          {activa && (
            <polygon points={hexPuntos(R + 3)} fill="none" stroke="#7DD3FC" strokeWidth={3}>
              <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
            </polygon>
          )}
        </g>
      </Suelo>
      {/* Icono superior y glifo tallado (en pantalla) */}
      <text
        transform={`translate(${c.s.x.toFixed(1)} ${(c.s.y - 8).toFixed(1)}) skewX(-14) scale(1 0.68)`}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={18}
        fontWeight={900}
        fill={c.tipo === 'tormenta' ? '#9F1239' : c.tipo === 'portal' || c.indice === 6 ? '#065F46' : '#4C1D95'}
        opacity={0.78}
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {c.glifo}
      </text>
      <g transform={`translate(${c.s.x.toFixed(1)} ${(c.s.y - 8).toFixed(1)})`}>
        {c.tipo === 'tormenta' && (
          <g transform="translate(14 -10) scale(0.75)">
            <circle cx={0} cy={0} r={7} fill="#FFE4E6" stroke="#E11D48" strokeOpacity={0.7} strokeWidth={1.4} />
            <path d="M-4 -2 L2 2 M-2 -5 L4 -1" stroke="#9F1239" strokeWidth={1.6} strokeLinecap="round" />
          </g>
        )}
        {c.tipo === 'cristal' && (
          <g opacity={completada ? 0.55 : 1} transform="translate(15 -4)">
            <animateTransform attributeName="transform" type="translate" values="15 -10;15 -15;15 -10" dur="2.4s" repeatCount="indefinite" />
            <polygon points="0,-9 5,-1 3,6 -3,6 -5,-1" fill={c.indice === 6 ? '#6EE7B7' : '#C4B5FD'} stroke="#FFFFFF" strokeWidth={1.1} />
            <polygon points="0,-9 5,-1 0,0" fill="#FFFFFF" opacity={0.65} />
            {completada && <path d="M-3 0 L-1 2.5 L4 -3" stroke="#065F46" strokeWidth={1.8} fill="none" strokeLinecap="round" />}
          </g>
        )}
        {c.tipo === 'portal' && (
          <g opacity={completada ? 0.5 : 1}>
            <ellipse cx={0} cy={0} rx={17} ry={10} fill="none" stroke="#FFFFFF" strokeWidth={2} strokeDasharray="5 4">
              <animateTransform attributeName="transform" type="rotate" values="0;360" dur="6s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}
      </g>
    </g>
  );
}

function SantuarioBoss({ activa, abierto, atenuada }: { activa: boolean; abierto: boolean; atenuada: boolean }) {
  const g = CASILLA_BOSS.g;
  return (
    <g opacity={atenuada ? 0.6 : 1}>
      {[0, -3, -6, -9].map((dy) => (
        <Suelo key={dy} dy={dy}>
          <circle cx={g.x} cy={g.y} r={50} fill="#8F7BE0" />
        </Suelo>
      ))}
      <Suelo dy={-12}>
        <g transform={`translate(${g.x} ${g.y})`}>
          <circle r={50} fill="url(#bossSuelo)" stroke="#EDE9FE" strokeWidth={2.5} />
          <circle r={40} fill="none" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={1.4} strokeDasharray="6 5" />
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0;360" dur={abierto ? '5s' : '14s'} repeatCount="indefinite" />
            {[0, 120, 240].map((a) => (
              <path
                key={a}
                transform={`rotate(${a})`}
                d="M0 0 C8 -6 18 -4 24 6 C18 0 10 0 4 6"
                fill={abierto ? '#7DD3FC' : '#C4B5FD'}
                opacity={0.85}
              />
            ))}
          </g>
          <circle r={6} fill="#FDF6E3" />
          {activa && (
            <circle r={54} fill="none" stroke="#7DD3FC" strokeWidth={3}>
              <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      </Suelo>
      {/* Gema flotante del Guardián */}
      <g transform={`translate(${BOSS_S.x} ${BOSS_S.y - 46})`}>
        <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -6;0 0" dur="3s" repeatCount="indefinite" />
        <circle r={20} fill={abierto ? '#7DD3FC' : '#C4B5FD'} opacity={0.25} filter="url(#halo)" />
        <polygon points="0,-18 11,-4 6,14 -6,14 -11,-4" fill={abierto ? '#BAE6FD' : '#DDD6FE'} stroke="#FFFFFF" strokeWidth={1.5} />
        <polygon points="0,-18 11,-4 0,-1" fill="#FFFFFF" opacity={0.6} />
        {!abierto && (
          <g transform="translate(0 2)">
            <rect x={-5} y={-1} width={10} height={8} rx={1.5} fill="#4C1D95" opacity={0.8} />
            <path d="M-3 -1 v-3 a3 3 0 0 1 6 0 v3" stroke="#4C1D95" strokeWidth={1.6} fill="none" opacity={0.8} />
          </g>
        )}
      </g>
    </g>
  );
}

/* ════════════════════════ Flechas de la Encrucijada ════════════════════════ */

function FlechasEncrucijada({ onElegir }: { onElegir: (r: Rama) => void }) {
  const centro = CASILLAS_START[4].s;
  const ramas: Rama[] = ['left', 'center', 'right'];
  return (
    <g>
      <circle cx={centro.x} cy={centro.y - 6} r={70} fill="#7DD3FC" opacity={0.12}>
        <animate attributeName="r" values="60;78;60" dur="2.4s" repeatCount="indefinite" />
      </circle>
      {ramas.map((rama, i) => {
        const destino = CASILLAS_RAMA[rama][0].s;
        const dx = destino.x - centro.x;
        const dy = destino.y - centro.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const ang = (Math.atan2(uy, ux) * 180) / Math.PI;
        const px = centro.x + ux * 62;
        const py = centro.y + uy * 62 - 30;
        const info = INFO_RAMA[rama];
        const etiquetaY = rama === 'right' ? 34 : -34;
        return (
          <motion.g
            key={rama}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 260, damping: 18 }}
            style={{ cursor: 'pointer' }}
            onClick={() => onElegir(rama)}
            className="flecha-encrucijada"
          >
            <g transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
              <g transform={`rotate(${ang.toFixed(1)})`}>
                <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;7 0;0 0" dur="1.2s" repeatCount="indefinite" />
                <path
                  d="M-20 -9 L3 -9 L3 -18 L24 0 L3 18 L3 9 L-20 9 Z"
                  fill={info.color}
                  stroke={info.oscuro}
                  strokeWidth={2.4}
                  strokeLinejoin="round"
                />
                <path d="M-16 -5 L5 -5 L5 -11 L17 -1" stroke="#FFFFFF" strokeOpacity={0.75} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
              </g>
              <g transform={`translate(0 ${etiquetaY})`}>
                <rect x={-66} y={-12} width={132} height={24} rx={12} fill="#283556" fillOpacity={0.92} stroke={info.color} strokeWidth={1.6} />
                <text textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={800} fill="#F8FAFC" letterSpacing={0.4}>
                  {info.corto}
                </text>
              </g>
              <rect x={-70} y={-48} width={140} height={96} fill="transparent" />
            </g>
          </motion.g>
        );
      })}
    </g>
  );
}

/* ════════════════════════ Mapa completo ════════════════════════ */

export interface MapaAstralProps {
  rama: Rama | null;
  posS: Pt;
  rastroG: Pt[];
  visitadas: Set<string>;
  completadas: Set<string>;
  activaId: string | null;
  eligiendo: boolean;
  onElegir: (r: Rama) => void;
  caminando: boolean;
  mirando: 1 | -1;
  saltoKey: number;
  santuarioAbierto: boolean;
}

const ORDEN_CASILLAS = [...TODAS_LAS_CASILLAS].filter((c) => c.tipo !== 'boss').sort((a, b) => a.s.y - b.s.y);

export default function MapaAstral({
  rama,
  posS,
  rastroG,
  visitadas,
  completadas,
  activaId,
  eligiendo,
  onElegir,
  caminando,
  mirando,
  saltoKey,
  santuarioAbierto,
}: MapaAstralProps) {
  const tramos: ('start' | Rama)[] = ['left', 'center', 'right', 'start'];
  const atenuar = (t: string) => rama !== null && t !== 'start' && t !== 'boss' && t !== rama;

  const inicioRastro = rastroG[0];
  const finRastro = rastroG[rastroG.length - 1];

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full select-none" role="img" aria-label="Mapa del Archivo Astral de Letralia">
      <defs>
        <linearGradient id="acantiladoLav" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A699DA" />
          <stop offset="45%" stopColor="#7466AE" />
          <stop offset="100%" stopColor="#433C7A" stopOpacity={0.9} />
        </linearGradient>
        <linearGradient id="acantiladoArena" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DDB998" />
          <stop offset="50%" stopColor="#A9826A" />
          <stop offset="100%" stopColor="#6E5248" stopOpacity={0.9} />
        </linearGradient>
        <radialGradient id="cespedLav" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#EAE2FD" />
          <stop offset="100%" stopColor="#BBA9EC" />
        </radialGradient>
        <radialGradient id="cespedMenta" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#D2F7E6" />
          <stop offset="100%" stopColor="#8AD8B9" />
        </radialGradient>
        <radialGradient id="nubeGrad" cx="45%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#D5DEF5" />
        </radialGradient>
        <linearGradient id="columnaGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EFE9FD" />
          <stop offset="60%" stopColor="#CFC3F2" />
          <stop offset="100%" stopColor="#A698DA" />
        </linearGradient>
        <linearGradient id="tintaLosa" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
        <radialGradient id="bossSuelo" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="60%" stopColor="#DDD6FE" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </radialGradient>
        {inicioRastro && finRastro && (
          <linearGradient
            id="rastroGrad"
            gradientUnits="userSpaceOnUse"
            x1={inicioRastro.x}
            y1={inicioRastro.y}
            x2={finRastro.x + 0.01}
            y2={finRastro.y + 0.01}
          >
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="55%" stopColor="#A5B4FC" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>
        )}
        <filter id="acuarela" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="12" xChannelSelector="R" yChannelSelector="G" result="desp" />
          <feGaussianBlur in="desp" stdDeviation="2.4" />
        </filter>
        <filter id="halo" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <DecoracionFondo />

      {/* Cintas de pergamino (caminos continuos) */}
      {tramos.map((t) => {
        const d = polilineaD(CINTAS[t]);
        return (
          <g key={t} opacity={atenuar(t) ? 0.42 : 1}>
            {[8, 6, 4, 2].map((dy) => (
              <Suelo key={dy} dy={dy}>
                <path d={d} stroke="#B89D74" strokeWidth={ANCHO_CAMINO + 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </Suelo>
            ))}
            <Suelo>
              <path d={d} stroke="#D6BF94" strokeWidth={ANCHO_CAMINO + 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d={d} stroke="#F3E7CB" strokeWidth={ANCHO_CAMINO - 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d={d} stroke="#E3D1AC" strokeWidth={ANCHO_CAMINO - 10} fill="none" strokeDasharray="1.4 19" strokeLinejoin="round" />
            </Suelo>
          </g>
        );
      })}

      {/* Santuario del Guardián */}
      <SantuarioBoss activa={activaId === 'boss_36'} abierto={santuarioAbierto} atenuada={false} />

      {/* Casillas (ordenadas por profundidad) */}
      {ORDEN_CASILLAS.map((c) => (
        <CasillaSVG
          key={c.id}
          c={c}
          visitada={visitadas.has(c.id)}
          activa={activaId === c.id}
          completada={completadas.has(c.id)}
          atenuada={atenuar(c.tramo)}
        />
      ))}

      {/* Rastro de tinta acuarela */}
      {rastroG.length > 1 && (
        <Suelo dy={-5}>
          <g pointerEvents="none">
            {/* Halo blanco-celeste exterior */}
            <path
              d={polilineaD(rastroG)}
              stroke="#E0F2FE"
              strokeWidth={36}
              strokeOpacity={0.75}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#acuarela)"
            />
            {/* Veta celeste acuarela */}
            <path
              d={polilineaD(rastroG)}
              transform="translate(-4 -3)"
              stroke="#7DD3FC"
              strokeWidth={22}
              strokeOpacity={0.85}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#acuarela)"
            />
            {/* Veta coral-durazno acuarela */}
            <path
              d={polilineaD(rastroG)}
              transform="translate(5 4)"
              stroke="#FDA4AF"
              strokeWidth={20}
              strokeOpacity={0.82}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#acuarela)"
            />
            {/* Núcleo de gradiente celeste-coral */}
            <path
              d={polilineaD(rastroG)}
              stroke="url(#rastroGrad)"
              strokeWidth={14}
              strokeOpacity={0.9}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Chispas blancas de espuma astral */}
            {rastroG.map((pt, idx) => (
              <g key={idx} transform={`translate(${pt.x} ${pt.y})`}>
                <circle cx={-10} cy={-6} r={2.2} fill="#FFFFFF" opacity={0.85} />
                <circle cx={9} cy={7} r={1.8} fill="#FFF7ED" opacity={0.8} />
                <circle cx={2} cy={-11} r={1.4} fill="#E0F2FE" opacity={0.9} />
              </g>
            ))}
          </g>
        </Suelo>
      )}

      {/* Etiqueta del Santuario */}
      <g transform={`translate(${BOSS_S.x} ${BOSS_S.y + 44})`}>
        <rect x={-62} y={-10} width={124} height={20} rx={10} fill="#283556" fillOpacity={0.85} stroke="#A5B4FC" strokeWidth={1.2} />
        <text textAnchor="middle" dominantBaseline="central" fontSize={9.5} fontWeight={800} letterSpacing={1} fill="#EDE9FE">
          SANTUARIO DEL GUARDIÁN
        </text>
      </g>

      {/* El Viajero */}
      <motion.g
        initial={false}
        animate={{ x: posS.x, y: posS.y - 6 }}
        transition={{ type: 'tween', duration: 0.36, ease: 'easeInOut' }}
      >
        <motion.g key={saltoKey} initial={{ y: 0 }} animate={{ y: saltoKey > 0 ? [0, -14, 0] : 0 }} transition={{ duration: 0.36, ease: 'easeOut' }}>
          <g transform="scale(1.18)">
            <ElViajero caminando={caminando} mirando={mirando} />
          </g>
        </motion.g>
      </motion.g>

      {/* Flechas flotantes de la Encrucijada Astral */}
      <AnimatePresence>{eligiendo && <FlechasEncrucijada onElegir={onElegir} />}</AnimatePresence>
    </svg>
  );
}

