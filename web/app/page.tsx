'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Planeta from './components/Planeta';

const CosmicBackground = dynamic(() => import('./FondoCosmico'), { ssr: false });

const PLANETAS_PREVIEW = [
  {
    nombre: 'Numérix',
    materia: 'Matemáticas',
    descripcion: 'Domina números, operaciones y geometría en un mundo de asteroides y cometas.',
    gradient: 'radial-gradient(circle at 35% 30%, #00f5ff 0%, #0080ff 40%, #0030b0 65%, #000d40 100%)',
    glow: '#00f5ff',
    glowColor: '#00e4ff',
    cursos: [
      { name: 'Cinturón de Asteroides', description: 'Sumas y restas básicas', levels: [{ name: 'Sumas básicas', description: '' }, { name: 'Restas básicas', description: '' }, { name: 'Reto del Cinturón', description: '' }] },
      { name: 'Campo de Cometas', description: 'Multiplicación y división', levels: [{ name: 'Tablas de multiplicar', description: '' }, { name: 'Multiplicación', description: '' }, { name: 'Reto del Cometa', description: '' }] },
    ],
  },
  {
    nombre: 'Letralia',
    materia: 'Lenguas',
    descripcion: 'Conquista las palabras, la gramática y la lectura en una galaxia literaria.',
    gradient: 'radial-gradient(circle at 35% 30%, #df80ff 0%, #9b30ff 35%, #5a00b0 65%, #1a0040 100%)',
    glow: '#bf40ff',
    glowColor: '#c840ff',
    cursos: [
      { name: 'Tormenta de Sílabas', description: 'Separación silábica y acentuación', levels: [{ name: 'Separación silábica', description: '' }, { name: 'Acentuación', description: '' }, { name: 'Reto de la Tormenta', description: '' }] },
    ],
  },
  {
    nombre: 'Naturae',
    materia: 'Ciencias',
    descripcion: 'Descubre los secretos de la naturaleza, los ecosistemas y el universo.',
    gradient: 'radial-gradient(circle at 35% 30%, #80ffb4 0%, #00e070 35%, #008040 65%, #001a14 100%)',
    glow: '#00ff88',
    glowColor: '#00f080',
    cursos: [
      { name: 'Bosque Cósmico', description: 'Seres vivos y reinos de la naturaleza', levels: [{ name: 'Seres vivos', description: '' }, { name: 'Reinos naturales', description: '' }, { name: 'Reto del Bosque', description: '' }] },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <CosmicBackground />

      <section className="relative z-10 flex flex-col items-center pt-16 min-h-[80vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6 cosmic-title"
          >
            UNIVERSO DEL CONOCIMIENTO
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-4">
            Una plataforma educativa gamificada que convierte el aprendizaje
            en un viaje espacial para niños de 10 a 12 años.
          </p>

          <p className="text-base md:text-lg text-cyan-300/70 font-semibold tracking-wider mb-10">
            ✦ Explora. Aprende. Brilla como una estrella. ✦
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                const header = document.querySelector('header button');
                if (header) (header as HTMLButtonElement).click();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm tracking-wider shadow-lg shadow-blue-600/30"
            >
              COMENZAR VIAJE
            </button>
            <Link
              href="/about"
              className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-sm tracking-wider"
            >
              MÁS INFORMACIÓN
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Explora los mundos del conocimiento
          </h2>
          <p className="text-slate-400 text-center max-w-xl mx-auto mb-12 text-sm">
            Cada planeta contiene cursos y niveles adaptados al ritmo de aprendizaje del estudiante.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {PLANETAS_PREVIEW.map((p, i) => (
              <motion.div
                key={p.nombre}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative group"
              >
                <div
                  className="rounded-2xl p-6 text-center border border-white/10 bg-white/5 backdrop-blur-sm
                    hover:border-white/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex justify-center mb-4">
                    <Planeta
                      nombre={p.nombre}
                      materia={p.materia}
                      gradient={p.gradient}
                      glow={p.glow}
                      glowColor={p.glowColor}
                      delay={i * 0.5}
                      cursos={p.cursos}
                    />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mt-2">{p.descripcion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>



      <style>{`
        .cosmic-title {
          background: linear-gradient(135deg, #ffffff 0%, #80f0ff 30%, #c080ff 60%, #80ffcc 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 30px rgba(0,200,255,0.4)) drop-shadow(0 0 60px rgba(150,0,255,0.2));
          animation: shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
