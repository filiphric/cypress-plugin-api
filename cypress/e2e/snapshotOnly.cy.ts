it('snapshotOnly mode removes plugin UI', {
  baseUrl: null, env: {
    snapshotOnly: true
  }
}, () => {

  cy.visit('server-public/test.html')
  cy.contains('MY PAGE')
    .should('be.visible')
  cy.api('http://localhost:3003/')
  cy.api('http://localhost:3003/')
  cy.get('[data-cy="responseBody"]')
    .should('not.exist')

});

it('snapshotOnly does not affect later plugin use', () => {

  cy.api('/')
  cy.get('[data-cy="responseBody"]')
    .should('be.visible')

});

it('visiting a page does not affect showing plugin', { baseUrl: null }, () => {

  cy.api('http://localhost:3003/')
  cy.visit('server-public/test.html')
  cy.api('http://localhost:3003/')

});