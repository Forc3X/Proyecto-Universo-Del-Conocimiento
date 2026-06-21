# 🧩 Componentes del frontend

Los componentes están en `web/components/` (raíz del frontend).

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `Header` | `Header.tsx` | Header fijo con logo, navegación por rol y login/registro colapsable |
| `Planeta` | `Planeta.tsx` | Esfera animada con gradiente, halo y botón Explorar |
| `FondoCosmico` | `app/FondoCosmico.tsx` | Canvas de estrellas/nebulosas a pantalla completa |

## Header (`Header.tsx`)

- Botón "Iniciar sesión" → despliega acordeón con tabs Login/Registro (Framer Motion)
- Usuarios autenticados ven nombre, rol y botón "Salir"
- Navegación cambia según rol (admin → Panel Admin, tutor → Mis Estudiantes + Dashboard, student → Dashboard)
- Links públicos: "Acerca de" (/about) y "Cómo jugar" (/how-to-play)

## Planeta (`Planeta.tsx`)

Props: `nombre`, `materia`, `descripcion`, `gradient`, `icon`, `progreso` (opcional). Usa el store de auth para determinar si mostrar progreso (student) o descripción pedagógica (tutor).
