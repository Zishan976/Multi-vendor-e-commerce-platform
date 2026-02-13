import { pool } from "../config/db.js";
import jwt from 'jsonwebtoken'

export const vendorSignup = async (req, res) => {
    const { id: user_id } = req.user;
    const { business_name, business_description } = req.body;
    try {
        const checkUser = await pool.query('SELECT role FROM users WHERE id = $1', [user_id]);
        if (!checkUser.rows.length) { return res.status(404).json({ error: 'User not found' }) }

        const existingVendor = await pool.query('SELECT id FROM vendors WHERE user_id = $1', [user_id])
        if (existingVendor.rows.length > 0) { return res.status(400).json({ error: 'Vendor profile already exists' }) };

        if (!business_name || !business_description) { return res.status(400).json({ error: 'Business name and Description is needed' }) }


        await pool.query('INSERT INTO vendors (user_id, business_name, business_description) VALUES ($1, $2, $3)', [user_id, business_name, business_description])

        // Don't update role to 'vendor' immediately - keep as 'user'
        // Role will be updated to 'vendor' only when admin approves

        const token = jwt.sign({ id: user_id, role: 'user' }, process.env.JWT_SECRET);

        res.json({ token, message: 'Vendor application submitted successfully. Account pending approval.' });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'vendor signup failed' })
    }

}

export const getVendorProfile = async (req, res) => {
    const { id: user_id, role } = req.user;
    if (role !== 'vendor') {
        return res.status(403).json({ error: 'Access denied. Vendor role required' });
    }
    try {

        const fetchProfile = await pool.query('SELECT vendors.*, users.username, users.email FROM vendors JOIN users ON vendors.user_id = users.id WHERE vendors.user_id = $1', [user_id])

        if (!fetchProfile.rows.length) { return res.status(404).json({ error: 'Vendor not found' }) }

        const profile = fetchProfile.rows[0];
        if (profile.status === 'pending') {
            return res.status(403).json({ error: 'Vendor account is pending approval' });
        } else if (profile.status === 'rejected') {
            return res.status(403).json({ error: 'Vendor account has been rejected' });
        }

        // Only approved vendors can access profile
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vendor profile' });
    }
}


export const updateVendorProfile = async (req, res) => {
    const { id: user_id, role } = req.user;
    if (role !== 'vendor') {
        return res.status(403).json({ error: 'Access denied. Vendor role required' });
    }
    const { business_name, business_description } = req.body;
    try {
        const findVendor = await pool.query('SELECT * FROM vendors WHERE user_id = $1', [user_id]);
        if (!findVendor.rows.length) { return res.status(404).json({ error: 'Vendor not found' }) }

        const profile = findVendor.rows[0];

        if (profile.status === 'pending') {
            return res.status(403).json({ error: 'Vendor account is pending approval' });
        } else if (profile.status === 'rejected') {
            return res.status(403).json({ error: 'Vendor account has been rejected' });
        }

        if (!business_name || business_name.trim() === '') { return res.status(400).json({ error: 'Business name is needed' }) }
        if (!business_description || business_description.trim() === '') { return res.status(400).json({ error: 'Business description is needed' }) }

        const updateVendor = await pool.query('UPDATE vendors SET business_description = $1, business_name = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 RETURNING *', [business_description.trim(), business_name.trim(), user_id]);

        res.json(updateVendor.rows[0])
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update vendor profile' });
    }
}

export const getVenderStatus = async (req, res) => {
    const { id: user_id, role } = req.user;
    if (role !== 'vendor') {
        return res.status(403).json({ error: 'Access denied. Vendor role required' });
    }
    try {
        // Fetch vendor details
        const vendorQuery = await pool.query('SELECT id, status FROM vendors WHERE user_id = $1', [user_id]);
        if (!vendorQuery.rows.length) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        const vendor = vendorQuery.rows[0];
        if (vendor.status !== 'approved') {
            return res.status(403).json({ error: 'Vendor account not approved' });
        }
        const vendor_id = vendor.id;

        // Total products
        const totalProductsQuery = await pool.query('SELECT COUNT(*) as total FROM products WHERE vendor_id = $1', [vendor_id]);
        const totalProducts = parseInt(totalProductsQuery.rows[0].total);

        // Total orders (distinct orders containing vendor's products)
        const totalOrdersQuery = await pool.query(`
            SELECT COUNT(DISTINCT o.id) as total
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE p.vendor_id = $1
        `, [vendor_id]);
        const totalOrders = parseInt(totalOrdersQuery.rows[0].total);

        // Total revenue (sum of quantity * price for non-cancelled orders)
        const totalRevenueQuery = await pool.query(`
            SELECT COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE p.vendor_id = $1 AND o.status != 'cancelled'
        `, [vendor_id]);
        const totalRevenue = parseFloat(totalRevenueQuery.rows[0].revenue);

        // Pending orders (distinct pending orders containing vendor's products)
        const pendingOrdersQuery = await pool.query(`
            SELECT COUNT(DISTINCT o.id) as pending
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE p.vendor_id = $1 AND o.status = 'pending'
        `, [vendor_id]);
        const pendingOrders = parseInt(pendingOrdersQuery.rows[0].pending);

        res.json({ totalProducts, totalOrders, totalRevenue, pendingOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vendor status' });
    }
}

export const getVendorProfileById = async (req, res) => {
    const { vendorId } = req.params;
    try {
        const fetchProfile = await pool.query('SELECT id, business_name, business_description FROM vendors WHERE id = $1 AND status = $2', [vendorId, 'approved']);

        if (!fetchProfile.rows.length) { return res.status(404).json({ error: 'Vendor not found' }) }

        res.json(fetchProfile.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vendor profile' });
    }
}
