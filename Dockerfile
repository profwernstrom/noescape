# Stage 1: Build the React application
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy everything to the build container
COPY . .

# Install dependencies
RUN npm install

# Build the React application
RUN npm run build

# Stage 2: Serve the build output using Nginx
FROM docker.io/nginxinc/nginx-unprivileged:stable-alpine-slim

# Copy the build output from the previous stage to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file if you have one
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
