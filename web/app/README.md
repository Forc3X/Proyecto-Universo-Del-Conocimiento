# 📄 Páginas del frontend

| Ruta | Archivo | Rol | Descripción |
|------|---------|-----|-------------|
| `/` | `page.tsx` | Todos | Landing page con hero + preview de 3 planetas |
| `/about` | `about/page.tsx` | Todos | Información del proyecto, stack y créditos |
| `/how-to-play` | `how-to-play/page.tsx` | Todos | Reglas del juego explicadas |
| `/admin` | `admin/page.tsx` | Admin | Lista de usuarios pendientes y asignación de roles |
| `/dashboard` | `dashboard/page.tsx` | Student, Tutor | Vista según rol: progreso (student) o pedagogía (tutor) |
| `/maestro` | `maestro/page.tsx` | Tutor | Dashboard con resumen de estudiantes y planetas |

## 🛡️ Protección de rutas

Cada página verifica el rol en un `useEffect`:

```ts
useEffect(() => {
  if (!user) router.push('/');
  else if (user.role !== 'tutor') router.push('/dashboard');
}, [user, router]);
```

El header (`components/Header.tsx`) maneja login, registro y navegación global.
