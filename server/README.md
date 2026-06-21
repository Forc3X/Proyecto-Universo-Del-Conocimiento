# 🖥️ Backend — Express 5 + MySQL

API REST del Universo del Conocimiento. Usa Express 5, MySQL con mysql2/promise, JWT para autenticación y bcrypt para hash de contraseñas.

## 📁 Estructura

```
server/
├── src/
│   ├── index.ts                # Punto de entrada (cors, rutas, listen :4001)
│   ├── db/
│   │   ├── connection.ts       # Pool MySQL con mysql2/promise
│   │   ├── migrate.ts          # Creación de tablas
│   │   └── seed.ts             # Datos de ejemplo (admin, tutor, student, planetas)
│   ├── middleware/
│   │   ├── auth.ts             # JWT verification middleware
│   │   └── role.ts             # Role check middleware
│   ├── controllers/
│   │   ├── auth.controller.ts  # register (bcrypt hash), login (JWT), getMe
│   │   ├── admin.controller.ts # getUsers (pending), assignRole
│   │   ├── planets.controller.ts # getPlanets (+ progreso si student), getPlanetById
│   │   └── tutor.controller.ts # getMyStudents
│   └── routes/
│       ├── auth.routes.ts      # /api/auth/*
│       ├── admin.routes.ts     # /api/admin/*
│       ├── planets.routes.ts   # /api/planets/*
│       └── tutor.routes.ts     # /api/tutor/*
├── .env                        # DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET
├── package.json
└── tsconfig.json
```

## 🔌 Endpoints

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| POST | `/api/auth/register` | — | — | Registro (name, email, username, password) |
| POST | `/api/auth/login` | — | — | Login (username, password) → JWT |
| GET | `/api/auth/me` | JWT | — | Datos del usuario autenticado |
| GET | `/api/admin/users` | JWT | admin | Todos los usuarios (filtro por status opcional) |
| POST | `/api/admin/assign-role` | JWT | admin | Asignar rol a usuario (userId, role) |
| GET | `/api/planets` | JWT | — | Planetas con cursos y niveles; si es student incluye progreso |
| GET | `/api/planets/:id` | JWT | — | Detalle de un planeta |
| GET | `/api/tutor/students` | JWT | tutor | Estudiantes asignados al tutor |

## 🧠 Middleware

### `auth.ts`
Extrae y verifica JWT del header `Authorization: Bearer <token>`. Adjunta `req.user` con `{ id, role }`.

### `role.ts`
Factory que recibe un rol y retorna middleware. Ej: `checkRole('admin')` → solo admin pasan.

## 🗄️ Base de datos

7 tablas: `users`, `planets`, `courses`, `levels`, `student_progress`, `tutor_students`, `sessions`.

Seed incluye:
- Admin: admin/admin123
- Tutor: maria/tutor123
- Student: carlos/estudiante123
- 3 planetas (Numérix, Verbum, Naturae) con cursos y niveles

## 🏃 Scripts

```bash
npm run dev     # nodemon + tsx → http://localhost:4001
npm run build   # tsc → dist/
npm start       # node dist/index.js
npm run migrate # Ejecuta migrate.ts
npm run seed    # Ejecuta seed.ts
```
