import { Router } from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { UserRole } from '../models/User';

const router = Router();

// Only ADMIN can access these routes
router.use(authMiddleware, roleMiddleware(UserRole.ADMIN));

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

export default router;