'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Dado3D from './Dado3D';
import MapaAstral from './letralia/MapaAstral';
import AltarDecodificacion, {
  type ModalRetoActivo,
  type ResultadoAltar,
} from './letralia/AltarDecodificacion';
import {
  CASILLA_BOSS,
  CASILLAS_RAMA,
  CASILLAS_START,
  INFO_RAMA,
  ORIGEN_G,
  ORIGEN_S,
  TOTAL_RECORRIDO,
  construirRuta,
  type Casilla,
  type Pt,
  type Rama,
} from './letralia/mapa';
import {
  PALABRAS_LLAVE,
  RETOS_GUARDIAN,
  RETOS_INTRUSO,
  RETOS_PUENTE,
  RETOS_TORMENTA,
  elegirSinRepetir,
} from '../../lib/preguntas-letralia';

interface TableroLetraliaProps {
  onPositionChange?: (pos: number) => void;
}

const COLORES_CRISTAL = [
  { nombre: 'Celeste', top: '#7DD3FC', mid: '#38BDF8', dark: '#0284C7', bg: '#E0F2FE' },
  { nombre: 'Coral-Ámbar', top: '#FDBA74', mid: '#FB923C', dark: '#C2410C', bg: '#FFEDD5' },
  { nombre: 'Lavanda', top: '#C4B5FD', mid: '#A78BFA', dark: '#6D28D9', bg: '#EDE9FE' },
  { nombre: 'Menta', top: '#6EE7B7', mid: '#34D399', dark: '#047857', bg: '#D1FAE5' },
];

