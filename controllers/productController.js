import { pool } from "../config/db.js";
import { uploadToCloudinary, deleteLocalFile } from "../utils/cloudinaryService.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category_id, search } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT p.*, c.name as category_name, v.business_name as vendor_name, v.id as vendor_id
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN vendors v ON p.vendor_id = v.id
            WHERE p.status = 'active'
        `;
        let countQuery = `SELECT COUNT(*) FROM products p WHERE p.status = 'active'`;
        const params = [];
        let paramIndex = 1;

        if (category_id) {
            query += ` AND p.category_id = $${paramIndex}`;
            countQuery += ` AND p.category_id = $${paramIndex}`;
            params.push(category_id);
            paramIndex++;
        }

        if (search) {
            query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
            countQuery += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        // Build count params explicitly - only include filter params, not limit and offset
        const countParams = params.slice(0, params.length - 2);

        const [productsResult, countResult] = await Promise.all([
            pool.query(query, params),
            pool.query(countQuery, countParams)
        ]);

        const totalProducts = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalProducts / limit);

        if (!productsResult.rows.length) {
            return res.json({
                products: [],
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: 0,
                    totalProducts: 0,
                    hasNext: false,
                    hasPrev: false
                }
            })
        }

        res.json({
            products: productsResult.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalProducts,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getLatestProducts = async (req, res) => {
    try {
        const { limit = 4 } = req.query;

        const productsResult = await pool.query(`SELECT p.*, c.name as category_name, v.business_name as vendor_name, v.id as vendor_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN vendors v ON p.vendor_id = v.id
        WHERE p.status = 'active'
        ORDER BY p.created_at DESC
        LIMIT $1`, [limit]);

        res.json({ products: productsResult.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch latest products' });
    }
};

export const getBestProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // For now, I'll use products with highest stock as a proxy for "best"
        const productsResult = await pool.query(`
        SELECT p.*, c.name as category_name, v.business_name as vendor_name, v.id as vendor_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN vendors v ON p.vendor_id = v.id
        WHERE p.status = 'active'
        ORDER BY p.stock_quantity DESC, p.created_at DESC
        LIMIT $1`, [limit]);

        res.json({ products: productsResult.rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch best products' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const productResult = await pool.query(`
            SELECT p.*, c.name as category_name, v.business_name as vendor_name, v.id as vendor_id
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN vendors v ON p.vendor_id = v.id
            WHERE p.id = $1 AND p.status = 'active'
        `, [id]);

        if (!productResult.rows.length) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(productResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const [productsResult, countResult] = await Promise.all([
            pool.query(`
                SELECT p.*, c.name as category_name, v.business_name as vendor_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN vendors v ON p.vendor_id = v.id
                WHERE p.category_id = $1 AND p.status = 'active'
                ORDER BY p.created_at DESC
                LIMIT $2 OFFSET $3
            `, [categoryId, limit, offset]),
            pool.query('SELECT COUNT(*) FROM products WHERE category_id = $1 AND status = $2', [categoryId, 'active'])
        ]);

        const totalProducts = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalProducts / limit);

        if (!productsResult.rows.length) {
            return res.json({
                products: [],
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: 0,
                    totalProducts: 0,
                    hasNext: false,
                    hasPrev: false
                }
            })
        }

        res.json({
            products: productsResult.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalProducts,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
};

export const getProductsByVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const [productsResult, countResult] = await Promise.all([
            pool.query(`
                SELECT p.*, c.name as category_name, v.business_name as vendor_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN vendors v ON p.vendor_id = v.id
                WHERE p.vendor_id = $1 AND p.status = 'active'
                ORDER BY p.created_at DESC
                LIMIT $2 OFFSET $3
            `, [vendorId, limit, offset]),
            pool.query('SELECT COUNT(*) FROM products WHERE vendor_id = $1 AND status = $2', [vendorId, 'active'])
        ]);

        const totalProducts = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalProducts / limit);

        if (!productsResult.rows.length) {
            return res.json({
                products: [],
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: 0,
                    totalProducts: 0,
                    hasNext: false,
                    hasPrev: false
                }
            })
        }

        res.json({
            products: productsResult.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalProducts,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products by vendor' });
    }
};

export const getVendorProducts = async (req, res) => {
    const { id: userId } = req.user;
    try {
        // Get vendor ID from user ID
        const vendorResult = await pool.query('SELECT id FROM vendors WHERE user_id = $1', [userId]);
        if (vendorResult.rows.length === 0) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        const vendorId = vendorResult.rows[0].id;

        const getProducts = await pool.query('SELECT * FROM products WHERE vendor_id = $1', [vendorId]);
        res.json(getProducts.rows);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch vendor products' })
    }
}

export const getVendorProduct = async (req, res) => {
    const { productId } = req.params;
    const { id: userId } = req.user;
    try {
        // Get vendor ID from user ID
        const vendorResult = await pool.query('SELECT id FROM vendors WHERE user_id = $1', [userId]);
        if (vendorResult.rows.length === 0) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        const vendorId = vendorResult.rows[0].id;

        const getProduct = await pool.query('SELECT * FROM products WHERE id = $1 AND vendor_id = $2', [productId, vendorId]);
        if (!getProduct.rows.length) { return res.status(404).json({ error: 'Product not found' }) };

        res.json(getProduct.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch vendor single product' })
    }
}

export const addVendorProducts = async (req, res) => {
    const { id: userId } = req.user;
    const { name, description, price, stock_quantity, category_id, status } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    if (price <= 0) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
    }
    if (stock_quantity < 0) {
        return res.status(400).json({ error: 'Stock quantity cannot be negative' });
    }
    if (status && !['active', 'inactive', 'out_of_stock'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        // Get vendor ID from user ID
        const vendorResult = await pool.query('SELECT id FROM vendors WHERE user_id = $1', [userId]);
        if (vendorResult.rows.length === 0) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        const vendorId = vendorResult.rows[0].id;

        // Check for duplicate product name within the same vendor
        const checkName = await pool.query('SELECT * FROM products WHERE name = $1 AND vendor_id = $2', [name, vendorId]);

        if (checkName.rows.length > 0) {
            return res.status(400).json({ error: 'This product name already exists in your store' })
        }

        let image_url = null;
        if (req.file) {
            const localFilePath = path.join(__dirname, '../uploads/products', req.file.filename);
            try {
                // Upload to Cloudinary
                image_url = await uploadToCloudinary(localFilePath);
                // Delete local file after successful upload
                deleteLocalFile(localFilePath);
            } catch (uploadError) {
                console.error('Cloudinary upload failed:', uploadError);
                // Still save the product but with local URL as fallback
                image_url = `/uploads/products/${req.file.filename}`;
            }
        }

        const addProducts = await pool.query('INSERT INTO products (vendor_id, category_id, name, description, price, stock_quantity, image_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [vendorId, category_id, name, description, price, stock_quantity, image_url, status]);

        res.json(addProducts.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add vendor products' });
    }
}

export const updateVendorProducts = async (req, res) => {
    const { id: userId } = req.user;
    const { productId } = req.params;
    const { name, description, price, stock_quantity, category_id, status } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    if (price <= 0) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
    }
    if (stock_quantity < 0) {
        return res.status(400).json({ error: 'Stock quantity cannot be negative' });
    }
    if (status && !['active', 'inactive', 'out_of_stock'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        // Get vendor ID from user ID
        const vendorResult = await pool.query('SELECT id FROM vendors WHERE user_id = $1', [userId]);
        if (vendorResult.rows.length === 0) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        const vendorId = vendorResult.rows[0].id;

        // Build dynamic update query based on provided fields
        const updateFields = [];
        const params = [];
        let paramIndex = 1;

        // Always include required fields
        updateFields.push(`name = $${paramIndex}`);
        params.push(name);
        paramIndex++;

        updateFields.push(`price = $${paramIndex}`);
        params.push(price);
        paramIndex++;

        // Only include optional fields if they are provided (not undefined)
        if (description !== undefined) {
            updateFields.push(`description = $${paramIndex}`);
            params.push(description);
            paramIndex++;
        }

        if (stock_quantity !== undefined) {
            updateFields.push(`stock_quantity = $${paramIndex}`);
            params.push(stock_quantity);
            paramIndex++;
        }

        if (category_id !== undefined) {
            updateFields.push(`category_id = $${paramIndex}`);
            params.push(category_id);
            paramIndex++;
        }

        if (status) {
            updateFields.push(`status = $${paramIndex}`);
            params.push(status);
            paramIndex++;
        }

        // Handle image upload only if a new file is provided
        if (req.file) {
            const localFilePath = path.join(__dirname, '../uploads/products', req.file.filename);
            try {
                // Upload to Cloudinary
                const image_url = await uploadToCloudinary(localFilePath);
                // Delete local file after successful upload
                deleteLocalFile(localFilePath);

                updateFields.push(`image_url = $${paramIndex}`);
                params.push(image_url);
                paramIndex++;
            } catch (uploadError) {
                console.error('Cloudinary upload failed:', uploadError);
                // Still save the product but with local URL as fallback
                const image_url = `/uploads/products/${req.file.filename}`;
                updateFields.push(`image_url = $${paramIndex}`);
                params.push(image_url);
                paramIndex++;
            }
        }

        // Add WHERE conditions
        params.push(productId, vendorId);

        const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id = $${paramIndex} AND vendor_id = $${paramIndex + 1} RETURNING *`;

        const updateProduct = await pool.query(query, params);

        if (!updateProduct.rows.length) { return res.status(404).json({ error: 'Product not found' }) }

        res.json(updateProduct.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update vendor products' });
    }

}

export const deleteVendorProducts = async (req, res) => {
    const { id: userId } = req.user;
    const { productId } = req.params;
    try {
        // Get vendor ID from user ID
        const vendorResult = await pool.query('SELECT id FROM vendors WHERE user_id = $1', [userId]);
        if (vendorResult.rows.length === 0) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        const vendorId = vendorResult.rows[0].id;

        const deleteProduct = await pool.query('DELETE FROM products WHERE id = $1 AND vendor_id = $2 RETURNING *', [productId, vendorId]);

        if (!deleteProduct.rows.length) { return res.status(404).json({ error: 'Product not found' }) };

        res.json({ message: 'Product deleted successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete vendor products' });
    }
}
