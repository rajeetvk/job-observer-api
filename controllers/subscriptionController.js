const pool = require('../config/db');

const subscribe = async (req, res) => {
    const { tag } = req.body;
    const userId = req.user.id; // Comes from authMiddleware

    try {
        // Prevent duplicate subscriptions to the same tag
        const exists = await pool.query(
            `SELECT * FROM subscriptions WHERE user_id = $1 AND tag = $2`,
            [userId, tag]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ error: 'You are already subscribed to this tag.' });
        }

        await pool.query(
            `INSERT INTO subscriptions (user_id, tag) VALUES ($1, $2)`,
            [userId, tag]
        );

        res.status(201).json({ message: `Successfully subscribed to ${tag}!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

const getSubscriptions = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(`SELECT id, tag FROM subscriptions WHERE user_id = $1`, [userId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

const unsubscribe = async (req, res) => {
    const { tag } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
            `DELETE FROM subscriptions WHERE user_id = $1 AND tag = $2`,
            [userId, tag]
        );
        res.status(200).json({ message: `Successfully unsubscribed from ${tag}.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = { subscribe, getSubscriptions, unsubscribe };
