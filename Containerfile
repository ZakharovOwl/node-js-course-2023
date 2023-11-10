# Use a lightweight base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install TypeScript globally (if not already installed)
RUN npm install -g typescript

# Install dependencies for production
RUN npm ci --production

# Copy the application code
COPY . .

# Set the non-root user to run the application
USER node

# Expose the port that the application runs on
EXPOSE 3000

# Compile TypeScript code to JavaScript
RUN tsc

# Start the application (assuming compiled JavaScript code is in 'dist' directory)
CMD ["node", "dist/index.js"]
