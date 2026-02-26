import pg from 'pg';

const { Pool } = pg;

// Scalable connection pool configuration for Neon cloud DB
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Connection pool limits for cloud database
    max: process.env.DB_POOL_MAX || 5,         // Reduced for cloud DB
    min: process.env.DB_POOL_MIN || 0,         // No minimum for cloud DB
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 10000, // Close idle clients after 10s
    connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT || 30000, // 30s timeout for cloud connections
    // SSL is required for Neon cloud database
    ssl: { rejectUnauthorized: false }
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected pool error:', err);
    // Don't exit on idle client error - try to recover
});

// Test connection - non-blocking, with better error handling
export async function testConnection() {
    try {
        const client = await pool.connect();
        try {
            console.log('Database connected successfully');
            // Test a simple query
            await client.query('SELECT NOW()');
        } finally {
            client.release();
        }
    } catch (error) {
        // Log as warning, not error - don't crash the server
        console.warn('Database connection warning:', error.message);
        console.warn('Server will continue but database-dependent features may not work');
    }
}

// Export pool query method for convenience
export const query = (text, params) => pool.query(text, params);
