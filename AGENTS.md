<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Contexto para asistentes IA

## Proyecto
Universo del Conocimiento — plataforma educativa gamificada para niños 10-12 años.

## Stack
- Frontend: web/ (Next.js 16, React 19, Tailwind v4, Framer Motion, Zustand)
- Compartido: shared/types.ts

## Estado actual (2026-06-21)
- ✅ Frontend standalone con datos mock
- ✅ Roles: admin, tutor, student, pending
- ✅ Planetas renombrados: Verbum → Letralia
- ✅ Planeta.tsx con textura mejorada + modal de explicación

## Reglas importantes
1. Leer AGENTS.md y CONTEXT.md antes de cualquier cambio
2. Leer INSTRUCCIONES.md para entender la configuración del proyecto
3. No añadir librerías externas sin consultar
4. Tailwind CSS v4 (NO tailwind.config.js, solo @import "tailwindcss")
