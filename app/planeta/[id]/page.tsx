'use client';

import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMemo, useCallback } from 'react';
import { getPlanetById, getLevelProgress } from '../../../lib/mock-data';
import type { Course } from '../../../shared/types';

const FondoCosmico = dynamic(() => import('../../FondoCosmico'), { ssr: false });

const PLANET_SYMBOLS: Record<string, string> = {
  'Numérix': '\u2211',
  'Letralia': '\u270E',
  'Naturae': '\u2618',
};

function PortalNode({
  number,
  available,
  color,
  isBoss,
}: {
  number: number;
  available: boolean;
  color: string;
  isBoss: boolean;
}) {
  const size = isBoss ? 80 : 66;

  const particles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      angle: (i / 5) * Math.PI * 2,
      radius: size * (0.55 + Math.random() * 0.2),
      size: 1.5 + Math.random() * 2,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    })),
    [size],
  );

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {available && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from var(--angle, 0deg), transparent 0deg, ${color} 60deg, transparent 120deg, ${color} 180deg, transparent 240deg, ${color} 300deg, transparent 360deg)`,
              padding: 2.5,
              WebkitMask: 'radial-gradient(circle at center, transparent 50%, #000 51%)',
              mask: 'radial-gradient(circle at center, transparent 50%, #000 51%)',
            }}
            animate={{ '--angle': '360deg' as any }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {available && particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              background: color,
              boxShadow: `0 0 6px ${color}`,
              opacity: 0.6,
            }}
            animate={{
              x: [Math.cos(p.angle) * p.radius * 0.6, Math.cos(p.angle + 1) * p.radius, Math.cos(p.angle) * p.radius * 0.6],
              y: [Math.sin(p.angle) * p.radius * 0.6, Math.sin(p.angle + 1) * p.radius, Math.sin(p.angle) * p.radius * 0.6],
              opacity: [0.2, 0.7, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}

        <div
          className="relative flex items-center justify-center rounded-full z-10 overflow-hidden"
          style={{
            width: '100%',
            height: '100%',
            background: available
              ? `radial-gradient(circle at 35% 30%, ${color}22, ${color}08)`
              : 'radial-gradient(circle at 35% 30%, #111, #0a0a14)',
            border: `2px solid ${available ? color + '88' : '#222'}`,
            boxShadow: available
              ? `0 0 25px ${color}44, 0 0 60px ${color}11, inset 0 0 30px ${color}22`
              : 'inset 0 0 20px rgba(0,0,0,0.3)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {available && (
            <motion.div
              className="absolute inset-0 rounded-full opacity-30"
              style={{ background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)` }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <span
            className="font-black relative z-10"
            style={{
              fontSize: isBoss ? 24 : 20,
              color: available ? '#fff' : '#333',
              textShadow: available ? `0 0 20px ${color}` : 'none',
              opacity: available ? 1 : 0.4,
            }}
          >
            {number}
          </span>
        </div>

        {available && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: size + 16,
              height: size + 16,
              border: `1px solid ${color}22`,
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        )}
      </div>

      <span
        className="text-xs font-bold tracking-wider text-center"
        style={{
          color: available ? '#ccc' : '#333',
          transition: 'color 0.3s ease',
        }}
      >
        Nivel {number}
      </span>
    </div>
  );
}

