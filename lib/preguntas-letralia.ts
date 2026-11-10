/**
 * Banco pedagógico de Letralia / Verbum — Nivel 1 (Archivo Astral)
 * Público: niños de 10 a 12 años (5.º y 6.º de primaria).
 *
 * Contiene las 4 mecánicas del "Altar de Decodificación":
 *  1. Caza del Intruso            → ortografía, acentuación y concordancia.
 *  2. Constructor de Puentes       → sintaxis, sujeto/predicado y conectores.
 *  3. Tormenta de Meteoritos       → agudas/graves/esdrújulas, sinónimos/antónimos.
 *  4. Guardián del Vórtice (Boss)  → tilde diacrítica, conectores e inferencia.
 */

/* ────────────────────────────── Tipos ────────────────────────────── */

export type CategoriaIntruso = 'ortografia' | 'acentuacion' | 'concordancia';

export interface RetoIntruso {
  id: string;
  categoria: CategoriaIntruso;
  /** Oración dividida en bloques (tablillas). */
  palabras: string[];
  /** Posición de la palabra con error dentro de `palabras`. */
  indiceIntruso: number;
  /** Tres piezas de reemplazo (se barajan al mostrarse). */
  opciones: [string, string, string];
  /** Pieza correcta (debe estar incluida en `opciones`). */
  correcta: string;
  /** Pista breve para el botón AYUDA. */
  pista: string;
  /** Explicación formativa que aparece al resolver. */
  explicacion: string;
}

export type EnfoquePuente = 'sujeto-predicado' | 'conectores' | 'coherencia';

export interface RetoPuenteSintactico {
  id: string;
  enfoque: EnfoquePuente;
  /** Tablillas en el orden correcto (4 a 6). */
  ordenCorrecto: string[];
  /** Otros órdenes también válidos y coherentes. */
  ordenesAlternativas?: string[][];
  pista: string;
  explicacion: string;
}

export type TipoTormenta = 'agudas' | 'graves' | 'esdrujulas' | 'sinonimos' | 'antonimos';

export interface RetoTormenta {
  id: string;
  tipo: TipoTormenta;
  /** Consigna que aparece arriba del altar. */
  consigna: string;
  /** Seis tablillas flotantes. */
  palabras: string[];
  /** Las tres correctas (incluidas en `palabras`). */
  correctas: [string, string, string];
  /** Segundos disponibles. */
  segundos: number;
  pista: string;
  explicacion: string;
}

export interface FaseGuardian {
  titulo: string;
  /** Consigna de la fase. */
  enunciado: string;
  opciones: string[];
  correcta: string;
  explicacion: string;
}

export interface RetoGuardianBoss {
  id: string;
  titulo: string;
  /**
   * Relato con tres ranuras selladas: {0}, {1} y {2}.
   * {0} = tilde diacrítica · {1} = conector lógico · {2} = conclusión/moraleja.
   */
  relato: string;
  fases: [FaseGuardian, FaseGuardian, FaseGuardian];
}

/* ─────────────────── Mecánica 1 · Caza del Intruso ─────────────────── */

