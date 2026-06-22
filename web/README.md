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
│   ├── admin/page.tsx       # Panel de administración
│   ├── dashboard/page.tsx   # Dashboard con planetas
│   └── maestro/page.tsx     # Dashboard para tutores
├── components/
│   ├── Header.tsx           # Header fijo con login y navegación
│   └── Planeta.tsx          # Componente de planeta reutilizable
├── lib/
│   └── auth-store.ts        # Zustand store
├── public/                  # Assets estáticos
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

## 🔧 Scripts

```bash
npm run dev     # http://localhost:3000
npm run build   # Producción
npm run start   # Servir producción
npm run lint    # ESLint
```

## 🧩 Convenciones de código

- **JSDoc** en todos los componentes y funciones
- **Tipado estricto** con TypeScript
- **Tailwind v4**: no uses `tailwind.config.js`; configura vía CSS con `@import "tailwindcss"`
- **Framer Motion** para animaciones
