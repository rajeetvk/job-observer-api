# Job Alert Platform 🚀

A scalable Node.js application that notifies users of new job postings based on their subscribed tags (e.g., "Node.js", "Remote", "SDE Intern"). Built with the Observer Pattern architecture.

## 🌟 Core Features (Phase 3 Complete)
- **MVC Architecture:** Clean, modular, and maintainable backend structure.
- **PostgreSQL Database:** Fully relational schema using Cloud Neon DB with Native Array Matching (`ANY()`).
- **Observer Pattern:** Instantly triggers alerts when new scraped jobs match user subscription tags.
- **Message Queuing (Redis & BullMQ):** Offloads heavy email delivery tasks to background workers, keeping the API lightning fast.
- **JWT Authentication & Bcrypt Security:** Secure user registration, password hashing, and route protection.
- **Automated Data Ingestion:** Background cron workers fetch remote jobs continuously via API integration.
- **Real Notifications:** Integration with Nodemailer for actual email delivery.
- **Containerization & CI/CD:** Fully Dockerized architecture with automatic Continuous Deployment pipelines linked via Render and GitHub.
- **Glassmorphism Frontend Dashboard:** Beautiful, responsive UI for users to manage subscriptions and view the live job feed.

## 🐳 Docker Deployment (Recommended)
You can run this entire stack locally with zero configuration using Docker:
```bash
docker build -t job-alert .
docker run -p 3000:3000 --env-file .env job-alert
```
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