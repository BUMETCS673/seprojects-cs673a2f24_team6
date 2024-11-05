# Stage 2: Test Stage for Cypress
FROM cypress/included:13.15.1 AS test-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Run Cypress directly, assuming the base image handles Xvfb
CMD ["npx", "cypress", "run"]
