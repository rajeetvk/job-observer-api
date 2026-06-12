# Job Alert Platform 🚀

A scalable Node.js application that notifies users of new job postings based on their subscribed tags (e.g., "Node.js", "Remote", "SDE Intern"). Built with the **Observer Pattern** architecture.

## 🌟 Current Features (Phase 2 MVP)
- **MVC Architecture:** Clean, modular, and maintainable project structure.
- **PostgreSQL Database:** Fully relational schema using Cloud Neon DB.
- **Smart Subscription Engine:** Users subscribe to specific job tags.
- **Native Array Matching:** Uses PostgreSQL `ANY()` arrays to efficiently match job tags to user subscriptions.
- **Observer Pattern Trigger:** Instantly identifies and alerts subscribers when a new job is posted.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon Cloud)
- **Database Driver:** `pg`

## 🚀 Upcoming Features
- [ ] **Message Queues:** Redis & BullMQ integration for asynchronous email delivery at scale.
- [ ] **Automated Data Ingestion:** Web scraper using Cheerio/Puppeteer to automatically fetch jobs via Cron.
- [ ] **Real Notifications:** Integration with Nodemailer/SendGrid for actual email delivery.

## 💻 Local Setup
1. Clone the repository
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=your_postgres_connection_string
   ```
4. Start the server: 
   ```bash
   node index.js
   ```
