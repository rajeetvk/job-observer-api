const pool = require('../config/db');

const subscribe = async (req, res) => {
    const { email, name, tag } = req.body;

    try {
        const userResult = await pool.query(
            `INSERT INTO users (email, name) 
             VALUES ($1, $2) 
             ON CONFLICT (email) DO UPDATE SET name = $2 
             RETURNING id`,
            [email, name]
        );
        const userId = userResult.rows[0].id;

        await pool.query(
            `INSERT INTO subscriptions (user_id, tag) VALUES ($1, $2)`,
            [userId, tag]
        );

        res.status(201).json({ message: `Successfully subscribed ${email} to ${tag}!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = { subscribe };
