'use client';

import { useMemo } from 'react';

export default function NebulaParticles() {
  const p = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i, x: 2 + Math.random() * 96, y: 2 + Math.random() * 96, s: 1 + Math.random() * 2,
    dur: 10 + Math.random() * 8, del: Math.random() * 10, dx: (Math.random() - 0.5) * 50, dy: (Math.random() - 0.5) * 50,
    h: Math.random() > 0.5 ? 190 + Math.random() * 30 : 210 + Math.random() * 20,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      <style>{p.map((pt) => `
        @keyframes np${pt.id} {
          0%,100% { transform: translate(0,0); opacity: 0; }
          20% { opacity: ${0.15 + Math.random() * 0.2}; }
          50% { transform: translate(${pt.dx}px,${pt.dy}px); opacity: ${0.1 + Math.random() * 0.15}; }
          80% { opacity: ${0.05 + Math.random() * 0.1}; }
        }
      `).join('\n')}</style>
      {p.map((pt) => (
        <div key={pt.id} className="absolute rounded-full" style={{
          left: `${pt.x}%`, top: `${pt.y}%`, width: pt.s, height: pt.s,
          background: `hsla(${pt.h},80%,60%,0.35)`,
          boxShadow: `0 0 ${pt.s * 3}px hsla(${pt.h},80%,60%,0.15)`,
          animation: `np${pt.id} ${pt.dur}s ease-in-out ${pt.del}s infinite`,
        }} />
      ))}
    </div>
  );
}
