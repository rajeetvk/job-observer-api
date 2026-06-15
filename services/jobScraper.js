const axios = require('axios');
const cron = require('node-cron');
const pool = require('../config/db');
const { emailQueue } = require('./emailQueue');

// This function fetches jobs and processes them
const fetchAndProcessJobs = async () => {
    console.log('[CRON] 🕵️‍♂️ Searching the web for new jobs...');

    try {
        // 1. Fetch 5 recent remote jobs from the public Remotive API
        const response = await axios.get('https://remotive.com/api/remote-jobs?limit=5');
        const jobs = response.data.jobs;

        for (const job of jobs) {
            // 2. Check if we already have this job in our database
            const exists = await pool.query(`SELECT id FROM jobs WHERE url = $1`, [job.url]);

            if (exists.rows.length === 0) {
                // 3. It's a new job! Save it to the database.
                // We will auto-assign a tag based on its category
                const tags = [job.category, 'Remote'];

                await pool.query(
                    `INSERT INTO jobs (title, company, url, tags) VALUES ($1, $2, $3, $4)`,
                    [job.title, job.company_name, job.url, tags]
                );

                console.log(`[CRON] 🌟 Found a new job: ${job.title} at ${job.company_name}`);

                // 4. Trigger the Observer! Find who wants this job.
                const subscribers = await pool.query(
                    `SELECT DISTINCT u.email 
                     FROM users u
                     JOIN subscriptions s ON u.id = s.user_id
                     WHERE s.tag = ANY($1)`,
                    [tags]
                );

                // 5. Drop them in the Redis Queue
                for (const sub of subscribers.rows) {
                    await emailQueue.add('sendEmailJob', {
                        email: sub.email,
                        title: job.title,
                        company: job.company_name
                    });
                }
            }
        }
        console.log('[CRON] ✅ Finished processing jobs.');
    } catch (error) {
        console.error('[CRON] Error fetching jobs:', error.message);
    }
};

// Schedule this to run every 1 minute for testing purposes
// (In production, you would change '* * * * *' to '0 */3 * * *' for every 3 hours)
cron.schedule('* * * * *', () => {
    fetchAndProcessJobs();
});

module.exports = { fetchAndProcessJobs };
