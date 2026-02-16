import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { pool } from '../config/db.js';

// Temporary token storage for secure OAuth callback
// Stores tokens with a temporary ID, client exchanges ID for tokens
const temporaryTokenStore = new Map();

// Clean up expired temporary tokens every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [tempId, data] of temporaryTokenStore.entries()) {
        if (now > data.expiresAt) {
            temporaryTokenStore.delete(tempId);
        }
    }
}, 5 * 60 * 1000);


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) { return res.status(400).json({ error: "email and password needed" }) }

        const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        const user = userRes.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" })
        };

        const accessToken = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = await generateRefreshToken(user.id);

        res.json({ accessToken, refreshToken });
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

        const accessToken = jwt.sign({ id: newUser.rows[0].id, role: newUser.rows[0].role, email: newUser.rows[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        const refreshToken = await generateRefreshToken(newUser.rows[0].id)

        res.json({ accessToken, refreshToken })

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

// Exchange temporary token ID for actual tokens (more secure than passing tokens in URL)
export const exchangeTempToken = async (req, res) => {
    const { tempTokenId } = req.body;

    if (!tempTokenId) {
        return res.status(400).json({ error: 'Temporary token ID required' });
    }

    const tokenData = temporaryTokenStore.get(tempTokenId);

    if (!tokenData) {
        return res.status(401).json({ error: 'Invalid or expired temporary token' });
    }

    // Delete the temporary token immediately after use (one-time use)
    temporaryTokenStore.delete(tempTokenId);

    res.json({
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken
    });
};

export const googleAuthCallback = async (req, res) => {
    try {
        const accessToken = jwt.sign({ id: req.user.id, role: req.user.role, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = await generateRefreshToken(req.user.id);

        // Generate a temporary token ID instead of passing tokens in URL
        const tempTokenId = crypto.randomBytes(32).toString('hex');

        // Store tokens temporarily (expires in 5 minutes)
        temporaryTokenStore.set(tempTokenId, {
            accessToken,
            refreshToken,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        const base_url = process.env.FRONTEND_URL || 'http://localhost:5173';
        // Redirect with temporary token ID instead of actual tokens
        res.redirect(`${base_url}/auth/callback?tempTokenId=${tempTokenId}`);
    } catch (error) {
        console.error('Google auth callback error:', error);
        res.status(500).json({ error: "Google authentication failed" });
    }
};

// Generate refresh token
const generateRefreshToken = async (userId) => {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, refreshToken, expiresAt]
    );

    return refreshToken;
};

// Refresh access token
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
    }

    try {
        // Verify refresh token exists and is valid
        const tokenResult = await pool.query(
            'SELECT * FROM refresh_tokens WHERE token = $1 AND is_revoked = FALSE AND expires_at > NOW()',
            [refreshToken]
        );

        if (tokenResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        const userId = tokenResult.rows[0].user_id;

        // Get user details
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        // Generate new access token
        const accessToken = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ accessToken });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Token refresh failed' });
    }
};

// Logout - revoke refresh token
export const logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
    }

    try {
        await pool.query(
            'UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = $1',
            [refreshToken]
        );

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};
