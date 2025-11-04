import express from 'express'
import { getUser, login, signup, googleAuthCallback } from '../controllers/authUserController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import passport from '../middleware/passportMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/user', authenticateUser, getUser);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuthCallback);

export default router;
