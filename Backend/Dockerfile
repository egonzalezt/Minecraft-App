# Use the official Node.js LTS image as the base
FROM node:lts-buster-slim

# Set environment variables
ENV NODE_ENV=production

# Install dependencies and Docker client
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files and install production dependencies
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../

# Copy the rest of the application code
COPY . .

# Expose the port your Node.js app will run on
EXPOSE 8000

# Command to start the Node.js application
CMD ["npm", "start"]
