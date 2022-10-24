beforeEach(() => {
  cy.session('login', () => {
    cy.log('Hello')
  })
});

it('creates a session', () => {

  cy.api('/')

  cy.get('[data-cy=responseBody]')
    .should('be.visible')

})

it('uses a session', () => {

  cy.api('/')

  cy.get('[data-cy=responseBody]')
    .should('be.visible')

})