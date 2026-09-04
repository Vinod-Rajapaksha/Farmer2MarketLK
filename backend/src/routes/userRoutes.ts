import { Router } from 'express';
import { getAllUsers, deleteUser, getProfile, updateProfile } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { UserRole } from '../models/User';

const router = Router();

// Profile routes (Any authenticated user)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Admin only routes
router.use(authMiddleware, roleMiddleware(UserRole.ADMIN));

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

export default router;