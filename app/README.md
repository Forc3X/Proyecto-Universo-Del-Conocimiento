# 📄 Páginas y Rutas del Frontend (`app/`)

Este directorio contiene las páginas del **App Router de Next.js 16** y los contenedores globales del entorno espacial.

## Mapa de Rutas

| Ruta | Archivo | Descripción |
| :--- | :--- | :--- |
| `/` | `app/page.tsx` | Landing page principal con hero espacial y vista previa interactiva de los 3 planetas. |
| `/about` | `app/about/page.tsx` | Información institucional y objetivos pedagógicos del proyecto. |
| `/how-to-play` | `app/how-to-play/page.tsx` | Guía interactiva de reglas, mecánicas de dados y progresión por niveles. |
| `/dashboard` | `app/dashboard/page.tsx` | Mapa estelar con planetas desbloqueados y progreso del estudiante. |
| `/planeta/[id]` | `app/planeta/[id]/page.tsx` | Vista de detalle de un planeta con sus cursos y nodos de nivel. |
| `/juego/[planetId]/[levelId]` | `app/juego/[planetId]/[levelId]/page.tsx` | Escenario de juego a pantalla completa (`100vh`) que carga el tablero interactivo según el planeta (`Numérix` o `Letralia`). |
| `/admin` | `app/admin/page.tsx` | Panel de administración de usuarios, cursos y niveles. |
| `/maestro` | `app/maestro/page.tsx` | Panel de seguimiento para docentes y tutores. |

## Archivos Globales en `app/`

- **`layout.tsx`**: Layout raíz con tipografías y proveedores de estado.
- **`FondoCosmico.tsx` / `FondoWrapper.tsx`**: Fondo espacial animado de partículas y nebulosas.
- **`globals.css`**: Configuración de Tailwind CSS v4 y variables de tema.
