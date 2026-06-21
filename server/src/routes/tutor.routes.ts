/**
 * Rutas del tutor.
 * Protegidas por auth + rol tutor.
 * GET /api/tutor/students
 */
import { Router } from 'express';
import { getMyStudents } from '../controllers/tutor.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = Router();

router.get('/students', authMiddleware, roleMiddleware('tutor'), getMyStudents);

export default router;