export const RETOS_INTRUSO: RetoIntruso[] = [
  {
    id: 'int-01',
    categoria: 'ortografia',
    palabras: ['El', 'explorador', 'hayó', 'un', 'antiguo', 'códice.'],
    indiceIntruso: 2,
    opciones: ['halló', 'alló', 'hayo'],
    correcta: 'halló',
    pista: 'Piensa en el verbo «hallar», que significa encontrar.',
    explicacion:
      '«Halló» viene del verbo hallar (encontrar) y se escribe con h y ll. «Haya», con y, pertenece al verbo haber.',
  },
  {
    id: 'int-02',
    categoria: 'ortografia',
    palabras: ['Mañana', 'iremos', 'a', 'la', 'viblioteca', 'estelar.'],
    indiceIntruso: 4,
    opciones: ['biblioteca', 'vivlioteca', 'bibloteca'],
    correcta: 'biblioteca',
    pista: 'Las palabras que empiezan por «biblio-» tienen que ver con los libros.',
    explicacion:
      'Las palabras que comienzan con «biblio-» (libro) se escriben con b: biblioteca, bibliografía, bibliotecario.',
  },
  {
    id: 'int-03',
    categoria: 'ortografia',
    palabras: ['La', 'nave', 'aterrizó', 'sobre', 'una', 'superfisie', 'rocosa.'],
    indiceIntruso: 5,
    opciones: ['superficie', 'superfizie', 'superfice'],
    correcta: 'superficie',
    pista: 'Fíjate en cómo termina: «-icie».',
    explicacion:
      'Las palabras terminadas en «-icie» se escriben con c: superficie, planicie, calvicie.',
  },
  {
    id: 'int-04',
    categoria: 'acentuacion',
    palabras: ['Mi', 'hermano', 'y', 'yo', 'jugábamos', 'en', 'el', 'jardin.'],
    indiceIntruso: 7,
    opciones: ['jardín', 'járdin', 'jardím'],
    correcta: 'jardín',
    pista: 'Pronuncia la palabra en voz alta: ¿dónde suena más fuerte?',
    explicacion:
      '«Jardín» es aguda (la fuerza va en la última sílaba) y termina en n. Las agudas terminadas en n, s o vocal llevan tilde.',
  },
  {
    id: 'int-05',
    categoria: 'concordancia',
    palabras: ['Las', 'estrellas', 'brillaba', 'sobre', 'el', 'océano.'],
    indiceIntruso: 2,
    opciones: ['brillaban', 'brillabas', 'brillamos'],
    correcta: 'brillaban',
    pista: '¿Cuántas estrellas hay? ¿Una o muchas?',
    explicacion:
      'El sujeto «las estrellas» está en plural, así que el verbo también debe ir en plural: brillaban.',
  },
  {
    id: 'int-06',
    categoria: 'ortografia',
    palabras: ['El', 'astronauta', 'recojió', 'muestras', 'de', 'polvo', 'lunar.'],
    indiceIntruso: 2,
    opciones: ['recogió', 'recohió', 'recoxió'],
    correcta: 'recogió',
    pista: 'El verbo original es «recoger».',
    explicacion:
      'Los verbos terminados en «-ger» y «-gir» (recoger, elegir) conservan la g delante de e, i: recogió, eligió.',
  },
  {
    id: 'int-07',
    categoria: 'acentuacion',
    palabras: ['¿Donde', 'guardaste', 'el', 'mapa', 'estelar?'],
    indiceIntruso: 0,
    opciones: ['¿Dónde', '¿Dondé', '¿Dhonde'],
    correcta: '¿Dónde',
    pista: 'Es una pregunta. ¿Qué pasa con las palabras que preguntan?',
    explicacion:
      'Las palabras interrogativas y exclamativas (qué, cómo, dónde, cuándo, quién) llevan tilde: ¿Dónde?',
  },
  {
    id: 'int-08',
    categoria: 'ortografia',
    palabras: ['El', 'cohete', 'despegó', 'a', 'gran', 'belocidad.'],
    indiceIntruso: 5,
    opciones: ['velocidad', 'belosidad', 'velozidad'],
    correcta: 'velocidad',
    pista: 'Busca una palabra de la misma familia: algo que va muy rápido es...',
    explicacion:
      '«Velocidad» se escribe con v, igual que «veloz», que es de su misma familia de palabras.',
  },
  {
    id: 'int-09',
    categoria: 'ortografia',
    palabras: ['Un', 'cometa', 'atravezó', 'el', 'cielo', 'nocturno.'],
    indiceIntruso: 2,
    opciones: ['atravesó', 'atrabesó', 'atravezo'],
    correcta: 'atravesó',
    pista: 'Viene de la palabra «través».',
    explicacion:
      '«Atravesar» viene de «través» y se escribe con s. Por eso decimos: atravesó, atravesamos.',
  },
  {
    id: 'int-10',
    categoria: 'ortografia',
    palabras: ['Los', 'niños', 'estaban', 'muy', 'felises', 'con', 'el', 'viaje.'],
    indiceIntruso: 4,
    opciones: ['felices', 'felizes', 'felíces'],
    correcta: 'felices',
    pista: 'El singular es «feliz». ¿Qué le pasa a la z en el plural?',
    explicacion:
      'Cuando una palabra termina en z, al formar el plural la z cambia a c: feliz → felices, lápiz → lápices.',
  },
  {
    id: 'int-11',
    categoria: 'concordancia',
    palabras: ['Nosotros', 'llegó', 'temprano', 'al', 'planetario.'],
    indiceIntruso: 1,
    opciones: ['llegamos', 'llegaron', 'llegaste'],
    correcta: 'llegamos',
    pista: '¿Quiénes llegaron? Mira el sujeto de la oración.',
    explicacion:
      'Con el sujeto «nosotros», el verbo debe ir en primera persona del plural: nosotros llegamos.',
  },
  {
    id: 'int-12',
    categoria: 'ortografia',
    palabras: ['El', 'guardián', 'nos', 'saludó', 'con', 'un', 'jesto', 'amable.'],
    indiceIntruso: 6,
    opciones: ['gesto', 'jestto', 'guesto'],
    correcta: 'gesto',
    pista: 'Piensa en «gesticular», mover las manos al hablar.',
    explicacion:
      '«Gesto» se escribe con g, como gesticular. Antes de e, la g suena igual que la j.',
  },
  {
    id: 'int-13',
    categoria: 'ortografia',
    palabras: ['La', 'lechuza', 'caza', 'de', 'noche', 'en', 'silensio.'],
    indiceIntruso: 6,
    opciones: ['silencio', 'cilencio', 'silenzio'],
    correcta: 'silencio',
    pista: 'Fíjate en la terminación «-encio».',
    explicacion:
      'Las palabras terminadas en «-encio» y «-encia» se escriben con c: silencio, paciencia, ciencia.',
  },
  {
    id: 'int-14',
    categoria: 'acentuacion',
    palabras: ['El', 'arbol', 'más', 'alto', 'tiene', 'mil', 'años.'],
    indiceIntruso: 1,
    opciones: ['árbol', 'arból', 'árból'],
    correcta: 'árbol',
    pista: 'Es una palabra grave (llana). ¿En qué letra termina?',
    explicacion:
      '«Árbol» es grave y termina en l (no en n, s ni vocal); por eso lleva tilde en la sílaba ár-.',
  },
  {
    id: 'int-15',
    categoria: 'ortografia',
    palabras: ['Hoy', 'hechamos', 'las', 'cartas', 'al', 'buzón', 'espacial.'],
    indiceIntruso: 1,
    opciones: ['echamos', 'echámos', 'hecamos'],
    correcta: 'echamos',
    pista: '¿Viene del verbo «hacer» o del verbo «echar»?',
    explicacion:
      '«Echar» (lanzar, meter) se escribe sin h: echamos. «Hecho», con h, viene del verbo hacer.',
  },
  {
    id: 'int-16',
    categoria: 'concordancia',
    palabras: ['La', 'nave', 'plateado', 'llegó', 'a', 'Letralia.'],
    indiceIntruso: 2,
    opciones: ['plateada', 'plateados', 'plateadas'],
    correcta: 'plateada',
    pista: '«Nave» es femenino y singular. El adjetivo debe acompañarla.',
    explicacion:
      'El adjetivo concuerda en género y número con el sustantivo: «la nave» (femenino, singular) → plateada.',
  },
];

