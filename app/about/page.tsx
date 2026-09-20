import Link from 'next/link';

const planetasInfo = [
  {
    nombre: 'Numérix', icon: '🔢', materia: 'Matemáticas',
    desc: 'Números, operaciones, geometría y razonamiento lógico.',
    gradient: 'from-cyan-500/20 to-blue-900/30',
    border: 'border-cyan-500/30',
    glow: '#00f5ff',
  },
  {
    nombre: 'Letralia', icon: '📖', materia: 'Lenguas',
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
    <div className="relative min-h-screen" style={{ background: '#00000a' }}>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 pb-24">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center fade-in-up">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 cosmic-glow">
              🌌 Universo del Conocimiento
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Una plataforma educativa gamificada que convierte el refuerzo escolar
              en un <strong className="text-cyan-300">viaje espacial interactivo</strong> para niños de 10 a 12 años.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm fade-in-up delay-100">
            <h2 className="text-2xl font-bold text-white mb-4">📖 ¿Cómo nació este proyecto?</h2>
            <div className="space-y-4 text-slate-300 text-base md:text-lg leading-relaxed">
              <p>
                Este proyecto nace de la necesidad de formar jóvenes mediante técnicas
                poco convencionales, combinando la educación con dinámicas de juego para
                hacer del aprendizaje una experiencia atractiva y significativa.
              </p>
              <p>
                La meta es ofrecer una herramienta <strong className="text-cyan-300">offline, gratuita y sin castigos</strong>
                que ayude a niños de educación primaria a reforzar sus conocimientos en
                Matemática, Lengua y Ciencias Naturales, usando juegos que motivan el aprendizaje.
              </p>
              <p className="text-slate-400 text-sm md:text-base mt-6 font-medium">
                Porque aprender puede ser tan emocionante como explorar el espacio 🚀
              </p>
            </div>
          </section>

          <section className="fade-in-up delay-200">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🪐 Los planetas del conocimiento
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {planetasInfo.map((p, i) => (
                <div
                  key={p.nombre}
                  className={`bg-gradient-to-br ${p.gradient} border ${p.border} rounded-xl p-6 text-center hover:scale-105 transition-transform fade-in-scale`}
                >
                  <div className="text-5xl mb-3 animate-float">
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{p.nombre}</h3>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">{p.materia}</p>
                  <p className="text-sm text-slate-300">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-center gap-4 fade-in-up">
            <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
