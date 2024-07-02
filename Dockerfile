# Use an official Node.js 20 runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using Yarn)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the Strapi project (this step is important for production)
RUN npm run build

# Make port 1337 available to the world outside this container
EXPOSE 1337

# Run the app in production mode
CMD ["npm", "start"]
