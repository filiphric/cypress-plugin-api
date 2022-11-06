import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'v2x96h',
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:3003',
    defaultCommandTimeout: 1000,
    experimentalSessionAndOrigin: true,
    video: process.env.CI ? true : false,
    videoUploadOnPasses: false,
    screenshotOnRunFailure: process.env.CI ? true : false,
    excludeSpecPattern: 'cypress/e2e/requestMode.cy.ts'
  },
})
