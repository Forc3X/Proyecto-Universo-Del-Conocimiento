# 📋 Changelog — Universo del Conocimiento

Todas las modificaciones significativas del proyecto se documentan aquí.

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

## [0.3.0] — 2026-06-20 (Fase 2-3)

### Añadido
- `server/`: backend Express 5 con MySQL, JWT auth, migraciones y seed
- 5 controladores (auth, admin, planets, tutor) con rutas y middlewares
- Tablas SQL: users, planets, courses, levels, student_progress, tutor_students, sessions
- Datos semilla con 3 planetas, cursos, niveles y usuarios de ejemplo (admin/tutor/student)
- Cards interactivas en dashboard con progreso por planeta y niveles

## [0.2.0] — 2026-06-20 (Fase 1)

### Añadido
- `shared/types.ts`: tipos compartidos (User, Planet, Course, Level, AuthResponse, etc.)
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
- Reestructuración del proyecto a monorepo: `web/`, `server/`, `shared/`, `docs/`
- Dependencias: `clsx`, `tailwind-merge`, `zustand`, `framer-motion`
- JSDoc completo en todos los archivos del frontend
- README.md en raíz, `web/`, `web/app/`, `web/components/`, `server/`, `shared/`, `docs/`
- `PLAN.json` con el plan de trabajo detallado para handoff entre IAs
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
