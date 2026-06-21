# 🌐 Frontend — Universo del Conocimiento

Frontend construido con **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion**.

## 📁 Estructura actual

```
web/
├── app/
│   ├── layout.tsx           # Layout raíz (header global + fondo)
│   ├── page.tsx             # Landing page con hero + 3 planetas
│   ├── FondoCosmico.tsx     # Canvas de estrellas animado
│   ├── globals.css          # Tailwind v4 (@import "tailwindcss")
│   ├── about/page.tsx       # Información del proyecto
│   ├── how-to-play/page.tsx # Reglas del juego
│   ├── admin/page.tsx       # Panel de administración (rol admin)
│   ├── dashboard/page.tsx   # Dashboard según rol (student/tutor)
│   └── maestro/page.tsx     # Dashboard específico para tutores
├── components/
│   ├── Header.tsx           # Header fijo con login colapsable y navegación
│   └── Planeta.tsx          # Componente de planeta reutilizable
├── lib/
│   └── auth-store.ts        # Zustand store: auth, roles, persistencia
├── public/                  # Assets estáticos
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

## 🧠 Sistema de autenticación y roles

El store `lib/auth-store.ts` usa Zustand con persistencia en localStorage.

### Roles
| Rol | Ruta principal | Descripción |
|-----|---------------|-------------|
| `admin` | `/admin` | Asigna roles a usuarios registrados |
| `tutor` | `/dashboard`, `/maestro` | Ve progreso de estudiantes y detalle pedagógico |
| `student` | `/dashboard` | Ve su progreso y niveles por planeta |
| `pending` | — | Usuario registrado sin rol asignado |

### Flujo
1. Usuario se registra → queda `pending`
2. Admin asigna rol en `/admin`
3. Usuario inicia sesión → redirige según `getRedirect()`
4. Header muestra navegación según `user.role`

### Datos mock
Mientras el backend no esté conectado, los datos de planetas, cursos, niveles y progreso son inline en el dashboard. Al migrar al backend real, se reemplazan por llamadas fetch a `http://localhost:4001/api/*`.

## 🔧 Scripts

```bash
npm run dev     # http://localhost:3000
npm run build   # Producción (verificar antes de commit)
npm run start   # Servir producción
npm run lint    # ESLint
```

## 🧩 Convenciones de código

- **JSDoc** en todos los componentes y funciones
- **Tipado estricto** con TypeScript
- **Tailwind v4**: no uses `tailwind.config.js`; configura vía CSS con `@import "tailwindcss"`
- **Framer Motion** para animaciones (AnimatePresence, motion.div)
- **Rutas protegidas**: cada página roleada verifica `user.role` en un `useEffect` con `router.push`
