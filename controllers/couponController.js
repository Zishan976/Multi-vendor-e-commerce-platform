import { pool } from "../config/db.js";

/**
 * POST /api/coupons/apply
 * Body: { code: string, subtotal: number }
 * Returns: { discountAmount: number, discountPercent?: number, message: string }
 */
export const applyCoupon = async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        const subtotalNum = parseFloat(subtotal);

        if (!code || typeof code !== "string" || !code.trim()) {
            return res.status(400).json({ error: "Coupon code is required" });
        }
        if (subtotalNum == null || isNaN(subtotalNum) || subtotalNum < 0) {
            return res.status(400).json({ error: "Valid subtotal is required" });
        }

        const result = await pool.query(
            `SELECT id, code, discount_type, discount_value, valid_from, valid_until, usage_limit, used_count
             FROM coupons
             WHERE UPPER(TRIM(code)) = UPPER(TRIM($1))`,
            [code.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Invalid coupon code" });
        }

        const coupon = result.rows[0];
        const now = new Date();

        if (coupon.valid_from && new Date(coupon.valid_from) > now) {
            return res.status(400).json({ error: "This coupon is not yet valid" });
        }
        if (coupon.valid_until && new Date(coupon.valid_until) < now) {
            return res.status(400).json({ error: "This coupon has expired" });
        }
        if (coupon.usage_limit != null && (coupon.used_count || 0) >= coupon.usage_limit) {
            return res.status(400).json({ error: "This coupon has reached its usage limit" });
        }

        let discountAmount = 0;
        if (coupon.discount_type === "percent") {
            const value = parseFloat(coupon.discount_value);
            discountAmount = (subtotalNum * value) / 100;
        } else {
            discountAmount = Math.min(parseFloat(coupon.discount_value), subtotalNum);
        }
        discountAmount = Math.round(discountAmount * 100) / 100;

        const discountPercent = coupon.discount_type === "percent" ? parseFloat(coupon.discount_value) : undefined;

        res.json({
            discountAmount,
            discountPercent,
            message: coupon.discount_type === "percent"
                ? `${coupon.discount_value}% off applied`
                : `$${discountAmount.toFixed(2)} discount applied`,
        });
    } catch (error) {
        console.error("Apply coupon error:", error);
        res.status(500).json({ error: "Failed to apply coupon" });
    }
};
