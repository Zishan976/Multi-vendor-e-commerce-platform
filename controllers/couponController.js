import { pool } from "../config/db.js";

// Get all coupons
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await pool.query(`
            SELECT * FROM coupons
            ORDER BY created_at DESC
        `);

        res.json(coupons.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
};

// Create a new coupon
export const createCoupon = async (req, res) => {
    try {
        const { code, discount_type, discount_value, valid_from, valid_until, usage_limit } = req.body;

        // Validation
        if (!code || !discount_type || !discount_value) {
            return res.status(400).json({ error: 'Code, discount type, and discount value are required' });
        }

        if (!['percent', 'fixed'].includes(discount_type)) {
            return res.status(400).json({ error: 'Discount type must be either "percent" or "fixed"' });
        }

        const discountValueNum = parseFloat(discount_value);
        if (isNaN(discountValueNum) || discountValueNum <= 0) {
            return res.status(400).json({ error: 'Discount value must be a positive number' });
        }

        // Check if coupon code already exists
        const existingCoupon = await pool.query(
            'SELECT id FROM coupons WHERE UPPER(code) = UPPER($1)',
            [code.trim()]
        );

        if (existingCoupon.rows.length > 0) {
            return res.status(400).json({ error: 'Coupon code already exists' });
        }

        // Validate dates if provided
        if (valid_from && valid_until) {
            const fromDate = new Date(valid_from);
            const untilDate = new Date(valid_until);
            if (fromDate > untilDate) {
                return res.status(400).json({ error: 'Valid from date must be before valid until date' });
            }
        }

        const result = await pool.query(
            `INSERT INTO coupons (code, discount_type, discount_value, valid_from, valid_until, usage_limit)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                code.trim().toUpperCase(),
                discount_type,
                discountValueNum,
                valid_from || null,
                valid_until || null,
                usage_limit ? parseInt(usage_limit) : null
            ]
        );

        res.status(201).json({
            message: 'Coupon created successfully',
            coupon: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create coupon' });
    }
};

// Delete a coupon
export const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;

        const result = await pool.query(
            'DELETE FROM coupons WHERE id = $1 RETURNING *',
            [couponId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete coupon' });
    }
};

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
