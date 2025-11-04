import express from 'express';
import { authenticateVendor } from '../middleware/authVendorMiddleware.js';
import { addVendorProducts, deleteVendorProducts, getAllProducts, getProductsByCategory, getProductById, getVendorProduct, getVendorProducts, updateVendorProducts } from '../controllers/productController.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/public/products', getAllProducts);
router.get('/public/products/:id', getProductById);
router.get('/public/categories/:categoryId/products', getProductsByCategory);

// Vendor authentication required for all routes below
router.use(authenticateVendor);

router.get('/products', getVendorProducts);

router.get('/product/:productId', getVendorProduct);

router.post('/products', addVendorProducts);

router.put('/product/:productId', updateVendorProducts);

router.delete('/product/:productId', deleteVendorProducts);

export default router;

