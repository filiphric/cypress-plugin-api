import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'v2x96h',
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:3003'
  },
})
