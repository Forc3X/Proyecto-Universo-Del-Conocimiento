# 📋 Changelog — Universo del Conocimiento

Todas las modificaciones significativas del proyecto se documentan aquí.

## [0.6.0] — 2026-06-21 (Mejoras visuales y frontend)

### Añadido
- Modal de explicación de módulo al hacer clic en "EXPLORAR" en un planeta
- Elementos temáticos flotantes en planetas (símbolos matemáticos, letras, iconos de naturaleza)

### Modificado
- `web/app/page.tsx`: planetas en landing ahora tienen datos de cursos para el modal
- `web/app/components/Planeta.tsx`:
  - Mejorada textura: capas de anillos atmosféricos, bandas, brillo especular
  - Añadidos elementos temáticos flotantes (Numérix: +−×÷=, Letralia: A B C D, Naturae: 🌿🌱🍃)
  - Nuevo modal con explicación del módulo (cursos y niveles)
- `web/app/about/page.tsx`: "Verbum" → "Letralia", "Lengua" → "Lenguas"
- `web/app/dashboard/page.tsx`: "Verbum" → "Letralia"
- `web/app/maestro/page.tsx`: "Verbum" → "Letralia"

## [0.5.0] — 2026-06-20 (Optimización + Diseño infantil)

### Añadido
- `CONTEXT.md`: contexto completo del proyecto para handoff entre sesiones
- Animación `shimmer` en el hero title (gradiente móvil)
- Fondo cósmico (`FondoCosmico`) en páginas /about y /how-to-play
- Efectos visuales: float, bounce, ping en cards y planetas (CSS nativo, sin RAF)

### Modificado
- `web/app/FondoCosmico.tsx`: optimización crítica de rendimiento
  - Estrellas: 320 → 80
  - Eliminado `shadowBlur` por estrella (causa principal de lag)
  - Nebulosas cacheadas en offscreen canvas
  - Pausa animación cuando la pestaña no está visible
- `web/app/components/Planeta.tsx`: RAF reemplazado por animaciones CSS (`@keyframes`)
- `web/app/layout.tsx`: añadido `suppressHydrationWarning` en `<html>` y `<body>`
- `web/next.config.ts`: optimizaciones de imágenes (AVIF/WebP), removed Console en prod
- `web/app/page.tsx`:
  - Hero title más pequeño (text-7xl) con gradiente animado
  - Planet cards ahora usan componente `Planeta.tsx` (esfera 3D animada)
  - Lazy loading de FondoCosmico con `dynamic()`
- `web/app/dashboard/page.tsx`: lazy loading de FondoCosmico
- `web/app/about/page.tsx`: rediseñado con fondo cósmico, animaciones, colores vibrantes
- `web/app/how-to-play/page.tsx`: rediseñado con cards animadas, gradientes por regla

## [0.4.0] — 2026-06-20 (Fase 4)

### Añadido
- `web/app/about/page.tsx`: página informativa con origen del proyecto, planetas y stack
- `web/app/how-to-play/page.tsx`: reglas del juego detalladas (dado, combustible, eventos, roles)
- `web/app/maestro/page.tsx`: dashboard específico para tutores con resumen de estudiantes y planetas
- Navegación pública a /about y /how-to-play en el header (siempre visible)
- Navegación a /maestro para usuarios con rol tutor

## [0.2.0] — 2026-06-20 (Fase 1)

### Añadido
- `shared/types.ts`: tipos compartidos
- `web/lib/auth-store.ts`: store Zustand con persistencia para autenticación y roles
- `web/components/Header.tsx`: header fijo con login/registro colapsable (Framer Motion)
- `web/app/admin/page.tsx`: panel Admin para asignación de roles a usuarios
- Hero section en landing page con explicación del juego y 3 planetas

### Modificado
- `web/app/layout.tsx`: integrado Header global con navegación por rol
- `web/app/page.tsx`: rediseñado como landing page con hero + preview de planetas
- `web/app/dashboard/page.tsx`: separado en vistas Student (progreso) y Tutor (pedagogía + estudiantes)
- Roles funcionales: admin→/admin, tutor→/dashboard (vista tutor), student→/dashboard (vista estudiante)
- Datos mock para planetas, cursos, niveles y progreso

## [0.1.0] — 2026-06-20 (Fase 0)

### Añadido
- Reestructuración del proyecto a monorepo: `web/`, `shared/`, `docs/`
- Dependencias: `clsx`, `tailwind-merge`, `zustand`, `framer-motion`
- JSDoc completo en todos los archivos del frontend
- README.md en raíz, `web/`, `web/app/`, `web/components/`, `shared/`, `docs/`
- `CHANGELOG.md` (este archivo)

### Modificado
- Migración de `app/` → `web/app/` y `public/` → `web/public/`
- Migración de configs raíz a `web/` (package.json, tsconfig, next.config, etc.)
- `globals.css`: limpiado para Tailwind v4 (solo `@import "tailwindcss"`)
- `page.tsx`: eliminadas importaciones rotas, rediseñado como landing page
- `FondoCosmico.tsx`: tipado TypeScript estricto, JSDoc completo, añadido `'use client'`
- `dashboard/page.tsx`: migrado a `.tsx`, tipado completo, JSDoc
- `Planeta.tsx`: migrado a `.tsx`, tipado completo con interfaz `PlanetaProps`, JSDoc
- `cn.ts`: JSDoc añadido

### Eliminado
- Archivos muertos y duplicados del frontend
