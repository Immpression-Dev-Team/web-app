# Use an official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Update and install dependencies
RUN npm ci --platform=linux

# Expose port 3000 to the outside
EXPOSE 3000

# Start the React app in development mode
CMD ["npm", "run", "dev"]
