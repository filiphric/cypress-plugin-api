/// <reference types="cypress" />

import './types'
import { api } from './modules/api'
import { getPluginConfig, setPluginConfig } from './utils/pluginConfig'

before(() => {
  // initialize global props object
  window.props = {}
  // Expose for e2e tests (works when Cypress.expose is not available)
  ;(window as unknown as { setPluginConfig?: typeof setPluginConfig }).setPluginConfig = setPluginConfig
})

Cypress.Commands.addAll({ api })

Cypress.Commands.overwrite('request', (originalFn, ...args) => {
  if (getPluginConfig('requestMode')) {
    return api(...args)
  } else {
    return originalFn(...args)
  }
})

export { api, setPluginConfig }