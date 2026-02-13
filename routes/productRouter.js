import express from 'express';
import { authenticateVendor } from '../middleware/authVendorMiddleware.js';
import { addVendorProducts, deleteVendorProducts, getAllProducts, getProductsByCategory, getProductById, getVendorProduct, getVendorProducts, updateVendorProducts, getLatestProducts, getBestProducts, getProductsByVendor } from '../controllers/productController.js';
import { uploadProductImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/public', getAllProducts);
router.get('/public/latest', getLatestProducts)
router.get('/public/best', getBestProducts)
router.get('/public/:id', getProductById);
router.get('/public/categories/:categoryId', getProductsByCategory);
router.get('/public/vendor/:vendorId', getProductsByVendor);

// Vendor authentication required for all routes below
router.use(authenticateVendor);

router.get('/vendor', getVendorProducts);

router.get('/vendor/:productId', getVendorProduct);

router.post('/vendor', uploadProductImage, addVendorProducts);

router.put('/vendor/:productId', uploadProductImage, updateVendorProducts);

router.delete('/vendor/:productId', deleteVendorProducts);

export default router;

