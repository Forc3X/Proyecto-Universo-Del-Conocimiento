/**
 * Geometría del mapa de Letralia.
 *
 * Todo el tablero se diseña en coordenadas de PANTALLA (viewBox 1000×640) mediante
 * puntos de control, que se convierten a un PLANO DE SUELO. En ese plano se
 * muestrean las casillas a distancia constante y se dibujan losas/hexágonos que
 * luego se proyectan con una matriz isométrica suave (aspecto "pergamino flotante").
 */

export type Rama = 'left' | 'center' | 'right';
export type Tramo = 'start' | Rama | 'boss';
export type TipoCasilla = 'glifo' | 'cristal' | 'tormenta' | 'portal' | 'encrucijada' | 'boss';
export type Mecanica = 'intruso' | 'puente' | 'tormenta' | 'portal' | 'boss' | 'ninguna';

export interface Pt {
  x: number;
  y: number;
}

export interface Casilla {
  id: string;
  tramo: Tramo;
  /** Índice 1-based dentro de su tramo. */
  indice: number;
  tipo: TipoCasilla;
  mecanica: Mecanica;
  glifo: string;
  /** ¿Otorga Sílaba Clave? */
  silaba: boolean;
  /** Centro en el plano de suelo. */
  g: Pt;
  /** Centro proyectado en pantalla. */
  s: Pt;
  /** Ángulo de la tangente del camino en el suelo (grados). */
  angulo: number;
}

export const VIEW_W = 1000;
export const VIEW_H = 640;

/* Matriz de proyección suelo → pantalla:  x' = a·gx + c·gy,  y' = b·gx + d·gy */
const A = 1;
const B = -0.22;
const C = 0.7;
const D = 0.55;
export const ISO_MATRIX = `matrix(${A} ${B} ${C} ${D} 0 0)`;

export function toScreen(g: Pt): Pt {
  return { x: A * g.x + C * g.y, y: B * g.x + D * g.y };
}

export function toGround(s: Pt): Pt {
  const det = A * D - B * C;
  return { x: (D * s.x - C * s.y) / det, y: (-B * s.x + A * s.y) / det };
}

/* Medidas de las piezas (unidades de suelo) */
export const ANCHO_CAMINO = 46;
export const LARGO_LOSA = 44;
export const RADIO_HEX = 29;

/* ─────────── Puntos de control (pantalla) ─────────── */

export const ORIGEN_S: Pt = { x: 74, y: 552 };
export const BOSS_S: Pt = { x: 846, y: 106 };

const START_WP: Pt[] = [
  { x: 132, y: 566 },
  { x: 196, y: 556 },
  { x: 258, y: 538 },
  { x: 312, y: 514 },
  { x: 362, y: 486 },
];

const ENCRUCIJADA_S = START_WP[START_WP.length - 1];

const RAMA_WP: Record<Rama, Pt[]> = {
  left: [
    ENCRUCIJADA_S,
    { x: 322, y: 430 },
    { x: 268, y: 380 },
    { x: 232, y: 318 },
    { x: 246, y: 254 },
    { x: 304, y: 208 },
    { x: 388, y: 182 },
    { x: 476, y: 158 },
    { x: 566, y: 132 },
    { x: 656, y: 104 },
    { x: 748, y: 86 },
    BOSS_S,
  ],
  center: [
    ENCRUCIJADA_S,
    { x: 432, y: 458 },
    { x: 498, y: 432 },
    { x: 552, y: 392 },
    { x: 590, y: 338 },
    { x: 640, y: 290 },
    { x: 700, y: 256 },
    { x: 752, y: 212 },
    { x: 790, y: 164 },
    BOSS_S,
  ],
  right: [
    ENCRUCIJADA_S,
    { x: 438, y: 516 },
    { x: 526, y: 540 },
    { x: 616, y: 546 },
    { x: 700, y: 528 },
    { x: 764, y: 488 },
    { x: 812, y: 432 },
    { x: 846, y: 372 },
    { x: 872, y: 310 },
    { x: 884, y: 246 },
    { x: 876, y: 180 },
    BOSS_S,
  ],
};