/* ─────────────── Mecánica 2 · Constructor de Puentes Sintácticos ─────────────── */

export const RETOS_PUENTE: RetoPuenteSintactico[] = [
  {
    id: 'pue-01',
    enfoque: 'sujeto-predicado',
    ordenCorrecto: ['El', 'archivo', 'mágico', 'de Letralia', 'guarda', 'secretos'],
    ordenesAlternativas: [['El', 'mágico', 'archivo', 'de Letralia', 'guarda', 'secretos']],
    pista: 'Empieza por la palabra con mayúscula y piensa: ¿quién guarda secretos?',
    explicacion:
      'Sujeto: «El archivo mágico de Letralia» (de quién se habla). Predicado: «guarda secretos» (lo que hace).',
  },
  {
    id: 'pue-02',
    enfoque: 'sujeto-predicado',
    ordenCorrecto: ['El espacio', 'está', 'lleno', 'de estrellas', 'brillantes'],
    pista: 'Primero el sujeto (¿qué está lleno?) y después lo que se dice de él.',
    explicacion:
      'El sujeto es «El espacio». El predicado «está lleno de estrellas brillantes» describe cómo es.',
  },
  {
    id: 'pue-03',
    enfoque: 'conectores',
    ordenCorrecto: ['Estudié', 'mucho;', 'por lo tanto,', 'aprobé', 'el examen'],
    pista: '«Por lo tanto» anuncia una consecuencia. ¿Qué pasó gracias a estudiar?',
    explicacion:
      '«Por lo tanto» une una causa (estudié mucho) con su consecuencia (aprobé el examen).',
  },
  {
    id: 'pue-04',
    enfoque: 'conectores',
    ordenCorrecto: ['Llovía', 'con fuerza;', 'sin embargo,', 'salimos', 'a explorar'],
    pista: '«Sin embargo» une dos ideas que parecen opuestas.',
    explicacion:
      '«Sin embargo» presenta una idea contraria a lo esperado: llovía, pero aun así salimos a explorar.',
  },
  {
    id: 'pue-05',
    enfoque: 'conectores',
    ordenCorrecto: ['La viajera', 'lee cuentos', 'y,', 'además,', 'escribe', 'poemas'],
    ordenesAlternativas: [['La viajera', 'escribe', 'poemas', 'y,', 'además,', 'lee cuentos']],
    pista: '«Además» suma una idea nueva a otra que ya dijiste.',
    explicacion:
      '«Además» es un conector de adición: agrega una acción más (escribir poemas) a la primera (leer cuentos).',
  },
  {
    id: 'pue-06',
    enfoque: 'coherencia',
    ordenCorrecto: ['Los planetas', 'giran', 'sin parar', 'alrededor', 'del Sol'],
    ordenesAlternativas: [['Los planetas', 'giran', 'alrededor', 'del Sol', 'sin parar']],
    pista: '¿Qué hacen los planetas? ¿Alrededor de qué?',
    explicacion:
      'Sujeto: «Los planetas». Verbo: «giran». «Alrededor del Sol» y «sin parar» indican dónde y cómo giran.',
  },
  {
    id: 'pue-07',
    enfoque: 'sujeto-predicado',
    ordenCorrecto: ['Mi abuela', 'me regaló', 'un libro', 'de aventuras', 'espaciales'],
    pista: '¿Quién hizo el regalo? Empieza por ahí.',
    explicacion:
      'El sujeto «Mi abuela» realiza la acción. «Me regaló un libro de aventuras espaciales» es el predicado.',
  },
  {
    id: 'pue-08',
    enfoque: 'conectores',
    ordenCorrecto: ['No encontraba', 'la llave;', 'por eso,', 'pedí ayuda', 'al guardián'],
    pista: '«Por eso» introduce lo que hiciste a causa de un problema.',
    explicacion:
      'Primero está el problema (no encontraba la llave) y «por eso» introduce la consecuencia (pedí ayuda).',
  },
  {
    id: 'pue-09',
    enfoque: 'coherencia',
    ordenCorrecto: ['Aunque', 'estaba cansado,', 'el explorador', 'siguió', 'caminando'],
    pista: '«Aunque» va al inicio y presenta una dificultad.',
    explicacion:
      '«Aunque» introduce un obstáculo (estaba cansado) que no impide la acción principal (siguió caminando).',
  },
  {
    id: 'pue-10',
    enfoque: 'coherencia',
    ordenCorrecto: ['Las ballenas', 'cantan', 'bajo el mar', 'para comunicarse'],
    ordenesAlternativas: [['Las ballenas', 'cantan', 'para comunicarse', 'bajo el mar']],
    pista: '¿Quiénes cantan? ¿Dónde? ¿Para qué?',
    explicacion:
      'La oración responde: ¿quién? (las ballenas), ¿qué hacen? (cantan), ¿dónde? (bajo el mar) y ¿para qué? (para comunicarse).',
  },
];

