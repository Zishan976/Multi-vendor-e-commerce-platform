import { pool } from "../config/db.js";
import { sendOrderConfirmationEmail } from "../utils/notificationService.js";

export const createOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id: userId } = req.user;
        const { shipping_address, payment_method } = req.body;
        const validPaymentMethods = ['bkash', 'nagad', 'rocket', 'cod', 'card'];
        const payment = validPaymentMethods.includes(payment_method) ? payment_method : null;

        await client.query('BEGIN');

        // Get cart items with row-level locking on products
        const cartResult = await client.query(`SELECT c.id as cart_id, ci.product_id, ci.quantity, p.price, p.stock_quantity, p.name
            FROM carts c
            JOIN cart_items ci ON c.id = ci.cart_id
            JOIN products p ON ci.product_id = p.id
            WHERE c.user_id = $1
            FOR UPDATE OF p`, [userId]);

        if (cartResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Cart is empty' });
        }

        // Validate stock inside transaction
        for (const item of cartResult.rows) {
            if (item.stock_quantity < item.quantity) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    error: `Insufficient stock for ${item.name}`
                });
            }
        }

        const totalAmount = cartResult.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order
        const orderResult = await client.query(`INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES ($1,$2,$3,$4) RETURNING id`, [userId, totalAmount, shipping_address, payment]);
        const orderId = orderResult.rows[0].id;

        // Create order items and update stock
        for (const item of cartResult.rows) {
            await client.query(`INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`, [orderId, item.product_id, item.quantity, item.price]);
            await client.query(`UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`, [item.quantity, item.product_id]);
        }

        // Clear cart
        await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartResult.rows[0].cart_id]);

        await client.query('COMMIT');

        // Send order confirmation email
        try {
            const userEmail = req.user.email;
            const orderDetails = {
                id: orderId,
                total_amount: totalAmount,
                status: 'pending',
                items: cartResult.rows.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            };
            await sendOrderConfirmationEmail(userEmail, orderDetails);
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Don't fail the order creation if email fails
        }

        res.json({
            message: 'Order created successfully',
            orderId: orderId
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    } finally {
        client.release();
    }
};

export const getUserOrder = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { page = 1, limit = 10 } = req.query;
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = parseInt(limit, 10) || 10;
        const offset = (parsedPage - 1) * parsedLimit;

        const ordersResult = await pool.query(`
            SELECT o.*, 
                   json_agg(
                       json_build_object(
                           'product_id', oi.product_id,
                           'quantity', oi.quantity,
                           'price', oi.price,
                           'product_name', p.name
                       )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT $2 OFFSET $3
        `, [userId, parsedLimit, offset]);


        const countResult = await pool.query('SELECT COUNT(*) FROM orders WHERE user_id = $1', [userId]);

        const totalOrders = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalOrders / parsedLimit);

        res.json({
            orders: ordersResult.rows,
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
        res.status(500).json({ error: 'Failed to fetch orders' })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        const { id: userId } = req.user;

        const orderResultById = await pool.query(`
            SELECT o.*, json_agg(
                            json_build_object(
                                'product_id', oi.product_id,
                                'quantity', oi.quantity,
                                'price', oi.price,
                                'product_name', p.name,
                                'vendor_name', v.business_name
                            )) AS items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            LEFT JOIN vendors v ON p.vendor_id = v.id
            WHERE o.id = $1 AND o.user_id = $2
            GROUP BY o.id
        `, [orderId, userId])

        if (orderResultById.rows.length === 0) {
            return res.status(404).json({ error: 'No order found related to this ID' })
        }

        res.json(orderResultById.rows[0])

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch order by id' })
    }
}
