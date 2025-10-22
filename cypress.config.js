const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  // projectId: "fwnu3h",
  e2e: {
    baseUrl: process.env.BASE_URL || 'https://academybugs.com',

    // Viewport settings for web and mobile
    viewportWidth: 1280,
    viewportHeight: 720,

    // Test execution settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,

    // Video and screenshot settings
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/results/screenshots',
    videosFolder: 'cypress/results/videos',

    // Retry configuration for flaky tests
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Reporting configuration
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'reporter-config.json',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
