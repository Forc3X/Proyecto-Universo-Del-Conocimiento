# 🧩 Componentes del Frontend (`app/components/`)

Este directorio agrupa los componentes interactivos de los tableros planetarios, el dado 3D reutilizable y los elementos visuales del mapa estelar.

---

## 📋 Catálogo de Componentes Principales

| Componente | Archivo | Descripción |
| :--- | :--- | :--- |
| `TableroIsometrico` | `TableroIsometrico.tsx` | Tablero principal del **Nivel 1 de Numérix** (Matemáticas). Integra la montaña cuántica 3D de 20 cubos, el HUD lateral derecho de cristal zafiro y los 3 modales tácticos. |
| `TableroLetralia` | `TableroLetralia.tsx` | Tablero principal del **Nivel 1 de Letralia / Verbum** (Lenguaje). Integra el mapa astral de 36 casillas con bifurcación en 3 caminos, el HUD de pergamino y el Altar de Decodificación. |
| `Dado3D` | `Dado3D.tsx` | Cubo 3D interactivo animado con Framer Motion (`preserve-3d`). Soporta temas personalizados (`faceColor`, `borderColor`, `pipColor`) con reflejo holográfico cian para temas oscuros (Numérix) y brillo suave para temas pastel (Letralia). |
| `Planeta` | `Planeta.tsx` | Esfera planetaria animada con halo y vista de progreso para el estudiante o descripción pedagógica para el tutor. |
| `PlanetVisual` | `PlanetVisual.tsx` | Renderizado volumétrico de planetas en el mapa estelar. |
| `StarNode` | `StarNode.tsx` | Nodo interactivo de nivel dentro de la constelación de cada planeta. |
| `ConstellationWeb` | `ConstellationWeb.tsx` | Red de conexiones estelares entre los niveles de un curso. |
| `Nebula3D` / `NebulaParticles` | `Nebula3D.tsx` / `NebulaParticles.tsx` | Efectos atmosféricos espaciales de fondo. |
| `CategoryLegend` | `CategoryLegend.tsx` | Leyenda visual de categorías de materias. |

---

## 📂 Submódulos Especializados

- **[`numerix/`](./numerix/README.md)**: Componentes del escenario 3D y modales cuánticos del planeta **Numérix**:
  - `MapaMontañaCuantica.tsx` — Escenario SVG de la montaña rocosa escalonada en 4 niveles, riel de fibra óptica, 20 cubos isométricos 3D, portal de inicio, astronauta y Esfera Armilar Dorada.
  - `ModalesNumerix.tsx` — Los 3 modales de juego (`ModalReactorCuantico`, `ModalAlertaImpacto` y `ModalGuardianArmilar`).
- **[`letralia/`](./letralia/README.md)**: Componentes del escenario astral y mecánicas lingüísticas del planeta **Letralia**:
  - `MapaAstral.tsx` — Escenario SVG de islas flotantes, camino de pergamino de 36 casillas, estela acuarela y selector de bifurcación.
  - `AltarDecodificacion.tsx` — Modal unificado de las 4 mecánicas de lenguaje + Grimorio de Letras.
  - `ElViajero.tsx` — Personaje explorador con sombrero de paja y capa celeste-coral.
  - `mapa.ts` — Topología del grafo de 36 nodos y reglas de avance/bifurcación.
