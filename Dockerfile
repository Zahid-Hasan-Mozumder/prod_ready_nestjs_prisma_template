# Use the official lightweight Node.js 25 Alpine image as the base image
FROM node:24-alpine

# Remove all files from the app directory
RUN rm -rf /app/*

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to the working directory
COPY package*.json ./

# Install all dependencies specified in package.json
RUN npm install

# Copy the rest of the application's source code to the working directory
COPY . .

# Whether you exposed or not, the port will be always the port defined in your local code
# It just gives good understanding about the port where the code is running inside the container
# But, if you expose, then it must be equal to your local code's port number
EXPOSE 4000

# Copy the entrypoint script to the proper location inside the container
COPY ./entrypoint.dev.sh /usr/local/bin/entrypoint.dev.sh

# Update package lists, install dos2unix to fix possible line ending issues, then clean up the apk cache
RUN apk update && apk add dos2unix && rm -rf /var/cache/apk/*

# Convert entrypoint script's line endings to Unix format (in case host uses Windows CRLF)
RUN dos2unix /usr/local/bin/entrypoint.dev.sh

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/entrypoint.dev.sh

# Start the NestJS application in development mode
ENTRYPOINT [ "/usr/local/bin/entrypoint.dev.sh" ]