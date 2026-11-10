'use client';

/**
 * "El Viajero": joven explorador espacial con casco ligero, bufanda coral y capa astral.
 * Se dibuja con el punto (0,0) en sus pies. Mira a la derecha por defecto.
 * Las articulaciones usan <animateTransform> con pivote explícito (coordenadas de usuario).
 */

function Balanceo({ cx, cy, desde, hasta, dur }: { cx: number; cy: number; desde: number; hasta: number; dur: number }) {
  return (
    <animateTransform
      attributeName="transform"
      type="rotate"
      values={`${desde} ${cx} ${cy};${hasta} ${cx} ${cy};${desde} ${cx} ${cy}`}
      dur={`${dur}s`}
      repeatCount="indefinite"
      calcMode="spline"
      keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
      keyTimes="0;0.5;1"
    />
  );
}

export default function ElViajero({ caminando, mirando = 1 }: { caminando: boolean; mirando?: 1 | -1 }) {
  const k = caminando ? 'walk' : 'idle';
  return (
    <g transform={`scale(${mirando} 1)`}>
      <defs>
        <linearGradient id="capaViajero" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="48%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#FDA4AF" />
        </linearGradient>
        <linearGradient id="cascoViajero" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF3DD" />
          <stop offset="100%" stopColor="#D9C29A" />
        </linearGradient>
        <linearGradient id="tunicaViajero" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
      </defs>

      {/* Sombra */}
      <ellipse cx={0} cy={1} rx={13} ry={4.2} fill="#1E1B4B" opacity={0.28} />

      {/* Capa astral (ondea hacia atrás) */}
      <g>
        <Balanceo key={`capa-${k}`} cx={-4} cy={-34} desde={caminando ? -5 : -2} hasta={caminando ? 7 : 3} dur={caminando ? 0.7 : 2.6} />
        <path
          d="M-4 -36 C-14 -30 -22 -18 -31 -5 C-25 -5 -21 -8 -17 -4 C-14 -8 -10 -7 -6 -5 C-6 -16 -3 -28 -4 -36 Z"
          fill="url(#capaViajero)"
          stroke="#8FA8E8"
          strokeWidth={1}
          strokeLinejoin="round"
        />
        <path d="M-8 -30 C-14 -22 -19 -14 -25 -6" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={1} fill="none" />
        <circle cx={-20} cy={-14} r={0.9} fill="#FFFFFF" />
        <circle cx={-13} cy={-20} r={0.7} fill="#FFFFFF" />
      </g>

      {/* Piernas */}
      <g>
        {caminando && <Balanceo key="p1" cx={-3} cy={-14} desde={20} hasta={-20} dur={0.36} />}
        <rect x={-5.5} y={-14} width={5} height={12} rx={2.4} fill="#4C4A8A" />
        <path d="M-6.5 -3.5 h7 a2.5 2.5 0 0 1 2.5 2.5 v1 h-9.5 z" fill="#2E2B63" />
      </g>
      <g>
        {caminando && <Balanceo key="p2" cx={3} cy={-14} desde={-20} hasta={20} dur={0.36} />}
        <rect x={0.5} y={-14} width={5} height={12} rx={2.4} fill="#5B59A0" />
        <path d="M-0.5 -3.5 h7 a2.5 2.5 0 0 1 2.5 2.5 v1 h-9.5 z" fill="#36337A" />
      </g>

      {/* Cuerpo / túnica */}
      <path
        d="M-8 -14 C-9 -22 -8 -31 -1 -33 C6 -33 9 -26 8.5 -14 Q0 -11 -8 -14 Z"
        fill="url(#tunicaViajero)"
        stroke="#A78BFA"
        strokeWidth={1}
      />
      <rect x={-8.4} y={-19} width={17} height={3} rx={1.5} fill="#A78BFA" />
      <circle cx={2.5} cy={-17.5} r={1.4} fill="#FDE68A" stroke="#C59A3D" strokeWidth={0.5} />

      {/* Bolsa de pergaminos */}
      <path d="M5 -28 L10 -16" stroke="#B08A5A" strokeWidth={1.2} />
      <rect x={6.5} y={-19} width={7} height={6} rx={1.6} fill="#E6C99A" stroke="#B08A5A" strokeWidth={0.8} />
      <rect x={8} y={-23} width={2} height={5} rx={1} fill="#FDF6E3" stroke="#D8C49D" strokeWidth={0.5} />

      {/* Brazo */}
      <g>
        <Balanceo key={`brazo-${k}`} cx={0} cy={-29} desde={caminando ? -28 : -6} hasta={caminando ? 22 : 2} dur={caminando ? 0.36 : 2.4} />
        <rect x={-2} y={-30} width={4.4} height={11} rx={2.2} fill="#EDE9FE" stroke="#A78BFA" strokeWidth={0.8} />
        <circle cx={0.2} cy={-18.5} r={2.3} fill="#F6CBA8" />
      </g>

      {/* Bufanda coral */}
      <path d="M-6 -32 Q0 -29 7 -32 L6.5 -29 Q0 -26.5 -5.5 -29 Z" fill="#FDA4AF" stroke="#E07A8C" strokeWidth={0.6} />
      <g>
        <Balanceo key={`buf-${k}`} cx={-5} cy={-28} desde={caminando ? -10 : -3} hasta={caminando ? 10 : 3} dur={caminando ? 0.5 : 2} />
        <path d="M-5 -30 C-10 -28 -14 -27 -18 -29 L-17 -25 C-13 -24 -9 -25 -5 -27 Z" fill="#FDBA74" stroke="#E39A55" strokeWidth={0.6} />
      </g>

      {/* Cabeza */}
      <circle cx={1} cy={-40} r={8} fill="#F8D5B8" stroke="#E2AE8A" strokeWidth={0.7} />
      <path d="M-6.5 -41 Q-7 -46 -3 -47 L-3 -42 Z" fill="#7A4E35" />
      <circle cx={4.2} cy={-40.5} r={1.15} fill="#1E1B4B" />
      <circle cx={4.6} cy={-40.9} r={0.4} fill="#FFFFFF" />
      <circle cx={5.4} cy={-37.6} r={1.6} fill="#FDA4AF" opacity={0.55} />
      <path d="M3 -36.6 Q4.6 -35.6 6.2 -36.6" stroke="#B4664B" strokeWidth={0.8} fill="none" strokeLinecap="round" />

      {/* Casco / sombrero de explorador */}
      <ellipse cx={0.5} cy={-44.6} rx={12.5} ry={3.4} fill="#CDB487" />
      <path d="M-8 -45 C-8 -55 9 -55 9.5 -45 Z" fill="url(#cascoViajero)" stroke="#B89B6B" strokeWidth={0.8} />
      <path d="M-8 -46.5 Q0.7 -44 9.4 -46.5 L9.5 -45 Q0.7 -42.6 -8 -45 Z" fill="#A78BFA" />
      <path d="M-3 -52 Q0 -54 4 -52.5" stroke="#FFFFFF" strokeOpacity={0.8} strokeWidth={1.1} fill="none" strokeLinecap="round" />
      <circle cx={8.6} cy={-46} r={1.3} fill="#7DD3FC" stroke="#FFFFFF" strokeWidth={0.5} />
    </g>
  );
}
