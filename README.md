# 🌌 Universo del Conocimiento

Plataforma educativa gamificada espacial para niños de primaria (10 a 12 años, 5.º y 6.º grado), construida con **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4** y **Framer Motion**.

---

## 🚀 Stack Tecnológico

- **Framework:** Next.js 16 (App Router) + React 19
- **Lenguaje:** TypeScript 5
- **Estilos y Animaciones:** Tailwind CSS v4 + Framer Motion 12
- **Estado y Sincronización:** Zustand (`lib/auth-store.ts`), PowerSync + Supabase

---

## 🪐 Planetas y Tableros Interactivos

| ID | Planeta | Materia | Tablero Interactivo | Banco Pedagógico |
| :--- | :--- | :--- | :--- | :--- |
| `1` | **Numérix** | Matemáticas | `app/components/TableroIsometrico.tsx` + `app/components/numerix/` | `lib/preguntas-numerix.ts` |
| `2` | **Letralia (Verbum)** | Lenguaje y Comunicación | `app/components/TableroLetralia.tsx` + `app/components/letralia/` | `lib/preguntas-letralia.ts` |
| `3` | **BioGénesis** | Ciencias Naturales | Vista estándar de cursos/niveles | `lib/mock-data.ts` |

---

## 📁 Estructura de Documentación por Módulo

Cada directorio cuenta con su propio archivo `README.md` explicando la arquitectura, componentes y cambios realizados:

- [`app/README.md`](./app/README.md) — Mapa de rutas y páginas del frontend.
- [`app/juego/README.MD`](./app/juego/README.MD) — Ruta dinámica de juego `/juego/[planetId]/[levelId]` y conexión de tableros por planeta.
- [`app/components/README.md`](./app/components/README.md) — Catálogo general de componentes visuales e interactivos.
- [`app/components/numerix/README.md`](./app/components/numerix/README.md) — Documentación técnica del **Tablero Cuántico de Numérix** (Montaña 3D escalonada y modales tácticos).
- [`app/components/letralia/README.md`](./app/components/letralia/README.md) — Documentación técnica del **Archivo Astral de Letralia** (Mapa bifurcado de 36 casillas y Altar de Decodificación).
- [`lib/README.md`](./lib/README.md) — Bancos de preguntas pedagógicas, barajado dinámico de opciones, estado de autenticación y datos mock.
- [`shared/README.md`](./shared/README.md) — Contratos e interfaces TypeScript compartidas.
- [`docs/README.md`](./docs/README.md) — Índice de documentación académica y registro técnico en [`docs/07-TABLEROS-INTERACTIVOS-NUMERIX-Y-LETRALIA.md`](./docs/07-TABLEROS-INTERACTIVOS-NUMERIX-Y-LETRALIA.md).

---

## 🛠️ Ejecución en Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# Verificar tipado TypeScript
npx tsc --noEmit
```