/* ─────────────── Mecánica 3 · Tormenta de Meteoritos Acústicos ─────────────── */

export const RETOS_TORMENTA: RetoTormenta[] = [
  {
    id: 'tor-01',
    tipo: 'esdrujulas',
    consigna: '¡Activa en el Altar las 3 palabras ESDRÚJULAS antes de que pase la tormenta!',
    palabras: ['brújula', 'camino', 'cántico', 'reloj', 'pájaro', 'papel'],
    correctas: ['brújula', 'cántico', 'pájaro'],
    segundos: 18,
    pista: 'Las esdrújulas suenan fuerte en la antepenúltima sílaba y SIEMPRE llevan tilde.',
    explicacion:
      'Brú-ju-la, cán-ti-co y pá-ja-ro son esdrújulas: la fuerza está en la antepenúltima sílaba y siempre llevan tilde.',
  },
  {
    id: 'tor-02',
    tipo: 'agudas',
    consigna: '¡Atrapa las 3 palabras AGUDAS antes de que pase la tormenta!',
    palabras: ['canción', 'mesa', 'reloj', 'árbol', 'café', 'libro'],
    correctas: ['canción', 'reloj', 'café'],
    segundos: 18,
    pista: 'En las agudas, la fuerza de la voz cae en la ÚLTIMA sílaba.',
    explicacion:
      'Can-CIÓN, re-LOJ y ca-FÉ son agudas. «Reloj» no lleva tilde porque termina en j (no en n, s o vocal).',
  },
  {
    id: 'tor-03',
    tipo: 'graves',
    consigna: '¡Encaja las 3 palabras GRAVES (llanas) en el escudo del Altar!',
    palabras: ['lápiz', 'sofá', 'fácil', 'murciélago', 'cama', 'balón'],
    correctas: ['lápiz', 'fácil', 'cama'],
    segundos: 18,
    pista: 'En las graves, la fuerza cae en la PENÚLTIMA sílaba.',
    explicacion:
      'LÁ-piz, FÁ-cil y CA-ma son graves. «Cama» no lleva tilde porque las graves terminadas en vocal no la llevan.',
  },
  {
    id: 'tor-04',
    tipo: 'sinonimos',
    consigna: '¡Encuentra 3 SINÓNIMOS de «alegre» antes de que pase la tormenta!',
    palabras: ['contento', 'triste', 'feliz', 'enojado', 'dichoso', 'cansado'],
    correctas: ['contento', 'feliz', 'dichoso'],
    segundos: 18,
    pista: 'Un sinónimo significa lo MISMO o casi lo mismo.',
    explicacion:
      'Contento, feliz y dichoso significan casi lo mismo que «alegre»: son sinónimos.',
  },
  {
    id: 'tor-05',
    tipo: 'antonimos',
    consigna: '¡Atrapa 3 ANTÓNIMOS de «valiente» antes de que pase la tormenta!',
    palabras: ['miedoso', 'audaz', 'cobarde', 'temeroso', 'heroico', 'osado'],
    correctas: ['miedoso', 'cobarde', 'temeroso'],
    segundos: 18,
    pista: 'Un antónimo significa lo CONTRARIO.',
    explicacion:
      'Miedoso, cobarde y temeroso expresan lo contrario de «valiente». Audaz, heroico y osado son sinónimos.',
  },
  {
    id: 'tor-06',
    tipo: 'esdrujulas',
    consigna: '¡Rescata las 3 palabras ESDRÚJULAS de la lluvia de meteoritos!',
    palabras: ['música', 'planeta', 'cámara', 'número', 'estrella', 'nave'],
    correctas: ['música', 'cámara', 'número'],
    segundos: 18,
    pista: 'Busca las que tienen tilde en la antepenúltima sílaba.',
    explicacion:
      'MÚ-si-ca, CÁ-ma-ra y NÚ-me-ro son esdrújulas. Planeta, estrella y nave son graves.',
  },
  {
    id: 'tor-07',
    tipo: 'sinonimos',
    consigna: '¡Encuentra 3 SINÓNIMOS de «rápido» antes de que pase la tormenta!',
    palabras: ['veloz', 'lento', 'ligero', 'pesado', 'raudo', 'tranquilo'],
    correctas: ['veloz', 'ligero', 'raudo'],
    segundos: 18,
    pista: '¿Qué palabras describen algo que se mueve muy deprisa?',
    explicacion:
      'Veloz, ligero y raudo significan casi lo mismo que «rápido». Lento y pesado son sus contrarios.',
  },
  {
    id: 'tor-08',
    tipo: 'agudas',
    consigna: '¡Activa las 3 palabras AGUDAS en el escudo del Altar!',
    palabras: ['compás', 'lunes', 'jabón', 'cráter', 'sillón', 'Marte'],
    correctas: ['compás', 'jabón', 'sillón'],
    segundos: 18,
    pista: 'Lee cada palabra en voz alta y fíjate si la fuerza cae al final.',
    explicacion:
      'Com-PÁS, ja-BÓN y si-LLÓN son agudas terminadas en s o n, por eso llevan tilde.',
  },
  {
    id: 'tor-09',
    tipo: 'antonimos',
    consigna: '¡Atrapa 3 ANTÓNIMOS de «oscuro» antes de que pase la tormenta!',
    palabras: ['claro', 'sombrío', 'luminoso', 'negro', 'brillante', 'tenebroso'],
    correctas: ['claro', 'luminoso', 'brillante'],
    segundos: 18,
    pista: 'Busca palabras relacionadas con la luz.',
    explicacion:
      'Claro, luminoso y brillante son lo contrario de «oscuro». Sombrío y tenebroso son sus sinónimos.',
  },
];

