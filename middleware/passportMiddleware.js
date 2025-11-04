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

        let user = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);

        if (user.rows.length === 0) {

            const emailUser = await pool.query('SELECT * FROM users WHERE email = $1', [profile.emails[0].value]);

            if (emailUser.rows.length > 0) {
                await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [profile.id, emailUser.rows[0].id]);
                user = await pool.query('SELECT * FROM users WHERE id = $1', [emailUser.rows[0].id]);
            } else {
                const newUser = await pool.query(
                    'INSERT INTO users (username, email, google_id) VALUES ($1, $2, $3) RETURNING *',
                    [profile.displayName, profile.emails[0].value, profile.id]
                );
                user = { rows: [newUser.rows[0]] };
            }
        }

        done(null, user.rows[0]);
    } catch (error) {
        done(error, null);
    }
}));

export default passport;
