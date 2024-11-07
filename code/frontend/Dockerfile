# Stage 1: Build Vue.js application
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Test Stage for Cypress
FROM cypress/included:13.15.1 AS test-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Run Cypress directly, assuming the base image handles Xvfb
CMD ["npx", "cypress", "run"]

# Stage 3: Production Stage with NGINX
FROM nginx:stable-alpine AS production-stage

# Copy built files to NGINX
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the NGINX server
EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