function CoursePortalSection({
  course,
  planetColor,
  planetId,
}: {
  course: Course;
  planetColor: string;
  planetId: number;
}) {
  return (
    <div className="mb-14 last:mb-0">
      <div className="text-center mb-8">
        <h2 className="text-base font-bold text-white/80 tracking-wide">{course.name}</h2>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

        <div className="relative">
          {course.levels.map((level, i) => {
            const prog = getLevelProgress(level.id);
            const available = prog.status !== 'locked';
            const isLeft = i % 2 === 0;

            const NodeContent = (
              <PortalNode
                number={level.order}
                available={available}
                color={planetColor}
                isBoss={level.isBoss}
              />
            );

            const node = available ? (
              <Link
                href={`/juego/${planetId}/${level.id}`}
                className="transition-transform duration-300 hover:scale-110"
              >
                {NodeContent}
              </Link>
            ) : (
              <div
                style={{ cursor: 'default' }}
                className="transition-transform duration-300"
              >
                {NodeContent}
              </div>
            );

            const beam = (
              <div className="flex-1 flex items-center justify-center">
                <div
                  className="h-px w-full max-w-[60px] transition-all duration-500"
                  style={{
                    background: available
                      ? `linear-gradient(90deg, ${planetColor}44, transparent)`
                      : 'linear-gradient(90deg, rgba(255,255,255,0.04), transparent)',
                  }}
                />
              </div>
            );

            const spacer = <div className="flex-1" />;

            return (
              <div key={level.id} className="mb-10 last:mb-0">
                <div className="relative flex items-center">
                  {isLeft ? (
                    <>
                      <div className="flex-1 flex justify-end items-center pr-4">
                        {node}
                      </div>
                      {beam}
                      <div className="w-px h-8 self-center shrink-0 relative z-10">
                        <div
                          className="w-2 h-2 rounded-full mx-auto -mt-1"
                          style={{
                            background: available ? planetColor : '#222',
                            boxShadow: available ? `0 0 10px ${planetColor}` : 'none',
                          }}
                        />
                      </div>
                      {spacer}
                    </>
                  ) : (
                    <>
                      {spacer}
                      <div className="w-px h-8 self-center shrink-0 relative z-10">
                        <div
                          className="w-2 h-2 rounded-full mx-auto -mt-1"
                          style={{
                            background: available ? planetColor : '#222',
                            boxShadow: available ? `0 0 10px ${planetColor}` : 'none',
                          }}
                        />
                      </div>
                      {beam}
                      <div className="flex-1 flex justify-start items-center pl-4">
                        {node}
                      </div>
                    </>
                  )}
                </div>

                {i < course.levels.length - 1 && (
                  <div className="flex justify-center h-8">
                    <div className="w-px h-full bg-gradient-to-b from-white/5 to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PlanetaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const planetId = parseInt(params.id, 10);
  const planet = useMemo(() => getPlanetById(planetId), [planetId]);

  if (!planet) {
    return (
      <div className="relative min-h-screen flex items-center justify-center" style={{ background: '#00000a' }}>
        <FondoCosmico />
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-black text-white mb-2">Portal no encontrado</h1>
          <p className="text-slate-400 text-sm mb-4">Este planeta no existe en el cosmos conocido...</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 rounded-full text-sm font-bold border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          >
            ← Volver al mapa
          </button>
        </div>
      </div>
    );
  }

  const symbol = PLANET_SYMBOLS[planet.name] || planet.icon;

  return (
    <div className="relative min-h-screen" style={{ background: '#00000a' }}>
      <FondoCosmico />
      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Mapa estelar
        </button>

        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}
            className="flex items-center justify-center mb-4"
          >
            <motion.div
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: 80,
                height: 80,
                background: planet.gradientStyle,
                boxShadow: `0 0 40px ${planet.glow}55, 0 0 80px ${planet.glow}22`,
              }}
              animate={{ boxShadow: [
                `0 0 40px ${planet.glow}55, 0 0 80px ${planet.glow}22`,
                `0 0 60px ${planet.glow}77, 0 0 120px ${planet.glow}33`,
                `0 0 40px ${planet.glow}55, 0 0 80px ${planet.glow}22`,
              ] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.span
                className="font-black"
                style={{
                  fontSize: 36,
                  color: '#fff',
                }}
                animate={{ textShadow: [
                  `0 0 20px ${planet.glow}`,
                  `0 0 40px ${planet.glow}`,
                  `0 0 20px ${planet.glow}`,
                ] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {symbol}
              </motion.span>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black tracking-wide"
            style={{
              background: `linear-gradient(135deg, #fff, ${planet.color})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {planet.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-sm text-slate-500 mt-2 max-w-md mx-auto"
          >
            {planet.description}
          </motion.p>
        </div>

        <div className="space-y-4">
          {planet.courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              <CoursePortalSection
                course={course}
                planetColor={planet.color}
                planetId={planet.id}
              />
              {i < planet.courses.length - 1 && (
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${planet.color}33, transparent)` }} />
                  <span className="text-[10px] text-slate-600 tracking-[0.3em]">&#x22CD;</span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${planet.color}33, transparent)` }} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}