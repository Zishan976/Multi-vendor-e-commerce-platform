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


        await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['vendor', user_id]);

        const token = jwt.sign({ id: user_id, role: 'vendor' }, process.env.JWT_SECRET);

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
