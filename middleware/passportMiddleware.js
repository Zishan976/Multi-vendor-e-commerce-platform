import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../config/db.js';


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0]);
    } catch (error) {
        done(error, null);
    }
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Validate profile data
        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            return done(new Error('Email not provided by Google'), null);
        }

        const email = profile.emails[0].value;
        const username = profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName || 'Google User';

        let user = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);

        if (user.rows.length === 0) {
            // Check if user exists with same email
            const emailUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if (emailUser.rows.length > 0) {
                // Link Google ID to existing user
                await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [profile.id, emailUser.rows[0].id]);
                user = await pool.query('SELECT * FROM users WHERE id = $1', [emailUser.rows[0].id]);
            } else {
                // Create new user
                const newUser = await pool.query(
                    'INSERT INTO users (username, email, google_id) VALUES ($1, $2, $3) RETURNING *',
                    [username, email, profile.id]
                );
                user = { rows: [newUser.rows[0]] };
            }
        }

        done(null, user.rows[0]);
    } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
    }
}));

export default passport;
