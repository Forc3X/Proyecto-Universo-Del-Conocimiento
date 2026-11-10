# 🪐 07 — Tableros Interactivos de Nivel 1: Numérix y Letralia

Este documento registra la arquitectura, dirección estética, topología de casillas y mecánicas pedagógicas implementadas para el **Nivel 1 de Numérix (`planetId = 1`)** y el **Nivel 1 de Letralia / Verbum (`planetId = 2`)**.

---

## 1. Planeta Letralia / Verbum (`planetId = 2`) — "Archivo Astral"

### 1.1. Archivos Relacionados
- **Componente Principal:** `app/components/TableroLetralia.tsx`
- **Subcomponentes (`app/components/letralia/`):**
  - `MapaAstral.tsx` — Lienzo SVG ilustrado con 4 islas flotantes, arcos de templo, rastro acuarela y 36 casillas.
  - `AltarDecodificacion.tsx` — Modal rúnico unificado para las 4 mecánicas de lenguaje y el Grimorio de Letras.
  - `ElViajero.tsx` — Token animado del jugador con sombrero de explorador y capa celeste-coral.
  - `mapa.ts` — Grafo de 36 nodos y lógica de bifurcación en 3 caminos.
- **Banco Pedagógico:** `lib/preguntas-letralia.ts`

### 1.2. Dirección Estética ("Cuento Ilustrado Astral")
- **Cielo Crepúsculo Sereno:** Gradiente `#3B5284` a `#1E293B` con constelaciones, anillos orbitales y nubes suaves.
- **Camino de Pergamino Desplegado:** Losas en crema cálido (`#FDF6E3`) con texto en índigo profundo (`#1E1B4B`) y hexágonos rúnicos en lavanda (`#C4B5FD`), coral (`#FDA4AF`) y menta (`#6EE7B7`).
- **Interfaz Limpia:** Botón flotante `← Mapa` arriba a la izquierda, banderín superior `TURNO ↻`, píldora inferior de estado y HUD derecho tipo pergamino (`LETRALIA — ARCHIVO ASTRAL`) con Dado 3D lavanda, barra de progreso, 6 ranuras de cristales de sílabas y botones `TIRAR DADO` y `LETRAS`.

### 1.3. Topología del Tablero (36 Casillas Totales / 16 Efectivas por Partida)
1. **Camino Inicial (`start_1` a `start_5`):** 5 casillas de introducción. En `start_3` se recolecta la 1.ª Sílaba Clave (`CÓ`).
2. **Selector de Bifurcación (`start_5`):** Detiene el avance para que el niño elija entre 3 flechas flotantes interactivas:
   - **Izquierda (`left_1..10`):** Sendero del Acento y la Ortografía.
   - **Centro (`center_1..10`):** Sendero de los Puentes Sintácticos.
   - **Derecha (`right_1..10`):** Sendero del Léxico y Significado.
3. **Recolección de Sílabas Clave:** En cada camino, las casillas `3`, `6` y `10` otorgan las 3 sílabas restantes (`DI`, `CE`, `LUZ`).
4. **Santuario del Guardián (`boss_36`):** Convergencia de los 3 caminos para enfrentar las 3 fases del **Códice Corrupto**.

---

## 2. Planeta Numérix (`planetId = 1`) — "Montaña Cuántica Futurista"

### 2.1. Archivos Relacionados
- **Componente Principal:** `app/components/TableroIsometrico.tsx`
- **Subcomponentes (`app/components/numerix/`):**
  - `MapaMontañaCuantica.tsx` — Escenario SVG de la montaña rocosa escalonada 3D, riel luminoso y 20 cubos isométricos.
  - `ModalesNumerix.tsx` — Modales `ModalReactorCuantico`, `ModalAlertaImpacto` y `ModalGuardianArmilar`.
- **Dado 3D:** `app/components/Dado3D.tsx`
- **Banco Pedagógico:** `lib/preguntas-numerix.ts`

### 2.2. Reformas Visuales y Arquitectónicas Aplicadas
1. **Montaña Rocosa 3D en 4 Niveles Escalonados (`EscenarioMontaña`):**
   - Construcción volumétrica con raíces/estalactitas colgantes en la base flotante, paredes verticales de acantilado con facetas iluminadas y en sombra, grietas de energía cian bioluminiscente, cascada cuántica vertical y 12 racimos de cristales.
   - Separación espacial entre el cubo `19` (`x: 272, y: 178`) y el altar de la **Casilla 20** (`x: 184, y: 248`) para que la **Gran Esfera Armilar Dorada** luzca despejada en la cumbre.
2. **Alineación de Interfaz con Letralia (Sin "Mapa de Sensores"):**
   - Se eliminó la barra superior antigua y el recuadro "Mapa de Sensores".
   - Se incorporó el botón cápsula `← Mapa`, el banderín superior biselado `◀ SALTO CUÁNTICO ▶`, la píldora inferior de instrucciones y el HUD lateral derecho `NUMÉRIX — TABLERO CUÁNTICO` con Dado 3D holográfico cian, barra de progreso (`0%` a `100%`), 4 cápsulas verticales de **Núcleos Cuánticos (`+`, `−`, `×`, `÷`)**, estado de la **Llave del Guardián** y botones `INICIAR SALTO` y `FÓRMULAS Y GUÍA`.
3. **Simplificación y Dinamismo del Desafío del Jefe Final (`ModalGuardianArmilar`):**
   - Se reemplazaron las preguntas complejas por un banco de **10 retos ágiles y amigables** (`RETOS_ARMILAR_BOSS` en `lib/preguntas-numerix.ts`) adecuados para niños de 10 a 12 años.
   - **Cambio de pregunta al fallar:** Si el jugador se equivoca en cualquiera de las 3 fases del Guardián, al presionar **`NUEVA PREGUNTA ↻`** se selecciona automáticamente una **pregunta distinta** mediante `getRandomRetoBoss(usadosBossRef.current)`.
4. **Posición Aleatoria de la Respuesta Correcta:**
   - Todas las preguntas normales (`getRandomPregunta`) y del Jefe Final (`getRandomRetoBoss`) barajan sus opciones en tiempo real mediante el algoritmo **Fisher-Yates** (`barajarOpcionesPregunta` y `barajarRetoBoss`), garantizando que la respuesta correcta se distribuya aleatoriamente entre izquierda, centro y derecha.
