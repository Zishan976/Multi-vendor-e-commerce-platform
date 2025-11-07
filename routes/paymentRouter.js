import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getPaymentStatus, initiatePayment, processPayment } from '../controllers/paymentController.js';

const router = express.Router();
router.use(authenticateUser);

router.post('/initiate', initiatePayment);
router.get('/process/:orderId', processPayment);
router.get('/status/:orderId', getPaymentStatus);

export default router;
