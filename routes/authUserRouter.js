import express from 'express'
import rateLimit from 'express-rate-limit'
import { getUser, login, signup, googleAuthCallback, refreshToken, logout, exchangeTempToken } from '../controllers/authUserController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import passport from '../middleware/passportMiddleware.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: { error: 'Too many attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/login', authLimiter, login);
router.post('/signup', authLimiter, signup);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/exchange-temp-token', exchangeTempToken);
router.get('/user', authenticateUser, getUser);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuthCallback);

export default router;
