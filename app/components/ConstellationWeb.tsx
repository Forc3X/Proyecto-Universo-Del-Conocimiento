'use client';

import { useRef, useState, useEffect, useMemo } from 'react';

interface StarPosition {
  id: number;
  x: number;
  y: number;
  category: { id: string; color: string };
  connections: number[];
}

interface ConstellationWebProps {
  stars: StarPosition[];
  completedStars: Set<number>;
  currentStarId: number;
  planetColor: string;
}

export default function ConstellationWeb({ stars, completedStars, planetColor }: ConstellationWebProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 800 });

  useEffect(() => {
    const m = () => { if (svgRef.current) { const r = svgRef.current.getBoundingClientRect(); if (r.width > 0 && r.height > 0) setDims({ w: r.width, h: r.height }); } };
    m();
    const ro = new ResizeObserver(m);
    if (svgRef.current) ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, []);

  const toPx = (x: number, y: number) => ({ px: (x / 100) * dims.w, py: (y / 100) * dims.h });
  const starMap = useMemo(() => { const m = new Map<number, StarPosition>(); stars.forEach(s => m.set(s.id, s)); return m; }, [stars]);

  const lines: { from: StarPosition; to: StarPosition; type: 'path' | 'constellation'; active: boolean; }[] = [];

  for (let i = 0; i < stars.length - 1; i++) {
    const from = stars[i], to = stars[i + 1];
    lines.push({ from, to, type: 'path', active: completedStars.has(from.id) && completedStars.has(to.id) });
  }

  const drawnPairs = new Set<string>();
  stars.forEach(star => {
    star.connections.forEach(connId => {
      const conn = starMap.get(connId);
      if (!conn) return;
      const key = `${Math.min(star.id, connId)}-${Math.max(star.id, connId)}`;
      if (drawnPairs.has(key)) return;
      drawnPairs.add(key);
      if (Math.abs(star.id - conn.id) !== 1)
        lines.push({ from: star, to: conn, type: 'constellation', active: completedStars.has(star.id) && completedStars.has(conn.id) });
    });
  });

  return (
    <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }}>
      <defs>
        <filter id="wg"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {lines.map((line, i) => {
        const p1 = toPx(line.from.x, line.from.y), p2 = toPx(line.to.x, line.to.y);
        const cx = (p1.px + p2.px) / 2, cy = (p1.py + p2.py) / 2;
        const cpx = cx + (p2.py - p1.py) * 0.12, cpy = cy - (p2.px - p1.px) * 0.12;
        const d = `M ${p1.px} ${p1.py} Q ${cpx} ${cpy} ${p2.px} ${p2.py}`;

        if (line.type === 'path') return (
          <g key={i}>
            <path d={d} fill="none" stroke={line.active ? planetColor + '99' : planetColor + '20'} strokeWidth={line.active ? 2.5 : 1} strokeDasharray={line.active ? 'none' : '4 4'} opacity={line.active ? 0.8 : 0.2} style={{ transition: 'all 0.6s ease' }} />
            {line.active && <path d={d} fill="none" stroke={planetColor} strokeWidth={1.5} opacity={0.35} filter="url(#wg)" />}
          </g>
        );
        if (line.type === 'constellation') return (
          <g key={i}>
            <path d={d} fill="none" stroke={line.active ? line.from.category.color + '77' : `${planetColor}10`} strokeWidth={line.active ? 1.5 : 0.5} opacity={line.active ? 0.6 : 0.1} style={{ transition: 'all 0.8s ease' }} />
            {line.active && <circle cx={cx} cy={cy} r={2} fill={line.from.category.color} opacity={0.5}><animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite"/></circle>}
          </g>
        );
        return null;
      })}
    </svg>
  );
}
