'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FondoCosmico = dynamic(() => import('../FondoCosmico'), { ssr: false });

const TECH_STACK = [
  { name: 'Next.js 16', desc: 'Framework React con App Router y renderizado híbrido.', icon: '⚛️' },
  { name: 'TypeScript', desc: 'Tipado estricto para mayor robustez.', icon: '📘' },
  { name: 'Tailwind CSS v4', desc: 'Estilos utilitarios con diseño responsivo.', icon: '🎨' },
  { name: 'Framer Motion', desc: 'Animaciones fluidas y transiciones.', icon: '✨' },
  { name: 'Zustand', desc: 'Estado global liviano con persistencia.', icon: '🗄️' },
  { name: 'Express 5 + MySQL', desc: 'API REST con base de datos relacional.', icon: '🗃️' },
  { name: 'Ollama + Gemma', desc: 'IA local adaptativa para generar preguntas (próximamente).', icon: '🤖' },
];

const planetasInfo = [
  {
    nombre: 'Numérix', icon: '🔢', materia: 'Matemáticas',
    desc: 'Números, operaciones, geometría y razonamiento lógico.',
    gradient: 'from-cyan-500/20 to-blue-900/30',
    border: 'border-cyan-500/30',
    glow: '#00f5ff',
  },
  {
    nombre: 'Verbum', icon: '📖', materia: 'Lengua',
    desc: 'Gramática, vocabulario, ortografía y comprensión lectora.',
    gradient: 'from-purple-500/20 to-indigo-900/30',
    border: 'border-purple-500/30',
    glow: '#bf40ff',
  },
  {
    nombre: 'Naturae', icon: '🌿', materia: 'Ciencias',
    desc: 'Seres vivos, ecosistemas, energía y el universo.',
    gradient: 'from-green-500/20 to-teal-900/30',
    border: 'border-green-500/30',
    glow: '#00ff88',
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <FondoCosmico />

      <div className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 cosmic-glow">
              🌌 Universo del Conocimiento
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Una plataforma educativa gamificada que convierte el refuerzo escolar
              en un <strong className="text-cyan-300">viaje espacial interactivo</strong> para niños de 10 a 12 años.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-white mb-4">📖 ¿Cómo nació este proyecto?</h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                Este proyecto nace como <strong className="text-white">Tesis de Grado</strong> del PNF Informática,
                Trayecto II, en la <strong className="text-white">UPTAEB &ldquo;Federico Brito Figueroa&rdquo;</strong>
                (La Victoria, Estado Aragua, Venezuela).
              </p>
              <p>
                La meta es ofrecer una herramienta <strong className="text-cyan-300">offline, gratuita y sin castigos</strong>
                que ayude a niños de educación primaria a reforzar sus conocimientos en
                Matemática, Lengua y Ciencias Naturales, usando juegos que motivan el aprendizaje.
              </p>
              <p className="text-slate-500 text-xs mt-4">
                Porque aprender puede ser tan emocionante como explorar el espacio 🚀
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🪐 Los planetas del conocimiento
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {planetasInfo.map((p, i) => (
                <motion.div
                  key={p.nombre}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`bg-gradient-to-br ${p.gradient} border ${p.border} rounded-xl p-6 text-center hover:scale-105 transition-transform`}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    className="text-5xl mb-3"
                  >
                    {p.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-1">{p.nombre}</h3>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">{p.materia}</p>
                  <p className="text-sm text-slate-300">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-white mb-4">⚙️ Tecnología usada</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {TECH_STACK.map((tech) => (
                <div key={tech.name} className="flex items-start gap-3">
                  <div className="text-xl mt-0.5">{tech.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-white">{tech.name}</div>
                    <div className="text-xs text-slate-400">{tech.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center gap-4"
          >
            <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              ← Volver al inicio
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        .cosmic-glow {
          text-shadow: 0 0 30px rgba(0,200,255,0.3), 0 0 60px rgba(150,0,255,0.15);
        }
      `}</style>
    </div>
  );
}
