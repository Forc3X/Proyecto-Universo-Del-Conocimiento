/**
 * Rutas de planetas.
 * GET /api/planets, GET /api/planets/:id
 * Requieren autenticación.
 */
import { Router } from 'express';
import { getPlanets, getPlanetById } from '../controllers/planets.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, getPlanets);
router.get('/:id', authMiddleware, getPlanetById);

export default router;
