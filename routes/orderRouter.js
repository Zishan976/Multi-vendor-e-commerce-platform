import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { createOrder, getOrderById, getUserOrder } from '../controllers/orderController.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', createOrder);
router.get('/', getUserOrder);
router.get('/:id', getOrderById);

export default router;