/* ─────────── Curvas ─────────── */

interface Curva {
  puntos: Pt[]; // suelo, densos
  acum: number[]; // longitud acumulada
  total: number;
}

function catmullRom(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

function construirCurva(wpPantalla: Pt[]): Curva {
  const wp = wpPantalla.map(toGround);
  const puntos: Pt[] = [];
  const PASOS = 24;
  for (let i = 0; i < wp.length - 1; i++) {
    const p0 = wp[Math.max(0, i - 1)];
    const p1 = wp[i];
    const p2 = wp[i + 1];
    const p3 = wp[Math.min(wp.length - 1, i + 2)];
    for (let k = 0; k < PASOS; k++) puntos.push(catmullRom(p0, p1, p2, p3, k / PASOS));
  }
  puntos.push(wp[wp.length - 1]);
  const acum = [0];
  for (let i = 1; i < puntos.length; i++) {
    acum.push(acum[i - 1] + Math.hypot(puntos[i].x - puntos[i - 1].x, puntos[i].y - puntos[i - 1].y));
  }
  return { puntos, acum, total: acum[acum.length - 1] };
}

function puntoEn(c: Curva, dist: number): { p: Pt; angulo: number } {
  const d = Math.max(0, Math.min(c.total, dist));
  let i = 1;
  while (i < c.acum.length - 1 && c.acum[i] < d) i++;
  const a = c.puntos[i - 1];
  const b = c.puntos[i];
  const seg = c.acum[i] - c.acum[i - 1] || 1;
  const t = (d - c.acum[i - 1]) / seg;
  return {
    p: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t },
    angulo: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
}

const CURVA_START = construirCurva([ORIGEN_S, ...START_WP]);
const CURVAS_RAMA: Record<Rama, Curva> = {
  left: construirCurva(RAMA_WP.left),
  center: construirCurva(RAMA_WP.center),
  right: construirCurva(RAMA_WP.right),
};

/** Polilíneas (en suelo) para pintar la cinta de pergamino continua. */
export const CINTAS: Record<'start' | Rama, Pt[]> = {
  start: CURVA_START.puntos,
  left: CURVAS_RAMA.left.puntos,
  center: CURVAS_RAMA.center.puntos,
  right: CURVAS_RAMA.right.puntos,
};

export function polilineaD(pts: Pt[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}

/* ─────────── Casillas ─────────── */

const GLIFOS = ['A', 'Ñ', 'Ω', 'Σ', 'Λ', 'Ψ', 'Φ', 'Δ', 'Ξ', 'Θ', 'Γ', 'Π'];

/** Configuración pedagógica de cada rama: qué mecánica activa cada casilla 1..10. */
const MECANICAS_RAMA: Record<Rama, Mecanica[]> = {
  // Sendero del Acento y la Ortografía → más Caza del Intruso y Tormenta.
  left: ['intruso', 'intruso', 'puente', 'intruso', 'tormenta', 'puente', 'intruso', 'intruso', 'tormenta', 'portal'],
  // Sendero de los Puentes Sintácticos → más Constructor de Oraciones (las losas 4 y 8 también son puentes).
  center: ['intruso', 'intruso', 'puente', 'puente', 'tormenta', 'puente', 'intruso', 'puente', 'tormenta', 'portal'],
  // Sendero del Léxico y Significado → combinación equilibrada.
  right: ['intruso', 'intruso', 'puente', 'intruso', 'tormenta', 'puente', 'intruso', 'intruso', 'tormenta', 'portal'],
};

function tipoRama(i: number): TipoCasilla {
  if (i === 3 || i === 6) return 'cristal';
  if (i === 5 || i === 9) return 'tormenta';
  if (i === 10) return 'portal';
  return 'glifo';
}

function crearCasillasStart(): Casilla[] {
  // Las 5 casillas se reparten entre la primera losa y la encrucijada (el origen queda antes).
  const inicio = CURVA_START.total * 0.14;
  const paso = (CURVA_START.total - inicio) / 4;
  return Array.from({ length: 5 }, (_, k) => {
    const { p, angulo } = puntoEn(CURVA_START, inicio + paso * k);
    const indice = k + 1;
    const tipo: TipoCasilla = indice === 5 ? 'encrucijada' : indice === 3 ? 'cristal' : 'glifo';
    const mecanica: Mecanica = indice === 5 ? 'ninguna' : indice === 3 ? 'puente' : 'intruso';
    return {
      id: `start_${indice}`,
      tramo: 'start' as const,
      indice,
      tipo,
      mecanica,
      glifo: GLIFOS[k % GLIFOS.length],
      silaba: indice === 3,
      g: p,
      s: toScreen(p),
      angulo,
    };
  });
}

function crearCasillasRama(rama: Rama, offsetGlifo: number): Casilla[] {
  const curva = CURVAS_RAMA[rama];
  const paso = curva.total / 11;
  return Array.from({ length: 10 }, (_, k) => {
    const indice = k + 1;
    const { p, angulo } = puntoEn(curva, paso * indice);
    const tipo = tipoRama(indice);
    return {
      id: `${rama}_${indice}`,
      tramo: rama,
      indice,
      tipo,
      mecanica: MECANICAS_RAMA[rama][k],
      glifo: GLIFOS[(k + offsetGlifo) % GLIFOS.length],
      silaba: indice === 3 || indice === 6 || indice === 10,
      g: p,
      s: toScreen(p),
      angulo,
    };
  });
}

const gBoss = toGround(BOSS_S);

export const CASILLAS_START = crearCasillasStart();
export const CASILLAS_RAMA: Record<Rama, Casilla[]> = {
  left: crearCasillasRama('left', 3),
  center: crearCasillasRama('center', 6),
  right: crearCasillasRama('right', 9),
};
export const CASILLA_BOSS: Casilla = {
  id: 'boss_36',
  tramo: 'boss',
  indice: 36,
  tipo: 'boss',
  mecanica: 'boss',
  glifo: '✦',
  silaba: false,
  g: gBoss,
  s: BOSS_S,
  angulo: 0,
};

/** Las 36 casillas del mapa. */
export const TODAS_LAS_CASILLAS: Casilla[] = [
  ...CASILLAS_START,
  ...CASILLAS_RAMA.left,
  ...CASILLAS_RAMA.center,
  ...CASILLAS_RAMA.right,
  CASILLA_BOSS,
];

export const TOTAL_RECORRIDO = 16;

/** Ruta efectiva de una partida: 5 iniciales + 10 de la rama + Santuario. */
export function construirRuta(rama: Rama | null): Casilla[] {
  if (!rama) return CASILLAS_START;
  return [...CASILLAS_START, ...CASILLAS_RAMA[rama], CASILLA_BOSS];
}

export const ORIGEN_G = toGround(ORIGEN_S);

export const INFO_RAMA: Record<Rama, { nombre: string; corto: string; color: string; oscuro: string; descripcion: string }> = {
  left: {
    nombre: 'Sendero del Acento y la Ortografía',
    corto: 'Acento y Ortografía',
    color: '#C4B5FD',
    oscuro: '#7C6BC9',
    descripcion: 'Más Caza del Intruso y Tormentas de acentuación.',
  },
  center: {
    nombre: 'Sendero de los Puentes Sintácticos',
    corto: 'Puentes Sintácticos',
    color: '#7DD3FC',
    oscuro: '#3B8DBA',
    descripcion: 'Más Constructor de Oraciones y conectores.',
  },
  right: {
    nombre: 'Sendero del Léxico y Significado',
    corto: 'Léxico y Significado',
    color: '#6EE7B7',
    oscuro: '#2E9E78',
    descripcion: 'Sinónimos, antónimos y gramática equilibrada.',
  },
};
