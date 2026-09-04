import { Router } from 'express';
import * as produceController from '../controllers/produceController';
import { validate } from '../middleware/validationMiddleware';
import { createProduceSchema, updateProduceSchema } from '../validators/produceValidators';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { UserRole } from '../models/User';
import { upload } from '../config/cloudinary';

const router = Router();

// Public / Marketplace routes
router.get('/', produceController.getProduceListings);
router.get('/:id', produceController.getProduceById);

// Protected routes
router.use(authMiddleware);

// Farmer only routes
router.use(roleMiddleware(UserRole.FARMER));
router.post('/', upload.single('image'), validate(createProduceSchema), produceController.createProduce);
router.get('/my/listings', produceController.getFarmerListings);
router.put('/:id', upload.single('image'), validate(updateProduceSchema), produceController.updateProduce);
router.delete('/:id', produceController.deleteProduce);
router.patch('/:id/sold', produceController.markProduceSold);

export default router;