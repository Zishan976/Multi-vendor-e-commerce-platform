import { pool } from "../config/db.js";
import { sendVendorApprovalEmail, sendVendorRejectionEmail } from "../utils/notificationService.js";

export const getPendingVendors = async (req, res) => {
    try {

        const fetchPendingVendor = await pool.query(`
            SELECT v.*, u.username, u.email 
            FROM vendors v
            JOIN users u ON v.user_id = u.id
            WHERE status = 'pending'
            ORDER BY v.created_at DESC
        `);

        res.json(fetchPendingVendor.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch pending vendors' })
    }
};

export const approveVendor = async (req, res) => {
    const client = await pool.connect();
    try {
        const { vendorId } = req.params;

        const checkVendor = await client.query(
            `SELECT v.user_id, v.status, u.role, u.email FROM vendors v
             JOIN users u ON v.user_id = u.id
             WHERE v.id = $1`,
            [vendorId]
        );

        if (!checkVendor.rows.length) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const vendorData = checkVendor.rows[0];

        // Check if already approved
        if (vendorData.status === 'approved') {
            return res.status(400).json({ error: 'Vendor is already approved' });
        }

        await client.query('BEGIN');

        // Update user role to vendor if not already
        if (vendorData.role !== 'vendor') {
            await client.query(
                `UPDATE users SET role = 'vendor', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
                [vendorData.user_id]
            );
        }

        // Update vendor status to approved
        const updatedVendor = await client.query(
            `UPDATE vendors SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
            [vendorId]
        );

        await client.query('COMMIT');

        // Send approval email
        try {
            const vendorDetails = updatedVendor.rows[0];
            const userEmail = vendorData.email;
            await sendVendorApprovalEmail(userEmail, vendorDetails);
        } catch (emailError) {
            console.error('Failed to send vendor approval email:', emailError);
            // Don't fail the approval if email fails
        }

        res.json({ message: 'Vendor approved successfully', vendor: updatedVendor.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Failed to approve vendor' });
    } finally {
        client.release();
    }
};


export const rejectVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const result = await pool.query(
            `UPDATE vendors SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *, (SELECT email FROM users WHERE id = user_id) as email`,
            [vendorId]
        );

        if (!result.rows.length) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // Send rejection email
        try {
            const vendorDetails = result.rows[0];
            const userEmail = vendorDetails.email;
            await sendVendorRejectionEmail(userEmail, 'Application did not meet our requirements.');
        } catch (emailError) {
            console.error('Failed to send vendor rejection email:', emailError);
            // Don't fail the rejection if email fails
        }

        res.json({ message: 'Vendor rejected successfully', vendor: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reject vendor' });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await pool.query(`
            SELECT id, username, email, role, created_at
            FROM users
            ORDER BY created_at DESC
        `);

        res.json(users.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'vendor', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' })
        };

        const result = await pool.query('UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, email, role, created_at, updated_at', [role, userId])

        if (result.rows.length === 0) { return res.status(404).json({ error: 'User not found' }) };

        res.json({ message: 'User role updated successfully', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the user role' });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        // Get total users
        const totalUsersResult = await pool.query('SELECT COUNT(*) as count FROM users');
        const totalUsers = parseInt(totalUsersResult.rows[0].count);

        // Get pending vendors count
        const pendingVendorsResult = await pool.query('SELECT COUNT(*) as count FROM vendors WHERE status = $1', ['pending']);
        const pendingVendorsCount = parseInt(pendingVendorsResult.rows[0].count);

        // Get approved vendors count
        const approvedVendorsResult = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['vendor']);
        const approvedVendorsCount = parseInt(approvedVendorsResult.rows[0].count);

        res.json({
            totalUsers,
            pendingVendorsCount,
            approvedVendorsCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};
