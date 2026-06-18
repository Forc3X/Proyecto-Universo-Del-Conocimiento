import { useEffect, useRef } from 'react';

export default function FondoCosmico() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = (count) => {
      stars = [];
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2.2;
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: size,
          baseAlpha: Math.random() * 0.7 + 0.3,
          alpha: 0,
          speed: Math.random() * 0.008 + 0.002,
          phase: Math.random() * Math.PI * 2,
          color: pickStarColor(),
        });
      }
    };

    const pickStarColor = () => {
      const palette = [
        '255,255,255',
        '180,220,255',
        '200,180,255',
        '150,255,220',
        '255,220,180',
      ];
      return palette[Math.floor(Math.random() * palette.length)];
    };

    const drawStar = (star, time) => {
      star.alpha = star.baseAlpha * (0.5 + 0.5 * Math.sin(time * star.speed * 60 + star.phase));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
      ctx.shadowBlur = star.radius > 1.4 ? 8 : 0;
      ctx.shadowColor = `rgba(${star.color}, 0.8)`;
      ctx.fill();
    };

    const drawShootingStar = (time) => {
      if (Math.floor(time * 10) % 130 === 0) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2);
        const len = 120 + Math.random() * 80;
        const grad = ctx.createLinearGradient(x, y, x + len, y + len * 0.4);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.4, 'rgba(200,240,255,0.85)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + len, y + len * 0.4);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    let lastTime = 0;
    const animate = (timestamp) => {
      const time = timestamp / 1000;
      lastTime = time;

      // Deep space background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle deep space gradient base
      const bg = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.85
      );
      bg.addColorStop(0, 'rgba(5, 0, 22, 1)');
      bg.addColorStop(0.5, 'rgba(2, 0, 15, 1)');
      bg.addColorStop(1, 'rgba(0, 0, 8, 1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant nebula glow patches
      const drawNebulaCloud = (cx, cy, r, color, alpha) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${color}, ${alpha})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      };

      drawNebulaCloud(canvas.width * 0.15, canvas.height * 0.2, 300, '30,200,120', 0.04);
      drawNebulaCloud(canvas.width * 0.8, canvas.height * 0.1, 250, '100,50,200', 0.05);
      drawNebulaCloud(canvas.width * 0.5, canvas.height * 0.7, 350, '0,180,200', 0.04);
      drawNebulaCloud(canvas.width * 0.9, canvas.height * 0.8, 280, '80,20,160', 0.04);
      drawNebulaCloud(canvas.width * 0.1, canvas.height * 0.85, 220, '20,160,100', 0.035);

      ctx.shadowBlur = 0;
      stars.forEach((star) => drawStar(star, time));
      drawShootingStar(time);

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createStars(320);
    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      resize();
      createStars(320);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        display: 'block',
      }}
    />
  );
}