/* ─────────────── Mecánica 4 · El Guardián del Vórtice Gramatical ─────────────── */

export const RETOS_GUARDIAN: RetoGuardianBoss[] = [
  {
    id: 'bos-01',
    titulo: 'Las semillas de estrellas',
    relato:
      '«Viajero, {0} has demostrado valor al llegar hasta aquí», dijo el Guardián con voz de trueno suave. «Hace mucho, los habitantes de Letralia dejaron de leer; {1}, las palabras se apagaron una a una como velas al viento. Pero tú las has despertado. Recuerda siempre: las palabras son semillas de estrellas». Moraleja: {2}.',
    fases: [
      {
        titulo: 'Sello 1 · Tilde diacrítica',
        enunciado: 'Elige la pieza correcta para la primera ranura del códice.',
        opciones: ['tú', 'tu'],
        correcta: 'tú',
        explicacion:
          '«Tú» con tilde es un pronombre: señala a la persona (tú has demostrado). «Tu» sin tilde indica pertenencia: tu mochila.',
      },
      {
        titulo: 'Sello 2 · Conector lógico',
        enunciado: 'Dejar de leer provocó que las palabras se apagaran. ¿Qué conector une la causa con su consecuencia?',
        opciones: ['por eso', 'sin embargo', 'aunque'],
        correcta: 'por eso',
        explicacion:
          '«Por eso» introduce una consecuencia: como dejaron de leer, las palabras se apagaron.',
      },
      {
        titulo: 'Sello 3 · Comprensión e inferencia',
        enunciado: '¿Qué quiere decir el Guardián con «las palabras son semillas de estrellas»?',
        opciones: [
          'al cuidar las palabras, crecen las ideas y el conocimiento',
          'las estrellas nacen de semillas de plantas',
          'las palabras solo sirven para hablar del cielo',
        ],
        correcta: 'al cuidar las palabras, crecen las ideas y el conocimiento',
        explicacion:
          'Es una metáfora: así como una semilla crece, las palabras que leemos y cuidamos hacen crecer nuestras ideas.',
      },
    ],
  },
  {
    id: 'bos-02',
    titulo: 'El faro que nunca duerme',
    relato:
      'El Guardián cerró el gran libro y sonrió. «Yo no {0} quién escribió este códice, pero estoy seguro de que cada lector le añade un poco de luz. Has resuelto todos los acertijos del camino; {1}, mereces la llave del Archivo. Desde hoy, el Archivo Astral será un faro que nunca dormirá». Conclusión: {2}.',
    fases: [
      {
        titulo: 'Sello 1 · Tilde diacrítica',
        enunciado: 'Elige la pieza correcta para la primera ranura del códice.',
        opciones: ['sé', 'se'],
        correcta: 'sé',
        explicacion:
          '«Sé» con tilde es del verbo saber (yo no sé). «Se» sin tilde es un pronombre: el libro se cerró.',
      },
      {
        titulo: 'Sello 2 · Conector lógico',
        enunciado: 'Resolver los acertijos tiene como resultado ganar la llave. ¿Qué conector lo expresa?',
        opciones: ['por lo tanto', 'sin embargo', 'aunque'],
        correcta: 'por lo tanto',
        explicacion:
          '«Por lo tanto» presenta una consecuencia lógica: resolviste los acertijos y, como resultado, mereces la llave.',
      },
      {
        titulo: 'Sello 3 · Comprensión e inferencia',
        enunciado: '¿Qué significa que «el Archivo Astral será un faro que nunca dormirá»?',
        opciones: [
          'seguirá guiando e iluminando a quienes quieran aprender',
          'el Archivo se convertirá en una torre junto al mar',
          'el Guardián ya no podrá dormir nunca',
        ],
        correcta: 'seguirá guiando e iluminando a quienes quieran aprender',
        explicacion:
          'Un faro guía a los barcos en la oscuridad. El Archivo, como un faro, guiará siempre a los lectores con su conocimiento.',
      },
    ],
  },
  {
    id: 'bos-03',
    titulo: 'El río de tinta',
    relato:
      'Cuando el viajero tocó la puerta de cristal, el Guardián abrió los ojos. «Un sabio antiguo escribió este códice, y {0} lo guardó aquí para ti. Muchos quisieron rendirse en el camino; {1}, tú seguiste adelante. Tus pasos dejaron un río de tinta que otros podrán seguir». Significado: {2}.',
    fases: [
      {
        titulo: 'Sello 1 · Tilde diacrítica',
        enunciado: 'Elige la pieza correcta para la primera ranura del códice.',
        opciones: ['él', 'el'],
        correcta: 'él',
        explicacion:
          '«Él» con tilde es un pronombre que reemplaza a una persona (el sabio). «El» sin tilde es un artículo: el libro.',
      },
      {
        titulo: 'Sello 2 · Conector lógico',
        enunciado: 'Otros se rindieron, pero el viajero no. ¿Qué conector muestra esa oposición?',
        opciones: ['sin embargo', 'por eso', 'además'],
        correcta: 'sin embargo',
        explicacion:
          '«Sin embargo» une dos ideas opuestas: muchos se rindieron, pero el viajero siguió adelante.',
      },
      {
        titulo: 'Sello 3 · Comprensión e inferencia',
        enunciado: '¿Qué significa «tus pasos dejaron un río de tinta que otros podrán seguir»?',
        opciones: [
          'su esfuerzo y lo aprendido servirán de guía a otros',
          'el viajero derramó tinta por todo el camino',
          'en Letralia existe un río de color azul',
        ],
        correcta: 'su esfuerzo y lo aprendido servirán de guía a otros',
        explicacion:
          'Es lenguaje figurado: el «río de tinta» representa el camino de aprendizaje que el viajero deja como ejemplo.',
      },
    ],
  },
];

