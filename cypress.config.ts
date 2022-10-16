import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'v2x96h',
  numTestsKeptInMemory: 0,
  defaultCommandTimeout: 60000,
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:3003',
    experimentalSessionAndOrigin: true,
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    numTestsKeptInMemory: 0,
  },
})
