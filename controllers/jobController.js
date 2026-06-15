const pool = require('../config/db');
const { emailQueue } = require('../services/emailQueue');

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

        // --- NEW QUEUE LOGIC ---
        // Instead of processing emails here, drop them into Redis!
        for (const sub of subscribers.rows) {
            await emailQueue.add('sendEmailJob', {
                email: sub.email,
                title: title,
                company: company
            });
        }

        // Respond to the user INSTANTLY, even if 10,000 emails are in the queue.
        res.status(201).json({ 
            message: 'Job posted successfully! Emails are queuing in the background.', 
            queued_emails: subscribers.rows.length,
            job: newJob
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobsResult = await pool.query(
            `SELECT * FROM jobs ORDER BY id DESC LIMIT 20`
        );
        res.status(200).json(jobsResult.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching jobs' });
    }
};

module.exports = { postJob, getJobs };
