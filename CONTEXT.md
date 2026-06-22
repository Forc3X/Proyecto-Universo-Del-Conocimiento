# 🧠 Contexto del proyecto — Universo del Conocimiento

## Stack
- **Frontend**: `web/` — Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Zustand
- **Compartido**: `shared/types.ts` — interfaces compartidas

---

## Cambios realizados — 2026-06-21

- ✅ Renombrado Verbum → **Letralia** en frontend (page.tsx, about, dashboard, maestro)
- ✅ Textura mejorada de Planeta.tsx (anillos, bandas, elementos temáticos flotantes)
- ✅ Modal de explicación al hacer clic en "EXPLORAR" en un planeta
- ✅ Landing page con datos de cursos para el modal
- ✅ Documentación limpiada: sin backend, BD, ni roles funcionales

---

## Sesión anterior — 2026-06-20 (Optimización + Diseño + Bugfixes)

### 1. Optimización crítica de rendimiento
- `FondoCosmico.tsx`:
  - Estrellas: **320 → 80**
  - Eliminado `shadowBlur` por estrella
  - Nebulosas cacheadas en **canvas offscreen**
  - Pausa `requestAnimationFrame` cuando la pestaña está oculta
- `Planeta.tsx`: RAF reemplazado por `@keyframes` CSS nativos
- **Lazy loading**: `FondoCosmico` con `dynamic()` en todas las páginas

### 2. Hydration mismatch
- **Fix**: `suppressHydrationWarning` en `<html>` y `<body>`

### 3. Hydration race condition
- **Fix**: flag `_hydrated` en auth-store para proteger rutas

### 4. Diseño visual infantil
- Hero title con gradiente animado (`shimmer`)
- Planet cards en landing usando `Planeta.tsx`
- About y How-to-play rediseñados

---

## Archivos clave

| Archivo | Propósito |
|---------|-----------|
| `web/app/layout.tsx` | Layout raíz con Header |
| `web/app/page.tsx` | Landing page |
| `web/app/FondoCosmico.tsx` | Canvas de estrellas optimizado |
| `web/app/components/Planeta.tsx` | Planeta 3D con animaciones + modal |
| `web/components/Header.tsx` | Header con login/registro |
| `web/lib/auth-store.ts` | Store Zustand |
| `web/app/dashboard/page.tsx` | Dashboard con planetas |
| `web/app/admin/page.tsx` | Panel admin |
| `web/app/maestro/page.tsx` | Dashboard tutor |
| `web/app/about/page.tsx` | Información del proyecto |
| `web/app/how-to-play/page.tsx` | Reglas del juego |
| `shared/types.ts` | Tipos compartidos |
| `CHANGELOG.md` | Historial de cambios |
| `INSTRUCCIONES.md` | Cómo ejecutar |
