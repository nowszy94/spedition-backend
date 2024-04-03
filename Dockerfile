# Use Node.js LTS as the base image
FROM --platform=linux/amd64 node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install NestJS dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Compile TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
CMD ["node", "./dist/main.js"]