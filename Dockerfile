# 1. Start from a lightweight Linux OS that already has Node.js v18 installed
FROM node:18-alpine

# 2. Create a folder inside the container to hold our app
WORKDIR /app

# 3. Copy ONLY the package.json files first (this makes building much faster!)
COPY package.json package-lock.json ./

# 4. Install the node modules inside the container
RUN npm install --production

# 5. Now copy the rest of your actual code into the container
COPY . .

# 6. Expose the port your Express app uses
EXPOSE 3000

# 7. The command that runs when the container wakes up
CMD ["node", "index.js"]
