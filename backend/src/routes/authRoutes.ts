import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { validate } from '../middleware/validationMiddleware';
import { registerSchema, loginSchema } from '../validators/authValidators';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, getMe);

export default router;