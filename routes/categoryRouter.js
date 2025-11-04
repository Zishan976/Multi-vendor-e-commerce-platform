import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/categoryController.js';
import { authenticateAdmin } from '../middleware/authAdminMiddleware.js';
const router = express.Router();


router.get('/', getAllCategories);

router.get('/:id', getCategoryById);

router.post('/', authenticateAdmin, createCategory);

router.put('/:id', authenticateAdmin, updateCategory);

router.delete('/:id', authenticateAdmin, deleteCategory);

export default router;