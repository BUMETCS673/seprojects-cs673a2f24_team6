# Use an official Node.js runtime as a parent image
FROM node:16-alpine
# Set the working directory in the container
WORKDIR /app
# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the app for production
RUN npm run build

# Use a lightweight web server to serve the production build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expose the port on which the app will run
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]