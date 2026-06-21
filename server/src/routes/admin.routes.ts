/**
 * Rutas de administración.
 * Protegidas por auth + rol admin.
 * GET /api/admin/users, POST /api/admin/assign-role
 */
import { Router } from 'express';
import { getUsers, assignRole } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = Router();

router.get('/users', authMiddleware, roleMiddleware('admin'), getUsers);
router.post('/assign-role', authMiddleware, roleMiddleware('admin'), assignRole);

export default router;
