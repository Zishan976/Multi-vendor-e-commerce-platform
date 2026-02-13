import express from 'express';
import { getVendorProfile, updateVendorProfile, vendorSignup, getVenderStatus, getVendorProfileById } from '../controllers/vendorController.js';
import { authenticateVendor } from '../middleware/authVendorMiddleware.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getOrderedProductByIdOfVendor, getOrderedProductsOfVendor, UpdateOrderedProductStatus } from '../controllers/vendorOrderController.js';

const router = express.Router();

router.post('/signup', authenticateUser, vendorSignup);
router.get('/profile', authenticateVendor, getVendorProfile);
router.get('/profile/:vendorId', getVendorProfileById);
router.put('/profile', authenticateVendor, updateVendorProfile);
router.get('/status', authenticateVendor, getVenderStatus);

//Order management of vendor
router.use(authenticateVendor)
router.get('/orders', getOrderedProductsOfVendor);
router.get('/orders/:id', getOrderedProductByIdOfVendor);
router.put('/orders/:id/status', UpdateOrderedProductStatus);

export default router;
