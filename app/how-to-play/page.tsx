import Link from 'next/link';

const RULES = [
  {
    icon: '⚡',
    title: 'Combustible de Reactor',
    desc: 'Cada intento consume una unidad de combustible. El tanque se recarga cada 24 horas. Cuando se agota, el estudiante debe esperar para volver a jugar.',
    color: 'from-yellow-500/20 to-orange-900/30',
    border: 'border-yellow-500/30',
  },
  {
    icon: '🎲',
    title: 'Dado 3D',
    desc: 'Lanza el dado para avanzar por la ruta perimetral. Cada número determina cuántas casillas avanzas.',
    color: 'from-cyan-500/20 to-blue-900/30',
    border: 'border-cyan-500/30',
  },
  {
    icon: '💊',
    title: 'Cápsulas de Conocimiento',
    desc: 'Son las casillas de pregunta. La IA genera preguntas adaptativas según tu historial. Si la IA no responde a tiempo, un banco local de preguntas toma el control.',
    color: 'from-purple-500/20 to-indigo-900/30',
    border: 'border-purple-500/30',
  },
  {
    icon: '🕳️',
    title: 'Retroceso (sin frustración)',
    desc: 'Si respondes mal, retrocedes 3 casillas. NUNCA te expulsan ni borran tu progreso. ¡El error es parte del aprendizaje!',
    color: 'from-red-500/20 to-rose-900/30',
    border: 'border-red-500/30',
  },
  {
    icon: '🪐',
    title: 'Eventos especiales',
    desc: 'Durante tu viaje espacial encontrarás diferentes tipos de casillas: Normales (retos matemáticos), Especiales (minijuegos de calibración y escudos), Trampas (desvíos peligrosos) y la casilla final del Guardián.',
    color: 'from-green-500/20 to-teal-900/30',
    border: 'border-green-500/30',
  },
  {
    icon: '🏆',
    title: 'Comandante del Planeta',
    desc: 'Al llegar al final del tablero, enfrentarás un desafío contrarreloj. Usa comodines (Materia Oscura, Distorsión Temporal, Salto Hiperespacial) para ganar.',
    color: 'from-pink-500/20 to-fuchsia-900/30',
    border: 'border-pink-500/30',
  },
];

const ROLES = [
  {
    icon: '👨‍🚀',
    title: 'Estudiante',
    desc: 'Juega, aprende, gana estrellas y avanza por los planetas.',
    color: 'from-cyan-500/20 to-blue-900/30',
    border: 'border-cyan-500/30',
  },
  {
    icon: '👩‍🏫',
    title: 'Tutor / Maestro',
    desc: 'Supervisa el progreso de tus estudiantes, ve reportes y accede a la guía pedagógica de cada nivel.',
    color: 'from-purple-500/20 to-indigo-900/30',
    border: 'border-purple-500/30',
  },
  {
    icon: '🛠️',
    title: 'Administrador',
    desc: 'Gestiona los usuarios del sistema y asigna roles (tutor o estudiante).',
    color: 'from-red-500/20 to-rose-900/30',
    border: 'border-red-500/30',
  },
];

const STEPS = [
  { step: '1', text: 'Inicia sesión y selecciona un planeta (Numérix, Letralia o Naturae).' },
  { step: '2', text: 'Elige un nivel o estación orbital disponible.' },
  { step: '3', text: 'Mira la Micro-Clase "Transmisión Base Tierra" con la explicación del tema.' },
  { step: '4', text: 'Lanza el dado para avanzar en la Ruta Perimetral.' },
  { step: '5', text: 'Responde las preguntas de la IA. Si aciertas, ganas Stardust. Si fallas, retrocedes.' },
  { step: '6', text: 'Al llegar al final, enfréntate al Comandante del Planeta para desbloquear la siguiente estación.' },
];

export default function HowToPlayPage() {
  return (
    <div className="relative min-h-screen" style={{ background: '#00000a' }}>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 pb-24">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center fade-in-up">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 cosmic-glow">
              🚀 Cómo Jugar
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Conviértete en un astronauta del conocimiento y explora el Universo.
              ¡Cada planeta es una aventura nueva!
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-6 fade-in-up delay-100">
            {RULES.map((rule, i) => (
              <div
                key={rule.title}
                className={`bg-gradient-to-br ${rule.color} border ${rule.border} rounded-xl p-6 hover:scale-[1.02] transition-all fade-in-left`}
              >
                <div className="text-3xl mb-3 inline-block animate-wiggle">
                  {rule.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{rule.title}</h3>
                <p className="text-base md:text-lg text-slate-300 leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm fade-in-up delay-200">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">📋 Flujo del juego</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STEPS.map((s) => (
                <div key={s.step} className="flex gap-3 items-start bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {s.step}
                  </div>
                  <p className="text-base text-slate-300 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="fade-in-up delay-300">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">👥 Roles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {ROLES.map((role, i) => (
                <div
                  key={role.title}
                  className={`bg-gradient-to-br ${role.color} border ${role.border} rounded-xl p-6 text-center hover:scale-105 transition-transform fade-in-up`}
                >
                  <div className="text-4xl mb-3 animate-float">
                    {role.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{role.title}</h3>
                  <p className="text-base text-slate-300 leading-relaxed">{role.desc}</p>
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
