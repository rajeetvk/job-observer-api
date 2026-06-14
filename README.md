# Job Alert Platform 🚀

A scalable Node.js application that notifies users of new job postings based on their subscribed tags (e.g., "Node.js", "Remote", "SDE Intern"). Built with the Observer Pattern architecture.

## 🌟 Current Features (Phase 2 MVP)
- MVC Architecture: Clean, modular, and maintainable project structure.
- PostgreSQL Database: Fully relational schema using Cloud Neon DB.
- Smart Subscription Engine: Users subscribe to specific job tags.
- Native Array Matching: Uses PostgreSQL ANY() arrays to efficiently match job tags to user subscriptions.
- Observer Pattern Trigger: Instantly identifies and alerts subscribers when a new job is posted.

## 🛠️ Tech Stack
- Backend: Node.js, Express.js
- Database: PostgreSQL (Neon Cloud)
- Database Driver: pg

## 🚀 Upcoming Features
- [x] Message Queues: Redis & BullMQ integration for asynchronous email delivery at scale.
- [ ] Automated Data Ingestion: Web scraper using Cheerio/Puppeteer to automatically fetch jobs via Cron.
- [x] Real Notifications: Integration with Nodemailer/SendGrid for actual email delivery.

## 💻 Local Setup
1. Clone the repository
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Create a .env file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=your_postgres_connection_string
   REDIS_URL=your_upstash_redis_url
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```
4. Start the server: 
   ```bash
   node index.js
   ```
#   j o b - o b s e r v e r - a p i  