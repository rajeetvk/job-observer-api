const pool = require('./config/db');

async function migrate() {
    try {
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255)`);
        console.log('✅ Added password column to users table');
    } catch (e) {
        console.error('Migration error:', e.message);
    } finally {
        process.exit();
    }
}
migrate();
