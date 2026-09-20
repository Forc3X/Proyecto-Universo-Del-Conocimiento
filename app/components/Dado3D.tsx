'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Dado3DProps {
  size?: number;
  rolling?: boolean;
  result?: number;
  onRollComplete?: () => void;
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

function DiceFace({ num, size, color }: { num: number; size: number; color: string }) {
  const pips = DICE_PIP_LAYOUTS[num];
  const pipSize = size * 0.16;
  return (
    <div
      className="absolute flex items-center justify-center select-none"
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        background: `linear-gradient(145deg, ${color}ee, ${color}88)`,
        border: `1px solid ${color}55`,
        boxShadow: 'inset 0 0 25px rgba(0,0,0,0.25)',
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
              background: 'radial-gradient(circle, #fff 30%, rgba(255,255,255,0.6) 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Dado3D({ size = 80, rolling = false, result = 1, onRollComplete }: Dado3DProps) {
  const [rollKey, setRollKey] = useState(0);
  const half = size / 2;
  const target = FACE_ROTATIONS[result] || FACE_ROTATIONS[1];

  useEffect(() => {
    if (rolling) {
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

  const spinX = 360 * (3 + Math.floor(Math.random() * 2));
  const spinY = 360 * (3 + Math.floor(Math.random() * 2));

  return (
    <div
      className="flex items-center justify-center"
      style={{ perspective: size * 5, width: size, height: size }}
    >
      <motion.div
        key={`dice-${rollKey}`}
        initial={{ rotateX: 0, rotateY: 0 }}
        animate={{
          rotateX: target.rotateX + (rolling ? spinX : 0),
          rotateY: target.rotateY + (rolling ? spinY : 0),
        }}
        transition={{
          duration: rolling ? 1.2 : 0.5,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        onAnimationComplete={() => {
          if (rolling) onRollComplete?.();
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
            <DiceFace num={num} size={size} color={FACE_COLORS[num]} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
