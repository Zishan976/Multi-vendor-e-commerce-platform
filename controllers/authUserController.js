import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js';


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) { return res.status(400).json({ error: "email and password needed" }) }

        const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        const user = userRes.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" })
        };

        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" })
    }

};

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) { return res.status(400).json({ error: "username, email and password needed" }) }

        const existInUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (existInUser.rows.length > 0) { return res.status(400).json({ error: "This email already exist" }) }


        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query('INSERT INTO users (username, email, password) VALUES ($1 ,$2, $3) RETURNING *', [username, email, hashPassword])

        const token = jwt.sign({ id: newUser.rows[0].id, role: newUser.rows[0].role, email: newUser.rows[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.json({ token })

    } catch (error) {
        res.status(500).json({ error: "Signup failed" })
    }
};

export const getUser = async (req, res) => {
    const { id } = req.user;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) { return res.status(404).json({ error: "User not found" }) }

        res.json(result.rows[0])
    } catch (error) {
        res.status(500).json({ error: "Failed to get user" })
    }
};

export const googleAuthCallback = (req, res) => {

    const token = jwt.sign({ id: req.user.id, role: req.user.role, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const base_url = process.env.BASE_URL || 'http://localhost:3000';
    res.redirect(`${base_url}/auth/callback?token=${token}`);
};
