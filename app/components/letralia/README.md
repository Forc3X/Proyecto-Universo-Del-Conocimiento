# 📜 Submódulo Letralia (`app/components/letralia/`)

Componentes visuales, topológicos e interactivos del **Nivel 1 de Letralia / Verbum (Archivo Astral)** para niños de 10 a 12 años (5.º y 6.º de primaria), diseñados bajo la dirección estética **"Cuento Ilustrado Astral"** (*El Principito* / *Monument Valley*).

---

## 📄 Archivos del Módulo

### 1. `mapa.ts`
Define la topología completa del tablero de **36 casillas** (`NODOS_MAPA_LETRALIA`), donde cada partida recorre **16 casillas efectivas**:

- **Tramo Inicial (`start_1` a `start_5`):** 5 losas sobre el pergamino inicial. En `start_3` se obtiene la 1.ª Sílaba Clave (`CÓ`) y en `start_5` se activa la **Encrucijada Astral**.
- **Selector de Bifurcación en `start_5`:** Al llegar o pasar por `start_5`, el movimiento se pausa para que el jugador elija uno de los **3 caminos de 10 casillas**:
  - `left` (**Sendero del Acento y la Ortografía** — `left_1` a `left_10`).
  - `center` (**Sendero de los Puentes Sintácticos** — `center_1` a `center_10`).
  - `right` (**Sendero del Léxico y el Significado** — `right_1` a `right_10`).
- **Distribución en cada camino de 10 nodos:**
  - Casillas `1, 2, 4, 7, 8`: Losas de pergamino con glifo (`A, Ñ, Ω, Σ`) → *Caza del Intruso*.
  - Casillas `3, 6`: Hexágonos Lavanda/Menta → *Constructor de Puentes Sintácticos* (+1 Sílaba Clave).
  - Casillas `5, 9`: Hexágonos Coral → *Tormenta de Meteoritos de Palabras*.
  - Casilla `10`: Hexágono Dorado/Lavanda → *Portal de Convergencia* (+4.ª Sílaba Clave).
- **Santuario del Guardián (`boss_36`):** Casilla final donde convergen los 3 caminos para activar el duelo de 3 fases contra el Guardián del Idioma.

---

### 2. `MapaAstral.tsx`
Renderiza el lienzo ilustrado SVG (`viewBox="0 0 1000 700"`) con:
- Fondo crepúsculo sereno (`#3B5284` a `#1E293B`), anillos astrolábicos, constelaciones y nubes suaves en las esquinas inferiores.
- **4 Islas Flotantes de Roca Rosada/Lavanda** con vegetación menta/coral y **2 Arcos de Templo Clásico** en la salida (`start_1`) y la meta (`boss_36`).
- Camino continuo de **pergamino crema cálido (`#FDF6E3`)** con rollos enrollados y losas numeradas/rotuladas con glifos antiguos y **hexágonos rúnicos 3D biselados** en lavanda, coral y menta.
- **Estela de Tinta Acuarela Celeste-Coral** que ilumina dinámicamente las casillas ya recorridas por el jugador.
- **3 Flechas Flotantes Interactivas** en `start_5` cuando el jugador debe elegir su camino.

---

### 3. `ElViajero.tsx`
Componente SVG animado del personaje del jugador (**El Viajero**): un niño explorador con sombrero de paja redondo, túnica crema cálida, capa ondeante con gradiente celeste-coral (`#7DD3FC` → `#FDBA74`) y sombra suave proyectada sobre la losa actual.

---

### 4. `AltarDecodificacion.tsx`
Modal unificado con marco rúnico lavanda, plumas mágicas laterales, barra curva de 5 ranuras luminosas (menta y azul cielo), botón circular `AYUDA` y soporte para las **4 mecánicas pedagógicas**:

1. **Mecánica 1 — Caza del Intruso:** Selección de la palabra mal escrita, con tilde incorrecta o que no pertenece a la familia semántica entre 4 tablillas flotantes.
2. **Mecánica 2 — Constructor de Puentes Sintácticos:** Ordenamiento de 5 tablillas de pergamino en las 5 ranuras curvas del altar para formar una oración coherente (otorga 1 Cristal de Sílaba).
3. **Mecánica 3 — Tormenta de Meteoritos de Palabras:** Reto con temporizador visual de 12 segundos para atrapar el meteorito léxico que cumple la condición gramatical.
4. **Mecánica 4 — Guardián del Idioma (El Códice Corrupto):** Duelo final en **3 fases consecutivas** tras desbloquear el sello con las 4 Sílabas Clave (`CÓ - DI - CE - LUZ`).
5. **`ModalGrimorioLetras`:** Diccionario de bolsillo accesible desde el botón `LETRAS` del HUD con las sílabas recolectadas y reglas rápidas de acentuación y sintaxis.
