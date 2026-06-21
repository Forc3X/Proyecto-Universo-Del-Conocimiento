# Instrucciones para descargar y ejecutar el proyecto

## Requisitos
- Node.js 20 o superior
- npm (viene con Node.js)

## Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Forc3X/Proyecto-Universo-Del-Conocimiento.git
cd Proyecto-Universo-Del-Conocimiento

# 2. Instalar dependencias del frontend
cd web
npm install
cd ..

# 3. Instalar dependencias del backend
cd server
npm install
cd ..

# 4. Iniciar el frontend en desarrollo
cd web
npm run dev
```

El frontend se abre en `http://localhost:3000`.

> ⚠️ **Nota**: El backend (Express + MySQL) aún no está conectado. Algunas funcionalidades como admin y dashboard usan datos de prueba locales. Para iniciar el backend más adelante:
> ```bash
> cd server
> npm run dev
> ```
