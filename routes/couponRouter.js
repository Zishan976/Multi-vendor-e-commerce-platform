import express from "express";
import { applyCoupon, getAllCoupons, createCoupon, deleteCoupon } from "../controllers/couponController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authenticateAdmin } from "../middleware/authAdminMiddleware.js";

const router = express.Router();

// User routes - apply coupon during checkout
router.use(authenticateUser);
router.post("/apply", applyCoupon);

// Admin routes - coupon management
router.get("/", authenticateAdmin, getAllCoupons);
router.post("/", authenticateAdmin, createCoupon);
router.delete("/:couponId", authenticateAdmin, deleteCoupon);

export default router;
