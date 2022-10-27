it('snapshotOnly mode removes plugin UI', {
  baseUrl: null, env: {
    snapshotOnly: true
  }
}, () => {

  cy.visit('server-public/test.html')
  cy.contains('MY PAGE')
    .should('be.visible')
  cy.api('http://localhost:3003/')
  cy.get('[data-cy="responseBody"]')
    .should('not.exist')

});