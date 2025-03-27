# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Install @nestjs/cli globally
RUN npm install -g @nestjs/cli

# Copy the entire project
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 8000

# Set the command to run the application
CMD ["npm", "run", "start:prod"]
