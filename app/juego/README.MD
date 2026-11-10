# 🎲 Juego — Ruta Dinámica de Tableros (`/juego/[planetId]/[levelId]`)

Ruta dinámica: `app/juego/[planetId]/[levelId]/page.tsx`

| Parámetro | Tipo | Descripción |
| :--- | :--- | :--- |
| `[planetId]` | `number` | ID del planeta (`1` = **Numérix**, `2` = **Letralia**, `3` = **BioGénesis**) |
| `[levelId]` | `number` | ID del nivel a jugar (Nivel 1 implementa los tableros isométricos/astrales completos) |

---

## 🪐 Enrutamiento de Tableros por Planeta (`levelId === 1`)

Cuando el jugador accede al **Nivel 1**, `page.tsx` renderiza un contenedor a pantalla completa (`h-screen overflow-hidden`) sin barras de navegación externas, delegando el HUD y los controles al tablero especializado de cada planeta:

1. **Planeta 1 — Numérix (`/juego/1/1`):**
   - Renderiza `<TableroIsometrico />` (`app/components/TableroIsometrico.tsx`).
   - Recorrido lineal en "S" ascendente de **20 cubos isométricos** sobre una **Montaña Cuántica 3D escalonada**.
   - Incluye el **Reactor de Propulsión Cuántica**, **Alerta de Impacto (Escudo Antimateria)** y el duelo final en 3 fases contra el **Guardián del Nivel — Núcleo Armilar**.
2. **Planeta 2 — Letralia / Verbum (`/juego/2/1`):**
   - Renderiza `<TableroLetralia />` (`app/components/TableroLetralia.tsx`).
   - Tablero ilustrado de **36 casillas** sobre islas astrales flotantes con **selector de bifurcación en 3 caminos** (`Izquierdo`, `Central`, `Derecho`) en la casilla `start_5`.
   - Incluye el **Altar de Decodificación** con 4 mecánicas de lenguaje: *Caza del Intruso*, *Constructor de Puentes Sintácticos*, *Tormenta de Meteoritos de Palabras* y el *Guardián del Idioma (Códice Corrupto)*.

---

## ✅ Estado de Implementación

- [x] Integrar componente `Dado3D` con temas personalizados por planeta (cristal cian cuántico en Numérix y lavanda astral en Letralia).
- [x] Sistema de bancos de preguntas pedagógicas (`lib/preguntas-numerix.ts` y `lib/preguntas-letralia.ts`) con barajado aleatorio Fisher-Yates de opciones.
- [x] Lógica de progreso, recolección de **4 Núcleos Cuánticos** (Numérix) y **4 Sílabas Clave** (Letralia).
- [x] Duelo de Jefe Final por fases con cambio automático de pregunta en caso de error.
