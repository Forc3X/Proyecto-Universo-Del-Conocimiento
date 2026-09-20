export interface PreguntaMatematica {
  id: number;
  enunciado: string;
  opciones: string[];
  indiceRespuestaCorrecta: number;
  explicacionBreve: string;
}

export const PREGUNTAS_NUMERIX: PreguntaMatematica[] = [
  {
    id: 1,
    enunciado: "¿Cuánto es 48 + 37?",
    opciones: ["75", "85", "84", "95"],
    indiceRespuestaCorrecta: 1,
    explicacionBreve: "Primero sumamos 40 + 30 = 70. Luego 8 + 7 = 15. Por último, 70 + 15 = 85."
  },
  {
    id: 2,
    enunciado: "Calcula rápidamente: 120 - 45",
    opciones: ["85", "65", "75", "80"],
    indiceRespuestaCorrecta: 2,
    explicacionBreve: "A 120 le restamos 40 y nos quedan 80. Luego le restamos 5 más, llegando a 75."
  },
  {
    id: 3,
    enunciado: "Tu nave tenía 85 litros de combustible estelar y gastó 29 al cruzar un asteroide. ¿Cuántos litros quedan?",
    opciones: ["54", "66", "64", "56"],
    indiceRespuestaCorrecta: 3,
    explicacionBreve: "85 menos 30 son 55, pero como debíamos restar solo 29, le devolvemos 1 y nos da 56."
  },
  {
    id: 4,
    enunciado: "Recogiste 150 cristales cósmicos, pero se te cayeron 35 por un agujero negro. ¿Cuántos te quedan?",
    opciones: ["105", "115", "125", "110"],
    indiceRespuestaCorrecta: 1,
    explicacionBreve: "A 150 le restamos 30 y quedan 120. Si le quitamos los 5 restantes, nos da 115."
  },
  {
    id: 5,
    enunciado: "Resuelve mentalmente: 235 + 140",
    opciones: ["365", "385", "375", "355"],
    indiceRespuestaCorrecta: 2,
    explicacionBreve: "Sumamos las centenas (200 + 100 = 300) y las demás cifras (35 + 40 = 75). ¡Da 375!"
  },
  {
    id: 6,
    enunciado: "El propulsor izquierdo generó 62 de energía y el derecho 59. ¿Cuánta energía tienes en total?",
    opciones: ["111", "121", "131", "119"],
    indiceRespuestaCorrecta: 1,
    explicacionBreve: "Podemos pensar en 60 + 60 = 120. Como sumamos 62 (+2) y 59 (-1), sumamos 1 extra: 121."
  },
  {
    id: 7,
    enunciado: "Reto rápido: 50 + 40 - 25",
    opciones: ["65", "55", "75", "60"],
    indiceRespuestaCorrecta: 0,
    explicacionBreve: "50 + 40 son 90. A 90 le restamos 20 (quedan 70) y luego 5 más, ¡quedan 65!"
  },
  {
    id: 8,
    enunciado: "¿Cuánto es 310 - 150?",
    opciones: ["140", "150", "170", "160"],
    indiceRespuestaCorrecta: 3,
    explicacionBreve: "Si a 310 le quitamos 100 quedan 210. Luego le quitamos los 50 restantes y llegamos a 160."
  },
  {
    id: 9,
    enunciado: "Un planeta está a 98 años luz de distancia. Si nuestra nave ya recorrió 25 años luz, ¿cuántos años luz nos faltan para llegar?",
    opciones: ["63", "73", "75", "83"],
    indiceRespuestaCorrecta: 1,
    explicacionBreve: "Restamos las decenas: 90 - 20 = 70. Luego las unidades: 8 - 5 = 3. Nos da 73 años luz."
  },
  {
    id: 10,
    enunciado: "Calcula en tu mente: 1000 - 350",
    opciones: ["550", "750", "650", "850"],
    indiceRespuestaCorrecta: 2,
    explicacionBreve: "A 1000 le quitamos 300 y nos da 700. Luego le restamos 50 y nos quedan 650."
  },
  {
    id: 11,
    enunciado: "Suma exacta: 145 + 55",
    opciones: ["190", "210", "200", "195"],
    indiceRespuestaCorrecta: 2,
    explicacionBreve: "Si a 145 le sumamos 5, completamos 150. Sumándole los 50 restantes, llegamos exactos a 200."
  },
  {
    id: 12,
    enunciado: "Un alienígena amigable te regala 75 estrellas y tú ya tenías 48. ¿Cuántas estrellas tienes ahora?",
    opciones: ["113", "133", "115", "123"],
    indiceRespuestaCorrecta: 3,
    explicacionBreve: "Decenas: 70 + 40 = 110. Unidades: 5 + 8 = 13. Sumando todo: 110 + 13 = 123."
  },
  {
    id: 13,
    enunciado: "Reto de Guardián: 180 - 90 + 35",
    opciones: ["115", "135", "125", "120"],
    indiceRespuestaCorrecta: 2,
    explicacionBreve: "La mitad de 180 es 90 (es decir, 180 - 90 = 90). Si a eso le sumamos 35, nos da 125."
  },
  {
    id: 14,
    enunciado: "Reto de Guardián: 200 + 150 - 45",
    opciones: ["315", "305", "295", "310"],
    indiceRespuestaCorrecta: 1,
    explicacionBreve: "Primero sumamos 200 + 150 = 350. A 350 le restamos 40 (310) y luego 5, llegando a 305."
  },
  {
    id: 15,
    enunciado: "Tu escudo cuántico aguanta 500 impactos. Acabas de recibir 225 de daño. ¿Cuánto escudo te queda?",
    opciones: ["275", "325", "225", "285"],
    indiceRespuestaCorrecta: 0,
    explicacionBreve: "500 menos 200 es 300. Si a 300 le quitamos los 25 restantes, nos quedan 275 de escudo."
  }
];

export function getRandomPregunta(): PreguntaMatematica {
  const indice = Math.floor(Math.random() * PREGUNTAS_NUMERIX.length);
  return PREGUNTAS_NUMERIX[indice];
}
