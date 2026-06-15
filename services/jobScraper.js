const axios = require('axios');
const cron = require('node-cron');
const pool = require('../config/db');
const { emailQueue } = require('./emailQueue');

// This function fetches jobs and processes them
const fetchAndProcessJobs = async () => {
    console.log('[CRON] 🕵️‍♂️ Searching the web for new jobs...');

    try {
        // 1. Fetch the raw HTML from Hacker News Jobs board
        const cheerio = require('cheerio');
        const response = await axios.get('https://news.ycombinator.com/jobs');
        
        // 2. Load the HTML into Cheerio so we can scrape it
        const $ = cheerio.load(response.data);
        const jobs = [];

        // Scrape the first 5 job listings
        $('.athing').slice(0, 5).each((i, el) => {
            const a = $(el).find('.titleline a').first();
            const rawTitle = a.text();
            
            // Extract the company name (everything before "is hiring" or "Is Hiring")
            const companySplit = rawTitle.split(/is hiring/i);
            const companyName = companySplit.length > 1 ? companySplit[0].trim() : 'Unknown YC Startup';

            // Fix relative URLs
            let url = a.attr('href');
            if (url.startsWith('item?')) { 
                url = 'https://news.ycombinator.com/' + url; 
            }

            jobs.push({
                title: rawTitle,
                company_name: companyName,
                url: url,
                category: 'Software Engineering' // Defaulting to software engineering for HN jobs
            });
        });

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
