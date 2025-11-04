import { pool } from "../config/db.js";

export const getOrderedProductsOfVendor = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { page = 1, limit = 10 } = req.query;
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = parseInt(limit, 10) || 10;
        const offset = (parsedPage - 1) * parsedLimit;

        const vendorResult = await pool.query('SELECT id FROM vendors WHERE user_id = $1', [userId])

        if (vendorResult.rows.length === 0) {
            return res.status(404).json({ error: 'Vendor not found' })
        }

        const vendorId = vendorResult.rows[0].id;
        console.log('vendorId:', vendorId);

        const fetchOrders = await pool.query(`
            SELECT o.id, o.total_amount, o.status, o.created_at, u.username as customer_name, u.email as customer_email, o.shipping_address as customer_address,
            json_agg(
                json_build_object(
                    'product_id', oi.product_id,
                    'price', oi.price,
                    'quantity', oi.quantity,
                    'product_name', p.name,
                    'item_total', oi.price * oi.quantity
                )
            ) as items
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN users u ON o.user_id = u.id
            WHERE p.vendor_id = $1
            GROUP BY o.id, u.username, u.email, o.shipping_address, o.total_amount, o.status, o.created_at
            ORDER BY o.created_at DESC
            LIMIT $2 OFFSET $3
        `, [vendorId, parsedLimit, offset]);

        // Add count for pagination metadata
        const countResult = await pool.query('SELECT COUNT(DISTINCT o.id) as total FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE p.vendor_id = $1', [vendorId]);

        const totalOrders = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(totalOrders / parsedLimit);

        res.json({
            orders: fetchOrders.rows,
            pagination: {
                currentPage: parsedPage,
                totalPages,
                totalOrders,
                hasNext: parsedPage < totalPages,
                hasPrev: parsedPage > 1
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: `Failed to fetch vendor's ordered products`
        })
    }
};

export const getOrderedProductByIdOfVendor = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id: orderId } = req.params;

        const vendorResult = await pool.query(`SELECT id FROM vendors WHERE user_id = $1`, [userId]);


        if (vendorResult.rows.length === 0) {
            return res.status(404).json({ error: `Vendor not found` });
        }

        const vendorId = vendorResult.rows[0].id;

        const fetchOrderById = await pool.query(`SELECT o.id, o.total_amount, o.status, o.created_at, u.username as customer_name, u.email as customer_email, o.shipping_address as customer_address,
        json_agg(
            json_build_object(
                'product_id', oi.product_id,
                    'price', oi.price,
                    'quantity', oi.quantity,
                    'product_name', p.name,
                    'item_total', oi.price * oi.quantity
            )
        ) as items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        JOIN users u ON o.user_id = u.id
        WHERE p.vendor_id = $1 AND o.id = $2
        GROUP BY o.id, u.username, u.email, o.shipping_address, o.total_amount, o.status, o.created_at
        `, [vendorId, orderId]);

        if (fetchOrderById.rows.length === 0) {
            return res.status(404).json({ error: `No vendor's order found by ID` })
        };

        res.json(fetchOrderById.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: `Failed to fetch vendor's ordered product by id`
        })
    }
};

export const UpdateOrderedProductStatus = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id: orderId } = req.params;
        const { status } = req.body;

        const vendorResult = await pool.query(`SELECT id FROM vendors WHERE user_id = $1`, [userId]);

        if (vendorResult.rows.length === 0) {
            return res.status(404).json({ error: `Vendor not found` });
        }

        const vendorId = vendorResult.rows[0].id;

        const orderCheck = await pool.query(`
            SELECT o.id FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.id = $1 AND p.vendor_id = $2
        `, [orderId, vendorId]);

        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ error: `Order not found or does not contain your products` })
        }

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` })
        }

        const updateResult = await pool.query(`UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`, [status, orderId]);

        res.json({
            message: `Order status updated successfully`,
            order: updateResult.rows[0]
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: `Failed to update vendor's ordered product`
        })
    }
};