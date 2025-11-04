import { pool } from "../config/db.js";

export const getCart = async (req, res) => {
    try {
        const { id: userId } = req.user;

        // Get or create cart for user
        let cartResult = await pool.query(
            'SELECT * FROM carts WHERE user_id = $1',
            [userId]
        );

        let cartId;
        if (cartResult.rows.length === 0) {
            const newCart = await pool.query(
                'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
                [userId]
            );
            cartId = newCart.rows[0].id;
        } else {
            cartId = cartResult.rows[0].id;
        }

        // Get cart items with product details
        const itemsResult = await pool.query(`
            SELECT ci.*, p.name, p.price, p.image_url, p.stock_quantity,
                   v.business_name as vendor_name
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            JOIN vendors v ON p.vendor_id = v.id
            WHERE ci.cart_id = $1
        `, [cartId]);

        const totalAmount = itemsResult.rows.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
        );

        res.json({
            cart: {
                id: cartId,
                items: itemsResult.rows,
                totalAmount: parseFloat(totalAmount.toFixed(2))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cart information' });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        const { id: userId } = req.user;

        if (!product_id || quantity < 1) { return res.status(400).json({ error: 'Product_id and quantity is needed' }) }

        const productResult = await pool.query('SELECT * FROM products WHERE id = $1 AND status = $2', [product_id, 'active']);

        if (productResult.rows.length === 0) { return res.status(404).json({ error: 'Product not found or inactive' }) }

        const product = productResult.rows[0];

        if (product.stock_quantity < quantity) { return res.status(400).json({ error: 'Insufficient stock' }) }

        // Get or create cart for user
        let cartResult = await pool.query(
            'SELECT * FROM carts WHERE user_id = $1',
            [userId]
        );

        let cartId;
        if (cartResult.rows.length === 0) {
            const newCart = await pool.query(
                'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
                [userId]
            );
            cartId = newCart.rows[0].id;
        } else {
            cartId = cartResult.rows[0].id;
        }

        //add or update cart item
        const existingItem = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId, product_id])

        if (existingItem.rows.length > 0) {
            await pool.query('UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2', [quantity, existingItem.rows[0].id])
        } else {
            await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)', [cartId, product_id, quantity])
        }



        res.json({ message: 'Product added to cart successfully' })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add cart information' });
    }
}

export const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { id: userId } = req.user;
        const { quantity } = req.body;

        if (quantity < 1) { return res.status(400).json({ error: 'Quantity must be at least one' }) };

        const itemResult = await pool.query(`
            SELECT ci.*, p.stock_quantity
            FROM cart_items ci
            JOIN carts c ON ci.cart_id = c.id
            JOIN products p ON ci.product_id = p.id
            WHERE ci.id = $1 AND c.user_id = $2
        `, [itemId, userId]);

        if (itemResult.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        const item = itemResult.rows[0];

        if (item.stock_quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        await pool.query(
            'UPDATE cart_items SET quantity = $1 WHERE id = $2',
            [quantity, itemId]
        );

        res.json({ message: 'Cart item updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to Update cart information' });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { id: userId } = req.user;

        const deleteResult = await pool.query('DELETE FROM cart_items USING carts WHERE cart_items.id = $1 AND cart_items.cart_id = carts.id AND carts.user_id = $2', [itemId, userId]);

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Item removed from cart' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove cart information' });
    }
}

export const clearCart = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const cartResult = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId])

        if (cartResult.rows.length === 0) {
            return res.json({ message: 'Cart is already empty' });
        }

        await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartResult.rows[0].id]);

        res.json({ message: 'Cart cleared successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
}