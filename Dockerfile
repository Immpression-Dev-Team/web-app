# Use an official Node.js image as the base image
FROM node:20-alpine3.20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Update and install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the outside
EXPOSE 3000

# Enable polling for file changes
ENV CHOKIDAR_USEPOLLING=true

# Start the React app in development mode
CMD ["npm", "run", "dev"]
