

'use client';

import { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    // Ajustar el canvas al tamaño de la pantalla
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateUniverse();
    };

    // Estructuras para almacenar los elementos del espacio
    let stars = [];
    let nebulae = [];

    const generateUniverse = () => {
      stars = [];
      nebulae = [];
      const w = canvas.width;
      const h = canvas.height;

      // 1. Definir Nebulosas / Cúmulos de Gas (Gradientes radiales gigantes)
      // Cúmulo central brillante (Blanco/Azul claro)
      nebulae.push({
        x: w * 0.5,
        y: h * 0.5,
        r: Math.min(w, h) * 0.25,
        colorStart: 'rgba(163, 191, 250, 0.12)',
        colorEnd: 'rgba(163, 191, 250, 0)'
      });
      // Nebulosa alargada izquierda (Azul Turquesa)
      nebulae.push({
        x: w * 0.25,
        y: h * 0.45,
        r: Math.min(w, h) * 0.4,
        colorStart: 'rgba(20, 110, 150, 0.15)',
        colorEnd: 'rgba(20, 110, 150, 0)'
      });
      // Brillo Violeta Derecho
      nebulae.push({
        x: w * 0.8,
        y: h * 0.7,
        r: Math.min(w, h) * 0.5,
        colorStart: 'rgba(130, 30, 170, 0.1)',
        colorEnd: 'rgba(130, 30, 170, 0)'
      });

      // 2. Generar Estrellas de Fondo (Distribución normal)
      const numStars = Math.floor((w * h) / 3000); 
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.2 + 0.2,
          opacity: Math.random() * 0.6 + 0.2,
          twinkle: Math.random() * 0.02
        });
      }

      // 3. Generar la Constelación Diagonal / Cúmulo denso (Efecto Galaxia)
      // Generamos estrellas concentradas en una franja diagonal que cruza el centro
      const numClusterStars = 400;
      for (let i = 0; i < numClusterStars; i++) {
        // Distribución en línea diagonal con dispersión gaussiana simulada
        const progress = Math.random(); // De izquierda a derecha
        const baseX = w * (0.1 + progress * 0.8);
        const baseY = h * (0.5 - (progress - 0.5) * 0.3); // Inclinación diagonal sutil

        // Dispersión alrededor de la línea central de la galaxia
        const dispersionX = (Math.random() - 0.5) * (w * 0.25);
        const dispersionY = (Math.random() - 0.5) * (h * 0.2);

        stars.push({
          x: baseX + dispersionX,
          y: baseY + dispersionY,
          // Estrellas del centro de la galaxia son ligeramente más brillantes/grandes
          size: Math.random() * 1.6 + 0.4,
          opacity: Math.random() * 0.8 + 0.2,
          twinkle: Math.random() * 0.03
        });
      }
    };

    // Renderizado continuo
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Limpiar lienzo con el degradado oscuro de Next.js base
      const bgGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h));
      ctx.fillStyle = '#010103';
      ctx.fillRect(0, 0, w, h);

      // Dibujar fondo de degradado CSS simulado en canvas
      const cosmicGrad = ctx.createRadialGradient(w * 0.1, h * 0.1, 10, w * 0.5, h * 0.5, Math.max(w, h));
      cosmicGrad.addColorStop(0, '#010103');
      cosmicGrad.addColorStop(0.4, '#110b25');
      cosmicGrad.addColorStop(1, '#2a114f');
      ctx.fillStyle = cosmicGrad;
      ctx.fillRect(0, 0, w, h);

      // Aplicar modo de fusión de pantalla para que las nebulosas sumen luz
      ctx.globalCompositeOperation = 'screen';

      // Dibujar Nubes de Gas/Nebulosas
      nebulae.forEach((neb) => {
        const g = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);
        g.addColorStop(0, neb.colorStart);
        g.addColorStop(1, neb.colorEnd);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Dibujar Estrellas e imitar el parpadeo (twinkle)
      ctx.globalCompositeOperation = 'source-over';
      stars.forEach((star) => {
        // Modificar opacidad sutilmente para el efecto de brillo vivo
        star.opacity += star.twinkle;
        if (star.opacity > 0.9 || star.opacity < 0.1) {
          star.twinkle = -star.twinkle;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, star.opacity)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Inicializa y genera el espacio
    render();       // Inicia la animación

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none z-0"
    />
  );
}