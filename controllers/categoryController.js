import { pool } from "../config/db.js"

export const getAllCategories = async (req, res) => {
    try {
        const fetchCategories = await pool.query('SELECT * FROM categories ORDER BY name')

        if (!fetchCategories.rows.length) {
            return res.status(404).json({ error: 'No categories found' })
        };

        res.json(fetchCategories.rows)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' })
    }
}

export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const fetchCategory = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);

        if (!fetchCategory.rows.length) {
            return res.status(404).json({ error: 'Category not found' })
        };

        res.json(fetchCategory.rows[0])


    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category by id' })
    }

}

export const createCategory = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, description } = req.body;

    if (!name) { return res.status(400).json({ error: 'Category name is needed' }) }

    try {
        const existing = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const createCategory = await pool.query('INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *', [name, description]);

        res.json(createCategory.rows[0])

    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' })
    }
}

export const updateCategory = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) { return res.status(400).json({ error: 'Category name is needed' }) }

    try {
        const updateCategory = await pool.query('UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);

        if (!updateCategory.rows.length) {
            return res.status(404).json({ error: 'Category not found' })
        }
        res.json(updateCategory.rows[0])

    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' })
    }
}

export const deleteCategory = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params;
    try {
        const deleteCategory = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

        if (!deleteCategory.rows.length) {
            return res.status(404).json({ error: 'Category not found' })
        }
        res.json({ message: 'Category deleted successfully' })

    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' })
    }
}
