function setPluginConfig(key: string, value: unknown) {
  const fn = (window as unknown as { setPluginConfig?: (k: string, v: unknown) => void }).setPluginConfig
  if (typeof fn === 'function') fn(key, value)
  else if (typeof (Cypress as unknown as { expose?: unknown }).expose === 'function') (Cypress as unknown as { expose: (k: string, v: unknown) => void }).expose(key, value)
  else Cypress.env(key, value)
}

describe('request mode toggle', () => {

  it('request mode on', () => {
    setPluginConfig('requestMode', true)
    cy.request('DELETE', '/')
    cy.api('/')
    cy.request('POST', '/')

    cy.get('[data-cy=requestPanel]')
      .should('have.length', 3)

  });

  it('request mode off', () => {
    setPluginConfig('requestMode', false)
    cy.api('/')
    cy.request('POST', '/')

    cy.get('[data-cy=requestPanel]')
      .should('have.length', 1)

  });

});