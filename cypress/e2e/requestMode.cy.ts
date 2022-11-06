it('request mode', () => {

  cy.request('DELETE', '/')
  cy.api('/')
  cy.request('POST', '/')

  cy.get('[data-cy=requestPanel')
    .should('have.length', 3)

});