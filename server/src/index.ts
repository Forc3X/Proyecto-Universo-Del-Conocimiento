/**
 * Punto de entrada del servidor Express.
 *
 * Configura middleware global, monta las rutas y
 * levanta el servidor en el puerto configurado.
 *
 * @example
 * npm run dev    # → http://localhost:4001
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import planetsRoutes from './routes/planets.routes.js';
import tutorRoutes from './routes/tutor.routes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4001;

/* ───────── Middleware global ───────── */
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());

/* ───────── Rutas ───────── */
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/planets', planetsRoutes);
app.use('/api/tutor', tutorRoutes);

/* ───────── Health check ───────── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ───────── Inicio ───────── */
app.listen(PORT, () => {
  console.log(`🌌 Servidor iniciado en http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});
