const pool = require('../config/db');

const postJob = async (req, res) => {
    const { title, company, url, tags } = req.body;

    try {
        const jobResult = await pool.query(
            `INSERT INTO jobs (title, company, url, tags) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, company, url, tags]
        );
        const newJob = jobResult.rows[0];

        const subscribers = await pool.query(
            `SELECT DISTINCT u.email 
             FROM users u
             JOIN subscriptions s ON u.id = s.user_id
             WHERE s.tag = ANY($1)`,
            [tags]
        );

        subscribers.rows.forEach(sub => {
            console.log(`[EMAIL ALERT] To: ${sub.email} - New Job Match: ${title} at ${company}!`);
        });

        res.status(201).json({ 
            message: 'Job posted successfully!', 
            users_notified: subscribers.rows.length,
            job: newJob
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = { postJob };
