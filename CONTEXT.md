# 🧠 Contexto del proyecto — Universo del Conocimiento

## Stack
- **Frontend**: `web/` — Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Zustand
- **Backend**: `server/` — Express 5 + TypeScript + MySQL (mysql2 + JWT) — **no conectado aún**
- **Compartido**: `shared/types.ts` — interfaces `User`, `Planet`, `Course`, `Level`, `AuthResponse`, etc.

---

## Sesión 1 — 2026-06-20 (Optimización + Diseño + Bugfixes)

### 1. Optimización crítica de rendimiento
- `FondoCosmico.tsx`:
  - Estrellas: **320 → 80** (sigue viéndose igual, el ojo no nota la diferencia)
  - Eliminado `shadowBlur` por estrella (era el **killer de GPU** que colapsaba el navegador)
  - Nebulosas cacheadas en **canvas offscreen** (se renderizan 1 vez, no 60 fps)
  - Pausa `requestAnimationFrame` cuando la pestaña está oculta (`visibilitychange`)
- `Planeta.tsx`: RAF reemplazado por `@keyframes` CSS nativos (corren en GPU, no en JS)
- `next.config.ts`: imágenes AVIF/WebP, removidos console.log en prod
- **Lazy loading**: `FondoCosmico` con `dynamic(() => import(...), { ssr: false })` en todas las páginas

### 2. Hydration mismatch
- **Causa**: extensiones del navegador (Grammarly, antivirus) inyectan atributos en `<body>`/`<html>`
- **Fix**: `suppressHydrationWarning` en `<html>` y `<body>` en `layout.tsx`

### 3. Hydration race condition (admin/dashboard no funcionaban)
- **Causa**: Zustand tarda ~1-10ms en leer `localStorage`. Durante ese tiempo `user = null`, y las páginas protegidas redirigían a `/` inmediatamente.
- **Fix**: Añadido flag `_hydrated` al store que se activa tras la hidratación. Admin, dashboard y maestro ahora esperan a que `_hydrated = true` antes de decidir la redirección.
- Archivos: `auth-store.ts`, `admin/page.tsx`, `dashboard/page.tsx`, `maestro/page.tsx`

### 4. Diseño visual infantil
- **Hero title**: gradiente animado (`shimmer`), más pequeño (`text-7xl`), doble glow. Subido más arriba (`pt-16` en vez de centrado vertical)
- **Landing**: planet cards ahora usan `<Planeta>` (esfera 3D con halo, flotación, anillo pulsante)
- **About**: fondo cósmico, cards con float animation, colores vibrantes por planeta
- **How-to-play**: tarjetas con iconos animados, gradientes de color por regla, flujo visual numerado
- **Eliminado**: regla "Stardust" que mencionaba tienda (al usuario no le gustó)

### 5. Documentación
- `CONTEXT.md`: este archivo
- `PLAN.json`: actualizado con Fase 5 (optimización y diseño) y Fase 6 (pendiente: backend real)
- `CHANGELOG.md`: actualizado con v0.5.0

---

## Pendientes para la próxima sesión

### Crítico
- **Conectar backend real**: admin y dashboard con tutor no funcionan porque usan datos mock de Zustand. Al recargar la página se pierde la sesión. Hay que iniciar `server/` (Express + MySQL) y reemplazar `auth-store.ts` para que llame a las APIs reales.
  - Puerto del backend: ver `.env` en `server/`
  - Endpoints: `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/admin/users`, etc.

### Visual / UX
- Avatar/foto de perfil en el Header
- Responsive mobile (canvas, cards)
- Animaciones de transición entre páginas

### Features futuras (Fase 6+)
- Tablero de juego con dado 3D
- Preguntas con IA (Ollama + Gemma)
- Gráficas Recharts para dashboards de tutor
- Efectos de sonido

---

## Archivos clave

| Archivo | Propósito |
|---------|-----------|
| `web/app/layout.tsx` | Layout raíz con Header global |
| `web/app/page.tsx` | Landing page con hero animado + planetas 3D |
| `web/app/FondoCosmico.tsx` | Canvas optimizado (80 estrellas, nebulosas cacheadas) |
| `web/app/components/Planeta.tsx` | Componente planeta 3D con animaciones CSS |
| `web/components/Header.tsx` | Header con login/registro colapsable |
| `web/lib/auth-store.ts` | Store Zustand con persistencia + flag `_hydrated` |
| `web/app/dashboard/page.tsx` | Dashboard con vistas Student/Tutor (protegido) |
| `web/app/admin/page.tsx` | Panel admin para asignación de roles (protegido) |
| `web/app/maestro/page.tsx` | Dashboard tutor (protegido) |
| `web/app/about/page.tsx` | Página informativa con diseño infantil |
| `web/app/how-to-play/page.tsx` | Reglas del juego con diseño infantil |
| `shared/types.ts` | Tipos compartidos frontend/backend |
| `server/src/` | Backend Express (no conectado aún) |
| `PLAN.json` | Plan de trabajo actualizado |
| `CONTEXT.md` | Este archivo — contexto para handoff |
