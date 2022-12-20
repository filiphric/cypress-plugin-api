/// <reference types="cypress" />

import './types'
import { api } from './modules/api'

before(() => {
  // initialize global props object
  window.props = {}
})



Cypress.Commands.addAll({ api })

Cypress.Commands.overwrite('request', (originalFn, ...args) => {
  if (Cypress.env('requestMode')) {
    return api(...args)
  } else {
    return originalFn(...args)
  }
})