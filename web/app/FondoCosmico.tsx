'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  speed: number;
  phase: number;
  color: string;
}

const STAR_COUNT = 80;
const STAR_COLORS = [
  '255,255,255',
  '180,220,255',
  '200,180,255',
  '150,255,220',
  '255,220,180',
];

function pickStarColor(): string {
  return STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
}

function createStars(w: number, h: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 2.2,
      baseAlpha: Math.random() * 0.7 + 0.3,
      alpha: 0,
      speed: Math.random() * 0.008 + 0.002,
      phase: Math.random() * Math.PI * 2,
      color: pickStarColor(),
    });
  }
  return stars;
}

let nebulaCache: HTMLCanvasElement | null = null;

function buildNebulaCache(w: number, h: number): HTMLCanvasElement {
  if (nebulaCache && nebulaCache.width === w && nebulaCache.height === h) {
    return nebulaCache;
  }

  const offscreen = document.createElement('canvas');
  offscreen.width = w;
  offscreen.height = h;
  const ctx = offscreen.getContext('2d');
  if (!ctx) return offscreen;

  const clouds: [number, number, number, string, number][] = [
    [w * 0.15, h * 0.2, 300, '30,200,120', 0.04],
    [w * 0.8, h * 0.1, 250, '100,50,200', 0.05],
    [w * 0.5, h * 0.7, 350, '0,180,200', 0.04],
    [w * 0.9, h * 0.8, 280, '80,20,160', 0.04],
    [w * 0.1, h * 0.85, 220, '20,160,100', 0.035],
  ];

  for (const [cx, cy, r, color, alpha] of clouds) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `rgba(${color}, ${alpha})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  nebulaCache = offscreen;
  return offscreen;
}

export default function FondoCosmico() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let isVisible = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = createStars(canvas.width, canvas.height);
      nebulaCache = null;
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };

    const handleResize = () => {
      resize();
    };

    const animate = (timestamp: number) => {
      if (!isVisible) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const time = timestamp / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bg = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.85,
      );
      bg.addColorStop(0, 'rgba(5, 0, 22, 1)');
      bg.addColorStop(0.5, 'rgba(2, 0, 15, 1)');
      bg.addColorStop(1, 'rgba(0, 0, 8, 1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebula = buildNebulaCache(canvas.width, canvas.height);
      ctx.drawImage(nebula, 0, 0);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha = star.baseAlpha * (0.5 + 0.5 * Math.sin(time * star.speed * 60 + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
        ctx.fill();
      }

      if (Math.floor(time) % 13 === 0 && Math.floor(time * 10) % 7 === 0) {
        const sx = Math.random() * canvas.width;
        const sy = Math.random() * (canvas.height / 2);
        const len = 120 + Math.random() * 80;
        const grad = ctx.createLinearGradient(sx, sy, sx + len, sy + len * 0.4);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.4, 'rgba(200,240,255,0.85)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + len, sy + len * 0.4);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animationId = requestAnimationFrame(animate);

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 block w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
