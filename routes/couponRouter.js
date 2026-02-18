import express from "express";
import { applyCoupon } from "../controllers/couponController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);
router.post("/apply", applyCoupon);

export default router;
