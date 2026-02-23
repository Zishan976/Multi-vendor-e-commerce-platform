import { pool } from "../config/db.js";


const simulatePayment = (method) => {
    const success = Math.random() > 0.3;
    return {
        success,
        transactionId: success ? `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : null,
        message: success ? 'Payment successful' : 'Payment failed - insufficient funds or network error'
    }
};

export const initiatePayment = async (req, res) => {
    const { orderId, paymentMethod } = req.body;
    const { id: userId } = req.user;

    if (!['bkash', 'nagad', 'rocket', 'cod', 'card'].includes(paymentMethod)) { return res.status(400).json({ error: 'Invalid payment method' }) };

    try {
        const order = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, userId]);

        if (!order.rows.length) return res.status(404).json({ error: 'Order not found' });

        if (paymentMethod === 'cod') {
            await pool.query('UPDATE orders SET payment_method = $1, payment_status = $2 WHERE id = $3', ['cod', 'completed', orderId]);
            return res.json({ message: 'COD payment completed' })
        };

        await pool.query('UPDATE orders SET payment_method = $1, payment_status = $2 WHERE id = $3', [paymentMethod, 'processing', orderId]);

        const fontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const redirectUrl = `${fontendUrl}/payment/${paymentMethod}?orderId=${orderId}`;
        res.json({ redirectUrl, message: 'Redirect to payment gateway' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
};

export const processPayment = async (req, res) => {
    const { orderId } = req.params;
    const { paymentMethod } = req.query;

    try {
        // Check if order exists - no user check needed for this public endpoint
        const orderCheck = await pool.query('SELECT id, payment_status FROM orders WHERE id = $1', [orderId]);

        if (!orderCheck.rows.length) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Don't process if already completed
        if (orderCheck.rows[0].payment_status === 'completed') {
            const fontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            return res.redirect(`${fontendUrl}/payment/callback?orderId=${orderId}&status=completed&message=Payment already completed`);
        }

        const result = simulatePayment(paymentMethod);
        const status = result.success ? 'completed' : 'failed';

        await pool.query('UPDATE orders SET payment_status = $1 WHERE id = $2', [status, orderId]);

        const fontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${fontendUrl}/payment/callback?orderId=${orderId}&status=${status}&message=${encodeURIComponent(result.message)}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
};

export const getPaymentStatus = async (req, res) => {
    const { orderId } = req.params;
    const { id: userId } = req.user;

    try {
        const order = await pool.query('SELECT payment_method, payment_status FROM orders WHERE id = $1 AND user_id = $2', [orderId, userId]);
        if (!order.rows.length) return res.status(404).json({ error: 'Order not found' });

        res.json(order.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get payment status' });
    }
};
