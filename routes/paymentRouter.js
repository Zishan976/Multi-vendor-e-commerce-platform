import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getPaymentStatus, initiatePayment, processPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Public endpoint - no auth required for payment processing
// Auth is handled via query params or the order belongs to the user
router.get('/process/:orderId', processPayment);

// Protected endpoints
router.use(authenticateUser);

router.post('/initiate', initiatePayment);
router.get('/status/:orderId', getPaymentStatus);

export default router;
