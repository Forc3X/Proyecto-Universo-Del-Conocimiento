'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useMemo, useEffect } from 'react';

interface Nebula3DProps {
  planetColor: string;
}

export default function Nebula3D({ planetColor }: Nebula3DProps) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useTransform(my, [0, 1], [3, -3]);
  const rotateY = useTransform(mx, [0, 1], [-3, 3]);

  useEffect(() => {
    let raf: number;
    let tx = 0.5, ty = 0.5, cx = 0.5, cy = 0.5;
    const onMove = (e: MouseEvent) => { tx = e.clientX / window.innerWidth; ty = e.clientY / window.innerHeight; };
    window.addEventListener('mousemove', onMove);
    const tick = () => { cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06; mx.set(cx); my.set(cy); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [mx, my]);

  const layers = useMemo(() => [
    { size: 700, blur: 90,  z: -120, xOff: 14, yOff: -8,  speed: 38, color: 'rgba(0, 100, 200, 0.045)', delay: 0 },
    { size: 500, blur: 70,  z: -40,  xOff: -16, yOff: 10, speed: 26, color: 'rgba(0, 200, 240, 0.03)',  delay: 3 },
    { size: 350, blur: 55,  z: 60,   xOff: 8,  yOff: -14, speed: 16, color: 'rgba(0, 130, 200, 0.025)', delay: 6 },
  ], []);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ perspective: 600, transformStyle: 'preserve-3d', rotateX, rotateY, willChange: 'transform' }}
    >
      {layers.map((l, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: l.size, height: l.size,
            left: `${25 + i * 12}%`, top: `${18 + i * 10}%`,
            transform: `translateZ(${l.z}px) translateZ(0)`,
            background: `radial-gradient(circle at 50% 50%, ${l.color}, transparent)`,
            filter: `blur(${l.blur}px)`,
            willChange: 'transform',
          }}
          animate={{ x: [l.xOff, -l.xOff * 0.6, l.xOff * 0.4, l.xOff], y: [l.yOff, -l.yOff * 0.4, l.yOff * 0.6, l.yOff] }}
          transition={{ duration: l.speed, repeat: Infinity, ease: 'easeInOut', delay: l.delay }}
        />
      ))}
    </motion.div>
  );
}
