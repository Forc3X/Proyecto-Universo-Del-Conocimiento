'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Dado3DProps {
  size?: number;
  rolling?: boolean;
  result?: number;
  onRollComplete?: () => void;
  /** Tema opcional: color único de las caras (p. ej. lavanda pastel para Letralia). */
  faceColor?: string;
  /** Tema opcional: color del borde de cada cara. */
  borderColor?: string;
  /** Tema opcional: color de los puntos. */
  pipColor?: string;
}

const FACE_COLORS: Record<number, string> = {
  1: '#00f5ff',
  2: '#bf40ff',
  3: '#00ff88',
  4: '#ff40bf',
  5: '#ffd700',
  6: '#ff8800',
};

const FACE_ROTATIONS: Record<number, { rotateX: number; rotateY: number }> = {
  1: { rotateX: 0, rotateY: 0 },
  2: { rotateX: 0, rotateY: -90 },
  3: { rotateX: -90, rotateY: 0 },
  4: { rotateX: 90, rotateY: 0 },
  5: { rotateX: 0, rotateY: 90 },
  6: { rotateX: 0, rotateY: 180 },
};

const DICE_PIP_LAYOUTS: Record<number, number[][]> = {
  1: [[0.5, 0.5]],
  2: [[0.25, 0.25], [0.75, 0.75]],
  3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
  4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
  5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
  6: [[0.25, 0.2], [0.75, 0.2], [0.25, 0.5], [0.75, 0.5], [0.25, 0.8], [0.75, 0.8]],
};

function DiceFace({
  num,
  size,
  color,
  borderColor,
  pipColor,
  themed,
}: {
  num: number;
  size: number;
  color: string;
  borderColor?: string;
  pipColor?: string;
  themed: boolean;
}) {
  const pips = DICE_PIP_LAYOUTS[num];
  const pipSize = size * 0.16;
  const isDarkTheme = themed && color.startsWith('#0');
  const highlightColor = isDarkTheme ? '#0E7490' : '#ffffff';
  return (
    <div
      className="absolute flex items-center justify-center select-none"
      style={{
        width: size,
        height: size,
        borderRadius: themed ? size * 0.2 : 14,
        background: themed
          ? `radial-gradient(circle at 30% 25%, ${highlightColor} 0%, ${color} 65%, ${borderColor ?? color}55 100%)`
          : `linear-gradient(145deg, ${color}ee, ${color}88)`,
        border: themed ? `2px solid ${borderColor ?? color}` : `1px solid ${color}55`,
        boxShadow: themed
          ? `inset 0 0 ${size * 0.18}px ${borderColor ?? color}55`
          : 'inset 0 0 25px rgba(0,0,0,0.25)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <div className="relative" style={{ width: size * 0.8, height: size * 0.8 }}>
        {pips.map((pos, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: pipSize,
              height: pipSize,
              left: `${pos[0] * 100}%`,
              top: `${pos[1] * 100}%`,
              transform: 'translate(-50%, -50%)',
              background: themed
                ? `radial-gradient(circle at 35% 35%, ${pipColor ?? '#312E81'}cc 0%, ${pipColor ?? '#312E81'} 70%)`
                : 'radial-gradient(circle, #fff 30%, rgba(255,255,255,0.6) 100%)',
              boxShadow: themed ? 'inset 0 1px 2px rgba(0,0,0,0.35)' : '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Dado3D({
  size = 80,
  rolling = false,
  result = 1,
  onRollComplete,
  faceColor,
  borderColor,
  pipColor,
}: Dado3DProps) {
  const [rollKey, setRollKey] = useState(0);
  // Giro y orientación inicial estables durante toda la tirada (evita reinicios por re-render).
  const [spin, setSpin] = useState({ x: 0, y: 0 });
  const [from, setFrom] = useState(FACE_ROTATIONS[1]);
  const lastFaceRef = useRef(1);
  const half = size / 2;
  const target = FACE_ROTATIONS[result] || FACE_ROTATIONS[1];
  const themed = Boolean(faceColor);

  useEffect(() => {
    if (rolling) {
      setFrom(FACE_ROTATIONS[lastFaceRef.current] || FACE_ROTATIONS[1]);
      setSpin({
        x: 360 * (3 + Math.floor(Math.random() * 2)),
        y: 360 * (3 + Math.floor(Math.random() * 2)),
      });
      setRollKey((k) => k + 1);
    }
  }, [rolling]);

  const faceTransforms: Record<number, string> = {
    1: `translateZ(${half}px)`,
    2: `rotateY(90deg) translateZ(${half}px)`,
    3: `rotateX(90deg) translateZ(${half}px)`,
    4: `rotateX(-90deg) translateZ(${half}px)`,
    5: `rotateY(-90deg) translateZ(${half}px)`,
    6: `rotateY(180deg) translateZ(${half}px)`,
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ perspective: size * 5, width: size, height: size }}
    >
      <motion.div
        key={`dice-${rollKey}`}
        initial={{ rotateX: from.rotateX, rotateY: from.rotateY }}
        animate={{
          rotateX: target.rotateX + spin.x,
          rotateY: target.rotateY + spin.y,
        }}
        transition={{
          duration: rolling ? 1.2 : 0.5,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        onAnimationComplete={() => {
          if (rolling) {
            lastFaceRef.current = result;
            onRollComplete?.();
          }
        }}
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            style={{
              width: size,
              height: size,
              transform: faceTransforms[num],
              position: 'absolute',
            }}
          >
            <DiceFace
              num={num}
              size={size}
              color={faceColor ?? FACE_COLORS[num]}
              borderColor={borderColor}
              pipColor={pipColor}
              themed={themed}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
