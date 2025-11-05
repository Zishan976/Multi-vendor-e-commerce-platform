import express from 'express';
import { authenticateAdmin } from '../middleware/authAdminMiddleware.js';
import { approveVendor, getAllUsers, getPendingVendors, rejectVendor, updateUserRole } from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/vendors/pending', getPendingVendors);
router.put('/vendors/:vendorId/approve', approveVendor);
router.put('/vendors/:vendorId/reject', rejectVendor);
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);

export default router;