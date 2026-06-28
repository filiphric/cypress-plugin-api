function setPluginConfig(key: string, value: unknown) {
  const fn = (window as unknown as { setPluginConfig?: (k: string, v: unknown) => void }).setPluginConfig
  if (typeof fn === 'function') fn(key, value)
  else if (typeof (Cypress as unknown as { expose?: unknown }).expose === 'function') (Cypress as unknown as { expose: (k: string, v: unknown) => void }).expose(key, value)
  else Cypress.env(key, value)
}

describe('snapshot only mode', () => {

  it('snapshotOnly mode removes plugin UI', { baseUrl: null }, () => {
    setPluginConfig('snapshotOnly', true)
    cy.visit('server-public/test.html')
    cy.contains('MY PAGE')
      .should('be.visible')
    cy.api('http://localhost:3003/json')
    cy.api('http://localhost:3003/text')
    cy.get('[data-cy="responseBody"]')
      .should('not.exist')

  });

  it('snapshotOnly does not affect later plugin use', () => {
    setPluginConfig('snapshotOnly', false)
    cy.api('/')
    cy.get('[data-cy="responseBody"]')
      .should('be.visible')

  });

  it('visiting a page does not affect showing plugin', { baseUrl: null }, () => {

    cy.api('http://localhost:3003/')
    cy.visit('server-public/test.html')
    cy.api('http://localhost:3003/')

  });

});