# 📦 Librerías, Estado y Bancos Pedagógicos (`lib/`)

Este directorio contiene los bancos de preguntas de cada planeta, los datos mock de cursos/niveles, la gestión de autenticación con Zustand y los conectores de sincronización offline-first (PowerSync + Supabase).

---

## 📄 Archivos Principales

| Archivo | Descripción |
| :--- | :--- |
| `preguntas-numerix.ts` | Banco pedagógico de Matemáticas para el **Nivel 1 de Numérix** (niños de 10 a 12 años) + retos del Jefe Final y funciones de barajado aleatorio Fisher-Yates. |
| `preguntas-letralia.ts` | Banco pedagógico completo de Lenguaje y Comunicación para el **Nivel 1 de Letralia / Verbum** (5.º y 6.º de primaria) con 29 retos distribuidos en 4 mecánicas y 3 caminos. |
| `mock-data.ts` | Definición de planetas (`Numérix`, `Letralia`, `BioGénesis`), cursos y niveles iniciales de la plataforma. |
| `auth-store.ts` | Store global de autenticación en Zustand (usuario actual, rol, token y persistencia en `localStorage`). |
| `auth-service.ts` | Servicios de inicio de sesión, registro y validación de credenciales. |
| `powersync.ts` / `powersync-connector.ts` | Esquema local SQLite y conector de sincronización con Supabase. |

---

## 🔢 `preguntas-numerix.ts` — Detalle Técnico

- **`PREGUNTAS_NUMERIX` (20 preguntas de 1 y 2 cifras):**
  - 5 de **Suma (`+`)**, 5 de **Resta (`−`)**, 5 de **Multiplicación (`×`)** y 5 de **División exacta (`÷`)**.
  - Cada pregunta incluye `enunciado`, `opciones` (4 alternativas), `indiceRespuestaCorrecta`, `pista` y `explicacionBreve`.
- **`RETOS_ARMILAR_BOSS` (10 retos sencillos para el Guardián del Nivel):**
  - Problemas ágiles y directos de cálculo mental (sumas, restas, tablas básicas y repartos exactos) pensados para las 3 fases de la **Esfera Armilar Dorada**.
- **Aleatorización de Opciones (`barajarOpcionesPregunta` y `barajarRetoBoss`):**
  - Tanto `getRandomPregunta(excludeIds)` como `getRandomRetoBoss(excludeIds)` aplican un barajado **Fisher-Yates** sobre el arreglo de opciones cada vez que se extrae un reto, recalculando dinámicamente el índice correcto (`0`, `1`, `2` o `3`) para evitar que la respuesta correcta quede siempre en el centro.
  - Cuando el jugador se equivoca en el desafío del Jefe Final, `getRandomRetoBoss(usadosBossRef.current)` entrega una **pregunta diferente** no repetida.

---

## 📖 `preguntas-letralia.ts` — Detalle Técnico

- **12 Retos de Caza del Intruso (`RETOS_INTRUSO`):** Ortografía (`b/v`, `c/s/z`, `g/j`, `h`), acentuación (agudas, graves, esdrújulas) y familias léxicas, clasificados por camino (`left`, `center`, `right`, `any`).
- **8 Retos de Constructor de Puentes Sintácticos (`RETOS_PUENTE`):** Oraciones desordenadas en 5 fragmentos (`palabrasDesordenadas` vs `ordenCorrecto`) para reconstruir en las 5 ranuras curvas del **Altar de Decodificación**.
- **6 Retos de Tormenta de Meteoritos (`RETOS_TORMENTA`):** Identificación rápida (12 s) de esdrújulas, verbos en pasado, sustantivos abstractos, hiatos, sinónimos y antónimos.
- **3 Fases del Guardián del Idioma (`FASES_GUARDIAN_LETRALIA`):**
  1. *Restauración Ortográfica* (`start` / Fase 1).
  2. *Coherencia y Conectores Lógicos* (Fase 2).
  3. *Comprensión Lectora del Mensaje Astral* (Fase 3).
- **`SILABAS_CLAVE_LETRALIA`:** Las 4 sílabas rúnicas (`CÓ` - `DI` - `CE` - `LUZ`) que abren el Santuario del Guardián en la casilla `boss_36`.
