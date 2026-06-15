const pool = require('./config/db');

async function migrate() {
    try {
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255)`);
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires BIGINT`);
        console.log('✅ Added reset password columns to users table');
    } catch (e) {
        console.error('Migration error:', e.message);
    } finally {
        process.exit();
    }
}
migrate();