/* ─────────────── Sílabas Clave ─────────────── */

/** Cada partida elige una palabra de 4 sílabas que forma la llave del Guardián. */
export const PALABRAS_LLAVE: { palabra: string; silabas: [string, string, string, string] }[] = [
  { palabra: 'ESDRÚJULA', silabas: ['ES', 'DRÚ', 'JU', 'LA'] },
  { palabra: 'METÁFORA', silabas: ['ME', 'TÁ', 'FO', 'RA'] },
  { palabra: 'GRAMÁTICA', silabas: ['GRA', 'MÁ', 'TI', 'CA'] },
  { palabra: 'BIBLIOTECA', silabas: ['BI', 'BLIO', 'TE', 'CA'] },
  { palabra: 'ORTOGRAFÍA', silabas: ['OR', 'TO', 'GRA', 'FÍA'] },
];

/* ─────────────── Utilidades ─────────────── */

export function barajar<T>(arr: readonly T[]): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Selector sin repetición: devuelve un elemento al azar que no se haya usado
 * todavía (filtrado opcional). Cuando se agotan, reinicia el ciclo.
 */
export function elegirSinRepetir<T extends { id: string }>(
  banco: readonly T[],
  usados: Set<string>,
  filtro?: (r: T) => boolean,
): T {
  const candidatos = banco.filter((r) => (!filtro || filtro(r)) && !usados.has(r.id));
  let pool = candidatos;
  if (pool.length === 0) {
    banco.forEach((r) => {
      if (!filtro || filtro(r)) usados.delete(r.id);
    });
    pool = banco.filter((r) => !filtro || filtro(r));
    if (pool.length === 0) pool = [...banco];
  }
  const elegido = pool[Math.floor(Math.random() * pool.length)];
  usados.add(elegido.id);
  return elegido;
}

/** Comprueba si un orden de tablillas forma una oración válida. */
export function validarPuente(reto: RetoPuenteSintactico, orden: string[]): boolean {
  const unir = (a: string[]) => a.join(' ').replace(/\s+/g, ' ').trim();
  const intento = unir(orden);
  return [reto.ordenCorrecto, ...(reto.ordenesAlternativas ?? [])].some((o) => unir(o) === intento);
}

