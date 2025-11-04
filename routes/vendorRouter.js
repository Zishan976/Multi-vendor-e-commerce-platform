import express from 'express';
import { getVendorProfile, updateVendorProfile, vendorSignup } from '../controllers/vendorController.js';
import { authenticateVendor } from '../middleware/authVendorMiddleware.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getOrderedProductByIdOfVendor, getOrderedProductsOfVendor, UpdateOrderedProductStatus } from '../controllers/vendorOrderController.js';

const router = express.Router();

router.post('/signup', authenticateUser, vendorSignup);
router.get('/profile', authenticateVendor, getVendorProfile);
router.put('/profile', authenticateVendor, updateVendorProfile);

//Order management of vendor
router.use(authenticateVendor)
router.get('/orders', getOrderedProductsOfVendor);
router.get('/orders/:id', getOrderedProductByIdOfVendor);
router.put('/orders/:id/status', UpdateOrderedProductStatus);

export default router;