/** Icono SVG de cristal facetado para las 4 ranuras de Sílabas Clave (fiel a Imagen 1). */
function IconoCristal({
  indice,
  activo,
}: {
  indice: number;
  activo: boolean;
}) {
  const c = COLORES_CRISTAL[indice % COLORES_CRISTAL.length];
  return (
    <svg width="36" height="38" viewBox="0 0 36 38" className="overflow-visible select-none">
      <g opacity={activo ? 1 : 0.28}>
        {/* Sombra base */}
        <ellipse cx="18" cy="34" rx="10" ry="2.8" fill="#1E1B4B" opacity="0.22" />
        {/* Cristal principal */}
        <polygon
          points="18,3 27,13 23,31 13,31 9,13"
          fill={c.mid}
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Faceta luminosa izquierda */}
        <polygon points="18,3 27,13 18,17 9,13" fill={c.top} />
        <polygon points="18,3 18,17 9,13" fill="#FFFFFF" opacity="0.55" />
        {/* Cristal secundario pequeño a la derecha */}
        <polygon
          points="28,15 33,21 30,31 24,31 25,21"
          fill={c.top}
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Cristal secundario pequeño a la izquierda */}
        <polygon
          points="8,17 12,22 11,31 6,31 5,22"
          fill={c.dark}
          opacity="0.75"
          stroke="#FFFFFF"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function TableroLetralia({ onPositionChange }: TableroLetraliaProps) {
  const router = useRouter();

  /* ── Palabra Llave de 4 sílabas para esta partida ── */
  const [indicePalabraLlave, setIndicePalabraLlave] = useState(0);
  const palabraActual = PALABRAS_LLAVE[indicePalabraLlave % PALABRAS_LLAVE.length];

  /* ── Estado del recorrido sobre el mapa de 36 casillas ── */
  const [ramaElegida, setRamaElegida] = useState<Rama | null>(null);
  const [casillaActual, setCasillaActual] = useState<Casilla | null>(null);
  const [posPantalla, setPosPantalla] = useState<Pt>(ORIGEN_S);
  const [rastroG, setRastroG] = useState<Pt[]>([ORIGEN_G]);
  const [visitadas, setVisitadas] = useState<Set<string>>(() => new Set());
  const [completadas, setCompletadas] = useState<Set<string>>(() => new Set());

  /* ── Animación de El Viajero y el Dado ── */
  const [rodandoDado, setRodandoDado] = useState(false);
  const [resultadoDado, setResultadoDado] = useState(1);
  const [caminando, setCaminando] = useState(false);
  const [mirando, setMirando] = useState<1 | -1>(1);
  const [saltoKey, setSaltoKey] = useState(0);
  const [turno, setTurno] = useState(1);

  /* ── Encrucijada Astral en `start_5` ── */
  const [eligiendoRama, setEligiendoRama] = useState(false);
  const [pasosRestantesTrasRama, setPasosRestantesTrasRama] = useState(0);

  /* ── Inventario de 4 Sílabas Clave y progreso ── */
  const [silabasObtenidas, setSilabasObtenidas] = useState<[boolean, boolean, boolean, boolean]>([
    false,
    false,
    false,
    false,
  ]);
  const [aciertosTotales, setAciertosTotales] = useState(0);
  const [avisoFlotante, setAvisoFlotante] = useState<string | null>(
    '¡Lanza el dado astral para comenzar tu viaje por Letralia!',
  );

  /* ── Modal "Altar de Decodificación" y Códice ── */
  const [modalActivo, setModalActivo] = useState<ModalRetoActivo | null>(null);
  const [mostrarCodice, setMostrarCodice] = useState(false);
  const [victoriaFinal, setVictoriaFinal] = useState(false);

  /* ── Bancos de preguntas usados para no repetir ── */
  const usadosIntruso = useRef<Set<string>>(new Set());
  const usadosPuente = useRef<Set<string>>(new Set());
  const usadosTormenta = useRef<Set<string>>(new Set());
  const usadosGuardian = useRef<Set<string>>(new Set());

  // Ruta activa según la rama elegida
  const rutaActiva = useMemo(() => construirRuta(ramaElegida), [ramaElegida]);

  // Índice efectivo (0..16, donde 0 = antes de start_1, 1..5 = start_1..5, 6..15 = rama_1..10, 16 = boss_36)
  const indiceEfectivo = useMemo(() => {
    if (!casillaActual) return 0;
    const idx = rutaActiva.findIndex((c) => c.id === casillaActual.id);
    return idx === -1 ? 0 : idx + 1;
  }, [casillaActual, rutaActiva]);

  useEffect(() => {
    onPositionChange?.(Math.max(0, indiceEfectivo - 1));
  }, [indiceEfectivo, onPositionChange]);

  const cantidadSilabas = useMemo(
    () => silabasObtenidas.filter(Boolean).length,
    [silabasObtenidas],
  );
  const santuarioAbierto = cantidadSilabas === 4;
  const progresoPct = Math.min(100, Math.round((indiceEfectivo / TOTAL_RECORRIDO) * 100));

  /* ── Determinar qué Sílaba Clave corresponde otorgar según el tramo ── */
  const determinarSilabaPendiente = useCallback(
    (destino: Casilla, estadoSilabas: [boolean, boolean, boolean, boolean]): { slot: 0 | 1 | 2 | 3; texto: string } | null => {
      if (destino.tramo === 'start' && !estadoSilabas[0]) {
        return { slot: 0, texto: palabraActual.silabas[0] };
      }
      if (destino.tramo !== 'start' && destino.tramo !== 'boss') {
        if (!estadoSilabas[0]) {
          return { slot: 0, texto: palabraActual.silabas[0] };
        }
        if (destino.indice >= 3 && !estadoSilabas[1]) {
          return { slot: 1, texto: palabraActual.silabas[1] };
        }
        if (destino.indice >= 6 && !estadoSilabas[2]) {
          return { slot: 2, texto: palabraActual.silabas[2] };
        }
        if (destino.indice === 10 && !estadoSilabas[3]) {
          return { slot: 3, texto: palabraActual.silabas[3] };
        }
      }
      return null;
    },
    [palabraActual],
  );

  /* ── Abrir el reto correspondiente a una casilla ── */
  const activarRetoCasilla = useCallback(
    (casilla: Casilla, estadoSilabasActual: [boolean, boolean, boolean, boolean]) => {
      const silabaInfo = determinarSilabaPendiente(casilla, estadoSilabasActual);

      if (casilla.tipo === 'encrucijada') {
        setEligiendoRama(true);
        setAvisoFlotante('¡Llegaste a la Encrucijada Astral! Haz clic en una de las 3 flechas para elegir tu sendero.');
        return;
      }

      if (casilla.tipo === 'boss') {
        // Si por alguna razón aún falta una sílaba al tocar el Santuario, abrir primero un puente de rescate
        const faltaIdx = estadoSilabasActual.findIndex((s) => !s);
        if (faltaIdx !== -1) {
          const retoPuente = elegirSinRepetir(RETOS_PUENTE, usadosPuente.current);
          setAvisoFlotante(`¡Decodifica la sílaba faltante «${palabraActual.silabas[faltaIdx]}» para abrir el Santuario!`);
          setModalActivo({
            tipo: 'puente',
            reto: retoPuente,
            esPortal: true,
            otorgaSilaba: palabraActual.silabas[faltaIdx],
          });
          return;
        }
        const retoBoss = elegirSinRepetir(RETOS_GUARDIAN, usadosGuardian.current);
        setModalActivo({ tipo: 'boss', reto: retoBoss });
        return;
      }

      if (casilla.mecanica === 'tormenta') {
        // Filtrar tormenta según rama si aplica
        const filtro =
          ramaElegida === 'left'
            ? (r: (typeof RETOS_TORMENTA)[number]) =>
                r.tipo === 'agudas' || r.tipo === 'graves' || r.tipo === 'esdrujulas'
            : ramaElegida === 'right'
              ? (r: (typeof RETOS_TORMENTA)[number]) => r.tipo === 'sinonimos' || r.tipo === 'antonimos'
              : undefined;
        const retoTormenta = elegirSinRepetir(RETOS_TORMENTA, usadosTormenta.current, filtro);
        setModalActivo({ tipo: 'tormenta', reto: retoTormenta });
        return;
      }

      if (casilla.mecanica === 'puente' || casilla.mecanica === 'portal') {
        const retoPuente = elegirSinRepetir(RETOS_PUENTE, usadosPuente.current);
        setModalActivo({
          tipo: 'puente',
          reto: retoPuente,
          esPortal: casilla.tipo === 'portal',
          otorgaSilaba: silabaInfo?.texto ?? null,
        });
        return;
      }

      // Por defecto: Mecánica 1 (Caza del Intruso)
      const retoIntruso = elegirSinRepetir(RETOS_INTRUSO, usadosIntruso.current);
      setModalActivo({
        tipo: 'intruso',
        reto: retoIntruso,
        otorgaSilaba: silabaInfo?.texto ?? null,
      });
    },
    [determinarSilabaPendiente, palabraActual, ramaElegida],
  );

  /* ── Animación paso a paso de El Viajero sobre una secuencia de casillas ── */
  const caminarSecuencia = useCallback(
    (secuencia: Casilla[], alFinalizar: (ultima: Casilla) => void) => {
      if (secuencia.length === 0) return;
      setCaminando(true);
      let idx = 0;

      const darPaso = () => {
        const destino = secuencia[idx];
        setPosPantalla((prev) => {
          const dx = destino.s.x - prev.x;
          if (Math.abs(dx) > 2) setMirando(dx >= 0 ? 1 : -1);
          return destino.s;
        });
        setSaltoKey((k) => k + 1);
        setCasillaActual(destino);
        setVisitadas((prev) => {
          const nuevo = new Set(prev);
          nuevo.add(destino.id);
          return nuevo;
        });
        setRastroG((prev) => {
          const ultimo = prev[prev.length - 1];
          if (ultimo && Math.hypot(ultimo.x - destino.g.x, ultimo.y - destino.g.y) < 2) {
            return prev;
          }
          return [...prev, destino.g];
        });

        idx++;
        if (idx < secuencia.length) {
          setTimeout(darPaso, 350);
        } else {
          setTimeout(() => {
            setCaminando(false);
            alFinalizar(destino);
          }, 360);
        }
      };

      darPaso();
    },
    [],
  );

  /* ── Lanzar el Dado ── */
  const handleLanzarDado = useCallback(() => {
    if (rodandoDado || caminando || eligiendoRama || modalActivo !== null || victoriaFinal) return;
    // Si ya está en la Encrucijada sin haber elegido rama, mostrar selector
    if (casillaActual?.id === 'start_5' && !ramaElegida) {
      setEligiendoRama(true);
      return;
    }
    const tirada = Math.floor(Math.random() * 6) + 1;
    setResultadoDado(tirada);
    setRodandoDado(true);
    setAvisoFlotante('Rodando el dado astral...');
  }, [rodandoDado, caminando, eligiendoRama, modalActivo, victoriaFinal, casillaActual, ramaElegida]);

  /* ── Cuando el Dado 3D termina de girar ── */
  const handleDadoCompletado = useCallback(() => {
    setRodandoDado(false);
    setTurno((t) => t + 1);

    // Calcular casillas a recorrer desde la posición actual
    if (!ramaElegida) {
      // Estamos en el Tramo Inicial (start_1 .. start_5)
      const idxActual = casillaActual
        ? CASILLAS_START.findIndex((c) => c.id === casillaActual.id)
        : -1;
      const idxDestino = idxActual + resultadoDado;

      if (idxDestino >= 4) {
        // Llega o pasa por `start_5` (índice 4): se detiene en `start_5` y guarda pasos restantes
        const pasosHastaEncrucijada = CASILLAS_START.slice(idxActual + 1, 5);
        const sobrantes = Math.max(0, idxDestino - 4);
        setPasosRestantesTrasRama(sobrantes);

        caminarSecuencia(pasosHastaEncrucijada, () => {
          // Si aún no obtuvo la Sílaba 1 del tramo inicial, se otorga al llegar a la encrucijada o al elegir rama
          setEligiendoRama(true);
          setAvisoFlotante(
            sobrantes > 0
              ? `¡Encrucijada Astral! Elige una flecha para continuar tus ${sobrantes} paso${sobrantes === 1 ? '' : 's'} restante${sobrantes === 1 ? '' : 's'}.`
              : '¡Encrucijada Astral! Haz clic en una de las 3 flechas flotantes para elegir tu camino.',
          );
        });
      } else {
        const pasos = CASILLAS_START.slice(idxActual + 1, idxDestino + 1);
        caminarSecuencia(pasos, (ultima) => {
          activarRetoCasilla(ultima, silabasObtenidas);
        });
      }
      return;
    }

    // Ya tiene rama elegida
    const ruta = construirRuta(ramaElegida);
    const idxActual = casillaActual ? ruta.findIndex((c) => c.id === casillaActual.id) : 4;
    let idxDestino = Math.min(ruta.length - 1, idxActual + resultadoDado);

    // Si pasa por el Portal de Convergencia (índice 14 = rama_10) y aún no tiene la 4.ª sílaba, se detiene en el Portal
    if (idxActual < 14 && idxDestino > 14 && !silabasObtenidas[3]) {
      idxDestino = 14;
    }

    const pasos = ruta.slice(idxActual + 1, idxDestino + 1);
    if (pasos.length === 0) {
      activarRetoCasilla(CASILLA_BOSS, silabasObtenidas);
      return;
    }

    caminarSecuencia(pasos, (ultima) => {
      activarRetoCasilla(ultima, silabasObtenidas);
    });
  }, [
    ramaElegida,
    casillaActual,
    resultadoDado,
    caminarSecuencia,
    activarRetoCasilla,
    silabasObtenidas,
  ]);

  /* ── Elegir una de las 3 Flechas en `start_5` ── */
  const handleElegirRama = useCallback(
    (rama: Rama) => {
      setRamaElegida(rama);
      setEligiendoRama(false);
      const info = INFO_RAMA[rama];

      // Si había pasos restantes del dado al detenerse en `start_5`, continuarlos ahora por la rama elegida
      if (pasosRestantesTrasRama > 0) {
        const cant = Math.min(10, pasosRestantesTrasRama);
        const pasosRama = CASILLAS_RAMA[rama].slice(0, cant);
        setPasosRestantesTrasRama(0);
        setAvisoFlotante(`Elegiste: ${info.nombre}. ¡Continuando recorrido!`);
        caminarSecuencia(pasosRama, (ultima) => {
          activarRetoCasilla(ultima, silabasObtenidas);
        });
      } else {
        setAvisoFlotante(`Sendero elegido: ${info.nombre}. ¡Lanza el dado para avanzar!`);
      }
    },
    [pasosRestantesTrasRama, caminarSecuencia, activarRetoCasilla, silabasObtenidas],
  );

  /* ── Procesar resultado al cerrar el modal "Altar de Decodificación" ── */
  const handleCompletarReto = useCallback(
    (res: ResultadoAltar) => {
      setModalActivo(null);

      if (res.exito) {
        setAciertosTotales((a) => a + 1);
        if (casillaActual) {
          setCompletadas((prev) => {
            const nuevo = new Set(prev);
            nuevo.add(casillaActual.id);
            return nuevo;
          });
        }
      }

      // Actualizar Sílabas Clave si obtuvo una
      let nuevasSilabas = [...silabasObtenidas] as [boolean, boolean, boolean, boolean];
      if (res.exito && res.silabaObtenida) {
        const idxSilaba = palabraActual.silabas.findIndex(
          (s, i) => s === res.silabaObtenida && !nuevasSilabas[i],
        );
        if (idxSilaba !== -1) {
          nuevasSilabas[idxSilaba] = true;
          setSilabasObtenidas(nuevasSilabas);
          setAvisoFlotante(
            `¡Obtuviste el Cristal de Sílaba «${res.silabaObtenida}» (${
              nuevasSilabas.filter(Boolean).length
            }/4)!`,
          );
        }
      }

      // Si completó el duelo del Guardián Final
      if (res.esBossFinal && res.exito) {
        setVictoriaFinal(true);
        setAvisoFlotante('¡Has restaurado el Archivo Astral de Letralia!');
        return;
      }

      // Si estaba en `boss_36` desbloqueando una sílaba pendiente y ya completó las 4, abrir el duelo del Guardián
      if (casillaActual?.id === 'boss_36' && nuevasSilabas.every(Boolean)) {
        setTimeout(() => {
          const retoBoss = elegirSinRepetir(RETOS_GUARDIAN, usadosGuardian.current);
          setModalActivo({ tipo: 'boss', reto: retoBoss });
        }, 450);
        return;
      }

      // Si hubo desplazamiento extra por Tormenta Acústica (+1 o -1 casilla)
      if (res.desplazamientoExtra && ramaElegida && casillaActual) {
        const ruta = construirRuta(ramaElegida);
        const idxActual = ruta.findIndex((c) => c.id === casillaActual.id);
        const nuevoIdx = Math.max(0, Math.min(ruta.length - 1, idxActual + res.desplazamientoExtra));
        if (nuevoIdx !== idxActual) {
          const destinoExtra = ruta[nuevoIdx];
          setAvisoFlotante(
            res.desplazamientoExtra > 0
              ? '¡Impulso de Escudo Astral! Avanzas +1 casilla extra.'
              : 'La tormenta acústica te hizo retroceder 1 casilla.',
          );
          setTimeout(() => {
            caminarSecuencia([destinoExtra], (ult) => {
              // Si el impulso lleva al Portal (rama_10) y falta la 4.ª sílaba, activar el portal
              if (ult.tipo === 'portal' && !nuevasSilabas[3]) {
                activarRetoCasilla(ult, nuevasSilabas);
              }
            });
          }, 320);
        }
      }
    },
    [casillaActual, silabasObtenidas, palabraActual, ramaElegida, caminarSecuencia, activarRetoCasilla],
  );

  /* ── Reiniciar partida con nueva palabra llave ── */
  const handleNuevaPartida = useCallback(() => {
    setIndicePalabraLlave((i) => i + 1);
    setRamaElegida(null);
    setCasillaActual(null);
    setPosPantalla(ORIGEN_S);
    setRastroG([ORIGEN_G]);
    setVisitadas(new Set());
    setCompletadas(new Set());
    setSilabasObtenidas([false, false, false, false]);
    setEligiendoRama(false);
    setPasosRestantesTrasRama(0);
    setTurno(1);
    setAciertosTotales(0);
    setVictoriaFinal(false);
    setModalActivo(null);
    setAvisoFlotante('¡Nueva expedición iniciada! Lanza el dado astral.');
  }, []);

  const nombreTramoActual = useMemo(() => {
    if (!casillaActual || casillaActual.tramo === 'start') return 'Camino Principal Inicial';
    if (casillaActual.tramo === 'boss') return 'Santuario del Guardián';
    return INFO_RAMA[casillaActual.tramo].corto;
  }, [casillaActual]);

  return (
    <div
      className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #3B5284 0%, #2D406B 55%, #1E293B 100%)',
      }}
    >
      {/* ════════════════════ ÁREA PRINCIPAL DEL MAPA ASTRAL (IZQUIERDA/CENTRO) ════════════════════ */}
      <div className="relative flex-1 h-[62vh] lg:h-full overflow-hidden flex items-center justify-center">
        {/* ── Botón Flotante Superior Izquierda: Volver al Mapa ── */}
        <div className="absolute top-3 left-3 z-30 flex items-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/planeta/2')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full font-extrabold text-xs sm:text-sm text-[#1E1B4B] shadow-md cursor-pointer"
            style={{
              background: 'linear-gradient(180deg, #FDF6E3 0%, #EAD7B7 100%)',
              border: '2px solid #8C6D53',
              boxShadow: '0 3px 0 #6E543C',
            }}
          >
            <span>←</span>
            <span className="hidden sm:inline">Mapa</span>
          </motion.button>
        </div>

        {/* ── Cartel Central Superior "TURN / TURNO ↻" con alas lavanda y 4 puntos (Fiel a Imagen 1) ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
          <div className="flex items-start">
            {/* Ala izquierda lavanda */}
            <div
              className="hidden sm:flex h-8 w-10 items-center justify-center rounded-bl-xl border-b-2 border-l-2 border-[#8B7CC0]"
              style={{
                background: 'linear-gradient(180deg, #DDD6FE 0%, #C4B5FD 100%)',
                transform: 'skewX(18deg)',
              }}
            >
              <span className="text-[10px] text-white" style={{ transform: 'skewX(-18deg)' }}>
                ✦
              </span>
            </div>

            {/* Placa central pergamino */}
            <div
              className="px-6 sm:px-8 py-1.5 rounded-b-2xl border-x-2 border-b-2 border-[#9A7B56] shadow-lg flex items-center gap-2"
              style={{
                background: 'linear-gradient(180deg, #FDF6E3 0%, #F2DEC0 100%)',
              }}
            >
              <span className="text-xs sm:text-sm font-black tracking-widest text-[#2E2546]">
                TURNO
              </span>
              <span className="w-5 h-5 rounded-full bg-[#E2C8A4] border border-[#9A7B56] flex items-center justify-center text-xs font-black text-[#2E2546]">
                ↻
              </span>
            </div>

            {/* Ala derecha lavanda */}
            <div
              className="hidden sm:flex h-8 w-10 items-center justify-center rounded-br-xl border-b-2 border-r-2 border-[#8B7CC0]"
              style={{
                background: 'linear-gradient(180deg, #DDD6FE 0%, #C4B5FD 100%)',
                transform: 'skewX(-18deg)',
              }}
            >
              <span className="text-[10px] text-white" style={{ transform: 'skewX(18deg)' }}>
                ✦
              </span>
            </div>
          </div>

          {/* 4 puntos indicadores debajo de TURN */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {[0, 1, 2, 3].map((i) => {
              const activo = (turno - 1) % 4 === i;
              return (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background: activo ? '#FDBA74' : '#CBD5E1',
                    boxShadow: activo ? '0 0 8px #FDBA74' : 'none',
                    transform: activo ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* ── Lienzo SVG del Mapa Astral de 36 casillas ── */}
        <div className="w-full h-full flex items-center justify-center p-1 sm:p-3">
          <MapaAstral
            rama={ramaElegida}
            posS={posPantalla}
            rastroG={rastroG}
            visitadas={visitadas}
            completadas={completadas}
            activaId={casillaActual?.id ?? null}
            eligiendo={eligiendoRama}
            onElegir={handleElegirRama}
            caminando={caminando}
            mirando={mirando}
            saltoKey={saltoKey}
            santuarioAbierto={santuarioAbierto}
          />
        </div>

        {/* ── Banner de aviso/guía inferior sobre el mapa ── */}
        <AnimatePresence mode="wait">
          {avisoFlotante && (
            <motion.div
              key={avisoFlotante}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-[92%] sm:max-w-lg px-4 py-2 rounded-full bg-[#283556]/92 border-2 border-[#A5B4FC] backdrop-blur-md shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FDF6E3] text-center"
            >
              <span className="text-sky-300">✦</span>
              <span>{avisoFlotante}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════════════════════ HUD ESPACIAL LATERAL DERECHO (FIEL A IMAGEN 1) ════════════════════ */}
      <aside className="relative z-30 w-full lg:w-[330px] xl:w-[350px] lg:h-full p-2 sm:p-3 flex flex-col justify-center shrink-0">
        <div
          className="relative w-full h-full max-h-[820px] rounded-[28px] p-3.5 sm:p-4 flex flex-col justify-between shadow-[0_16px_50px_rgba(15,23,42,0.6)] overflow-y-auto"
          style={{
            background: 'linear-gradient(180deg, #EDE9FE 0%, #E2DCFA 55%, #D7CFF4 100%)',
            border: '3px solid #B8B0DC',
            boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.75), 0 16px 40px rgba(15,23,42,0.55)',
          }}
        >
          {/* Pequeña pestaña triangular izquierda en la mitad del panel (como en Imagen 1) */}
          <div className="hidden lg:flex absolute left-1.5 top-1/2 -translate-y-1/2 text-[#7C6BC9] text-xs font-black select-none">
            ◀
          </div>

          {/* ── 1. CABECERA: LETRALIA — ARCHIVO ASTRAL ── */}
          <div className="text-center pt-0.5 pb-2 border-b-2 border-[#C4B5FD]">
            <h1
              className="text-2xl sm:text-3xl font-black tracking-wider leading-none select-none"
              style={{
                color: '#DDD6FE',
                WebkitTextStroke: '1.5px #312E81',
                textShadow: '0 3px 0 #312E81, 0 5px 10px rgba(49,46,129,0.28)',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              LETRALIA
            </h1>
            <p className="mt-1 text-[11px] font-black tracking-[0.22em] text-[#312E81] uppercase">
              ARCHIVO ASTRAL
            </p>
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DDD6FE] border border-[#A78BFA] text-[11px] font-extrabold text-[#1E1B4B]">
              <span>◈</span>
              <span>{nombreTramoActual}</span>
            </div>
          </div>

          {/* ── 2. CUENCO DEL DADO 3D AMIGABLE ── */}
          <div
            className="relative my-2 py-3 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-inner"
            style={{
              background: 'linear-gradient(180deg, #6C82B8 0%, #8FA3D4 55%, #B8C4E8 100%)',
              border: '2px solid #9FAEE0',
              boxShadow: 'inset 0 4px 14px rgba(30, 41, 59, 0.35)',
            }}
          >
            {/* Estrellitas decorativas dentro del cuenco del dado */}
            <span className="pointer-events-none absolute top-2 left-3 text-white/70 text-xs">✦</span>
            <span className="pointer-events-none absolute bottom-2 right-3 text-white/70 text-xs">★</span>
            <div
              onClick={handleLanzarDado}
              className={
                rodandoDado || caminando || eligiendoRama
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer hover:scale-105 transition-transform'
              }
              title="Haz clic para lanzar el dado"
            >
              <Dado3D
                size={84}
                rolling={rodandoDado}
                result={resultadoDado}
                onRollComplete={handleDadoCompletado}
                faceColor="#EDE9FE"
                borderColor="#A78BFA"
                pipColor="#312E81"
              />
            </div>
          </div>

          {/* ── 3. CUERPO DE PERGAMINO: PROGRESO + 4 RANURAS DE SÍLABAS CLAVE ── */}
          <div
            className="relative rounded-2xl p-3 sm:p-3.5 my-1 shadow-sm"
            style={{
              background: 'linear-gradient(180deg, #FBF3E0 0%, #F4E4C6 100%)',
              border: '2px solid #D2BA93',
            }}
          >
            {/* Muescas laterales estilo pergamino antiguo (Imagen 1) */}
            <span className="hidden sm:block absolute -left-1.5 top-8 w-3 h-3 rotate-45 bg-[#E2DCFA] border-r-2 border-t-2 border-[#D2BA93]" />
            <span className="hidden sm:block absolute -right-1.5 top-16 w-3 h-3 rotate-45 bg-[#E2DCFA] border-l-2 border-b-2 border-[#D2BA93]" />

            {/* Barra de Progreso (0% a 100% sobre 16 casillas) */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black tracking-wider text-[#2E2546] uppercase">
                  PROGRESO
                </span>
                <span className="text-xs font-extrabold text-[#4C1D95]">
                  {progresoPct}% ({indiceEfectivo}/{TOTAL_RECORRIDO})
                </span>
              </div>
              <div className="relative h-5 rounded-full bg-[#DFCCA9] border-2 border-[#8C6D53] p-0.5 shadow-inner">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${ Math.max(6, progresoPct) }%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    background:
                      'linear-gradient(90deg, #C4B5FD 0%, #F9A8D4 55%, #FDE68A 100%)',
                  }}
                />
                {/* Estrellas de hito en la barra (como en Imagen 1) */}
                {[31, 68, 96].map((posPct, idx) => {
                  const alcanzada = progresoPct >= posPct;
                  return (
                    <span
                      key={idx}
                      className="absolute -bottom-2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shadow"
                      style={{
                        left: `${posPct}%`,
                        background: alcanzada ? '#FDE68A' : '#E2D5EE',
                        color: alcanzada ? '#92400E' : '#6D5BA8',
                        border: '1.5px solid #6D5BA8',
                      }}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Inventario de Sílabas Clave (4 Ranuras de Cristal) */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black tracking-wider text-[#2E2546] uppercase">
                  SÍLABAS CLAVE
                </span>
                <span className="text-[11px] font-extrabold text-[#065F46] bg-[#D1FAE5] px-2 py-0.5 rounded-full border border-[#6EE7B7]">
                  {cantidadSilabas}/4 Cristales
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {palabraActual.silabas.map((sil, idx) => {
                  const obtenida = silabasObtenidas[idx];
                  return (
                    <motion.div
                      key={idx}
                      animate={obtenida ? { scale: [1, 1.08, 1] } : undefined}
                      className="relative rounded-xl p-1.5 flex flex-col items-center justify-between min-h-[76px] transition-all"
                      style={{
                        background: obtenida
                          ? 'linear-gradient(180deg, #FFFDF9 0%, #F7E8CA 100%)'
                          : '#EAD8B8',
                        border: obtenida ? '2px solid #38BDF8' : '2px solid #C8B28E',
                        boxShadow: obtenida
                          ? '0 0 14px rgba(125, 211, 252, 0.55), inset 0 0 8px rgba(110, 231, 183, 0.35)'
                          : 'inset 0 2px 4px rgba(0,0,0,0.08)',
                      }}
                    >
                      <IconoCristal indice={idx} activo={obtenida} />
                      <span
                        className={`mt-0.5 text-xs font-black tracking-wide px-1.5 py-0.5 rounded ${
                          obtenida
                            ? 'bg-indigo-950 text-[#FDF6E3]'
                            : 'text-[#8C6D53]/70'
                        }`}
                      >
                        {obtenida ? sil : `?`}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Llave hacia el Guardián al reunir las 4 sílabas */}
              <div
                className="mt-2.5 rounded-xl px-3 py-2 flex items-center justify-between border-2 transition-all"
                style={{
                  background: santuarioAbierto
                    ? 'linear-gradient(90deg, #D1FAE5 0%, #E0F2FE 100%)'
                    : '#EFE2C8',
                  borderColor: santuarioAbierto ? '#34D399' : '#D5C3A1',
                  boxShadow: santuarioAbierto ? '0 0 16px rgba(110, 231, 183, 0.6)' : 'none',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{santuarioAbierto ? '🗝️' : '🔒'}</span>
                  <div className="leading-tight">
                    <p className="text-[11px] font-black uppercase tracking-wider text-[#1E1B4B]">
                      {santuarioAbierto ? '¡Llave del Guardián Activa!' : 'Llave del Santuario'}
                    </p>
                    <p className="text-xs font-extrabold text-[#4C1D95]">
                      {santuarioAbierto
                        ? palabraActual.silabas.join(' · ')
                        : 'Reúne las 4 sílabas en el camino'}
                    </p>
                  </div>
                </div>
                {santuarioAbierto && (
                  <span className="text-xs font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">
                    LISTA
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── 4. BOTONES DE ACCIÓN INFERIORES (ESTILO SPIN/ROLL & LETTERS DE IMAGEN 1) ── */}
          <div className="flex flex-col gap-2.5 mt-2">
            <motion.button
              type="button"
              whileHover={
                rodandoDado || caminando || eligiendoRama ? undefined : { scale: 1.02, y: -1 }
              }
              whileTap={
                rodandoDado || caminando || eligiendoRama ? undefined : { scale: 0.97 }
              }
              onClick={handleLanzarDado}
              disabled={rodandoDado || caminando || eligiendoRama}
              className="w-full py-3 rounded-2xl font-black text-sm sm:text-base tracking-widest uppercase transition-all cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(180deg, #F9E7CE 0%, #E7C69E 100%)',
                border: '2.5px solid #6E5648',
                boxShadow: '0 4px 0 #6E5648',
                color: '#2E2546',
              }}
            >
              {rodandoDado
                ? '🎲 RODANDO...'
                : caminando
                  ? '✨ AVANZANDO...'
                  : eligiendoRama
                    ? '↖ ELIGE TU CAMINO'
                    : '🎲 LANZAR DADO'}
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMostrarCodice(true)}
              className="w-full py-2.5 rounded-2xl font-black text-xs sm:text-sm tracking-widest uppercase transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, #E5DEFF 0%, #C4B5FD 100%)',
                border: '2.5px solid #62519E',
                boxShadow: '0 4px 0 #62519E',
                color: '#2E2546',
              }}
            >
              📜 SÍLABAS Y GUÍA
            </motion.button>
          </div>
        </div>
      </aside>

      {/* ════════════════════ MODAL "ALTAR DE DECODIFICACIÓN" (4 MECÁNICAS) ════════════════════ */}
      <AnimatePresence>
        {modalActivo && (
          <AltarDecodificacion
            modal={modalActivo}
            estrellasActuales={aciertosTotales}
            silabasRecolectadas={cantidadSilabas}
            onCompletar={handleCompletarReto}
          />
        )}
      </AnimatePresence>

      {/* ════════════════════ MODAL CÓDICE / GUÍA DEL ARCHIVO ASTRAL ════════════════════ */}
      <AnimatePresence>
        {mostrarCodice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setMostrarCodice(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl p-6 bg-[#FDF6E3] border-4 border-[#A5B4FC] text-[#1E1B4B] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b-2 border-[#E6D5B8] pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-black tracking-wide">
                  📜 Códice del Viajero — Letralia
                </h3>
                <button
                  type="button"
                  onClick={() => setMostrarCodice(false)}
                  className="w-8 h-8 rounded-full bg-violet-200 hover:bg-violet-300 font-black text-indigo-950 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-[#F4E6C8] border border-[#D5BE97]">
                  <p className="font-black text-indigo-950 mb-1">
                    🗝️ Palabra Llave en decodificación ({cantidadSilabas}/4):
                  </p>
                  <div className="flex gap-2 mt-1">
                    {palabraActual.silabas.map((s, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-lg font-black text-sm border ${
                          silabasObtenidas[i]
                            ? 'bg-emerald-200 border-emerald-500 text-emerald-950'
                            : 'bg-white/70 border-[#C8B28E] text-indigo-950/50'
                        }`}
                      >
                        {silabasObtenidas[i] ? s : '???'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-violet-100 border border-violet-300">
                  <p className="font-black">◈ Losas de Pergamino (A, Ñ, Ω):</p>
                  <p className="text-indigo-950/80">
                    Activan <strong>Caza del Intruso</strong> (ortografía, tildes y concordancia).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300">
                  <p className="font-black">◈ Hexágonos de Cristal (Casillas 3, 6 y Portal 10):</p>
                  <p className="text-indigo-950/80">
                    Activan el <strong>Constructor de Puentes Sintácticos</strong> y entregan una{' '}
                    <strong>Sílaba Clave</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-100 border border-rose-300">
                  <p className="font-black">◈ Hexágonos Coral (Casillas 5 y 9):</p>
                  <p className="text-indigo-950/80">
                    Activan la <strong>Tormenta de Meteoritos Acústicos</strong> (+1 casilla si
                    aciertas las 3 palabras; -1 casilla si fallas).
                  </p>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setMostrarCodice(false)}
                  className="px-6 py-2 rounded-xl bg-[#4C1D95] text-white font-extrabold text-sm cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════ PANTALLA DE VICTORIA CON ESTRELLAS ════════════════════ */}
      <AnimatePresence>
        {victoriaFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg rounded-[32px] p-6 sm:p-8 text-center bg-[#FDF6E3] border-4 border-[#A5B4FC] text-[#1E1B4B] shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
            >
              <div className="flex justify-center gap-3 mb-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15 + i * 0.15, type: 'spring', stiffness: 300 }}
                    className="text-4xl sm:text-5xl drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)]"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-200 border border-emerald-400 text-xs font-black uppercase tracking-widest text-emerald-950 mb-2">
                ¡Archivo Astral Restaurado!
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] mb-2">
                ¡Victoria en Letralia!
              </h2>
              <p className="text-sm sm:text-base font-medium text-indigo-950/80 mb-4">
                Superaste el duelo del Guardián del Vórtice Gramatical y reuniste las 4 Sílabas
                Clave del códice:
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#EDE9FE] border-2 border-[#A78BFA] mb-6">
                {palabraActual.silabas.map((sil, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-[#312E81] text-[#FDF6E3] font-black text-base sm:text-lg"
                  >
                    {sil}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleNuevaPartida}
                  className="px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-b from-[#FDE68A] to-[#F59E0B] border-2 border-[#92400E] text-[#1E1B4B] shadow-[0_4px_0_#92400E] cursor-pointer"
                >
                  🔄 Nueva Partida
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/planeta/2')}
                  className="px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-b from-[#DDD6FE] to-[#A78BFA] border-2 border-[#4C1D95] text-[#1E1B4B] shadow-[0_4px_0_#4C1D95] cursor-pointer"
                >
                  ← Volver a Letralia
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
