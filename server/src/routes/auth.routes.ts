/**
 * Rutas de autenticación.
 * POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
 */
import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

export default router;
