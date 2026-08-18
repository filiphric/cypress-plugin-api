function setPluginConfig(key: string, value: unknown) {
  const fn = (window as unknown as { setPluginConfig?: (k: string, v: unknown) => void }).setPluginConfig
  if (typeof fn === 'function') fn(key, value)
  else if (typeof (Cypress as unknown as { expose?: unknown }).expose === 'function') (Cypress as unknown as { expose: (k: string, v: unknown) => void }).expose(key, value)
  else Cypress.env(key, value)
}

describe('disableUi mode', () => {

  afterEach(() => {
    // Restore the suite default (config forces UI on so other specs render).
    setPluginConfig('disableUi', false)
  })

  it('disableUi: true skips rendering the plugin UI but still yields the response', () => {
    setPluginConfig('disableUi', true)
    cy.api('/').then((res) => {
      expect(res.status).to.eq(200)
    })
    // No Vue app mounted and no response body rendered into the DOM.
    cy.get('#api-plugin-root').should('not.exist')
    cy.get('[data-cy="responseBody"]').should('not.exist')
  })

  it('disableUi: false renders the UI even in run mode', () => {
    setPluginConfig('disableUi', false)
    cy.api('/')
    cy.get('[data-cy="responseBody"]').should('be.visible')
  })

  it('switching disableUi off again restores rendering', () => {
    setPluginConfig('disableUi', true)
    cy.api('/')
    cy.get('[data-cy="responseBody"]').should('not.exist')

    setPluginConfig('disableUi', false)
    cy.api('/')
    cy.get('[data-cy="responseBody"]').should('be.visible')
  })

})
