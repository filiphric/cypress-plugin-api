it('has a session', () => {

  cy.session('login', () => {
    cy.log('Hello')
  })

  cy.api('/')

  cy.get('[data-cy=request]')
    .should('be.visible')

})