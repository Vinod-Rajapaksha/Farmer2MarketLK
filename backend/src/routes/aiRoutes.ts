import { Router } from 'express';
import { getRecommendations } from '../controllers/aiController';
import { validate } from '../middleware/validationMiddleware';
import { recommendSchema } from '../validators/aiValidators';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { UserRole } from '../models/User';

const router = Router();

// Only BUYERs can access AI recommendations
router.post(
  '/recommend',
  authMiddleware,
  roleMiddleware(UserRole.BUYER),
  validate(recommendSchema),
  getRecommendations
);

export default router;
