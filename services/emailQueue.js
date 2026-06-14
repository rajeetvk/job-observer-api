const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 1. Connect to your Upstash Redis database
const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
});

// 2. Create the Queue (The "Bucket" where your API will drop tasks)
const emailQueue = new Queue('EmailAlertsQueue', { connection });

// 3. Create the Worker (The background process that empties the bucket)
const emailWorker = new Worker('EmailAlertsQueue', async (job) => {
    // Extract the data that was passed from the API controller
    const { email, title, company } = job.data;

    try {
        // Create a Nodemailer transporter using SMTP credentials from .env
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Set up email data
        const mailOptions = {
            from: `"Job Alert Platform" <${process.env.SMTP_USER}>`, // sender address
            to: email, // list of receivers
            subject: `New Job Alert: ${title} at ${company}`, // Subject line
            html: `
                <h2>Good news! A new job matching your tags was posted.</h2>
                <p><strong>Job Title:</strong> ${title}</p>
                <p><strong>Company:</strong> ${company}</p>
                <br>
                <p>Best of luck with your application!</p>
            `, // html body
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`[BACKGROUND WORKER] ✅ Sent Real Email to ${email} - Message ID: ${info.messageId}`);
    } catch (error) {
        console.error(`[BACKGROUND WORKER] ❌ Failed to send email to ${email}:`, error);
        throw error; // Re-throw the error so BullMQ knows the job failed and can retry
    }

}, { connection });

// Error handling to let us know if a background job fails
emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} has failed with ${err.message}`);
});

// Export the Queue so our Job Controller can drop tasks into it
module.exports = { emailQueue };
