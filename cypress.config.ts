import { defineConfig } from 'cypress'
import * as fs from 'fs'

export default defineConfig({
  projectId: 'v2x96h',
  e2e: {
    baseUrl: 'http://localhost:3003',
    defaultCommandTimeout: 1000,
    experimentalRunAllSpecs: true,
    video: process.env.CI ? true : false,
    screenshotOnRunFailure: process.env.CI ? true : false,
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        // Only delete videos for passing tests if video recording is enabled to replace the videoUploadOnPasses
        // If config.video is false, no videos are created, so nothing to delete
        if (config.video && results && results.video) {
          const failures = results.tests?.some((test) =>
            test.attempts?.some((attempt) =>
              attempt.state === 'failed'
            )
          )
          if (!failures && fs.existsSync(results.video)) {
            fs.unlinkSync(results.video)
          }
        }
      })
    },
  },
})
