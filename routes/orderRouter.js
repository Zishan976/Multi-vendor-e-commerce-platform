import express from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { createOrder, getOrderById, getUserOrder } from '../controllers/orderController.js';

const router = express.Router();

// Rate limiting for order creation - 10 orders per 15 minutes per IP
const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 order requests per windowMs
    message: { error: 'Too many order requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.use(authenticateUser);

router.post('/', orderLimiter, createOrder);
router.get('/', getUserOrder);
router.get('/:id', getOrderById);

export default router;
