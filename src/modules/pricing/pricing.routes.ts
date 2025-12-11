import { Router } from 'express';
import * as pricingController from './pricing.controller.js';
import { authenticateToken } from '../../common/middlewares/authMiddleware.js';
import { validate } from '../../common/middlewares/validate.js';
import { createPricingSchema, updatePricingSchema } from './pricing.schema.js';

const router = Router();

// Protected routes
router.use(authenticateToken);

router.post('/', validate(createPricingSchema), pricingController.createPricing);
router.get('/post/:postId', pricingController.getPostPricing);
router.patch('/:id', validate(updatePricingSchema), pricingController.updatePricing);

export default router;
