const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8081", // Replace with your app's base URL
    // Add other configurations as needed
  },
});
