'use client';

import { motion } from 'framer-motion';

interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  category: { id: string; color: string };
}

interface StarNodeProps {
  star: StarData;
  isCurrent: boolean;
  isCompleted: boolean;
  isHovered: boolean;
  planetColor: string;
  index: number;
  onHover: (id: number | null) => void;
  onClick: (id: number) => void;
}

export default function StarNode({
  star, isCurrent, isCompleted, isHovered, planetColor, onHover, onClick,
}: StarNodeProps) {
  const gi = isCurrent ? 1 : isCompleted ? 0.7 : isHovered ? 0.5 : 0;
  const pd = 2.5 + (star.id % 5) * 0.4;

  return (
    <motion.button
      onMouseEnter={() => onHover(star.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(star.id)}
      className="star-node absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ left: `${star.x}%`, top: `${star.y}%`, zIndex: isCurrent ? 30 : isHovered ? 20 : 5 }}
      whileHover={{ scale: 1.3, zIndex: 30 }}
      whileTap={{ scale: 0.85 }}
    >
      <div
        className="relative flex items-center justify-center rounded-full star-float"
        style={{
          width: star.size, height: star.size,
          animationDuration: `${3 + (star.id % 4) * 0.5}s`,
          animationDelay: `${star.id * 0.3}s`,
        }}
      >
        {isCurrent && [0, 1, 2].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full"
            style={{ border: `1px solid ${planetColor}`, boxShadow: `0 0 8px ${planetColor}66` }}
            animate={{
              width: [star.size, star.size + 24 + ring * 16],
              height: [star.size, star.size + 24 + ring * 16],
              opacity: [0.6, 0],
            }}
            transition={{ duration: 1.8, repeat: Infinity, delay: ring * 0.4, ease: 'easeOut' }}
          />
        ))}

        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: isCompleted
              ? `radial-gradient(circle at 35% 25%, ${star.category.color}cc, ${star.category.color}44)`
              : isCurrent
                ? `radial-gradient(circle at 35% 25%, ${planetColor}ee, ${planetColor}55)`
                : `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
            border: `1.5px solid ${
              isCompleted ? star.category.color + 'dd'
              : isCurrent ? planetColor + 'ee'
              : isHovered ? star.category.color + '77'
              : 'rgba(255,255,255,0.08)'
            }`,
            boxShadow: isCompleted
              ? `0 0 ${16 + gi * 20}px ${star.category.color}66, inset 0 0 ${8 + gi * 10}px ${star.category.color}33`
              : isCurrent
                ? `0 0 30px ${planetColor}66, 0 0 60px ${planetColor}33, inset 0 0 15px ${planetColor}33`
                : isHovered
                  ? `0 0 12px ${star.category.color}44`
                  : `0 0 4px rgba(255,255,255,0.04)`,
            transition: 'box-shadow 0.5s ease, border-color 0.4s ease, background 0.5s ease',
          }}
        />

        {isCompleted && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle at 50% 50%, ${star.category.color}44, transparent 70%)` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.15, 0.4] }}
            transition={{ duration: pd, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {isCurrent && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle at 50% 50%, ${planetColor}44, transparent 70%)` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <span
          className="relative z-10 font-black select-none"
          style={{
            fontSize: isCurrent ? 15 : isCompleted ? 14 : 10,
            color: isCompleted || isCurrent ? '#fff' : 'rgba(255,255,255,0.4)',
            textShadow: isCompleted ? `0 0 10px ${star.category.color}` : isCurrent ? `0 0 15px ${planetColor}` : 'none',
          }}
        >
          {star.id}
        </span>

        {isCompleted && (
          <motion.div
            className="absolute -top-1 -right-1 w-[14px] h-[14px] rounded-full flex items-center justify-center"
            style={{ background: star.category.color, boxShadow: `0 0 10px ${star.category.color}` }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <span className="text-[6px] font-black text-white">✓</span>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
