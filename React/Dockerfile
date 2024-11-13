# Use Node.js as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app into the container
COPY . .

# Expose Vite's default dev server port (5173)
EXPOSE 5173

# Start Vite in development mode
CMD ["npm", "run", "dev"]
