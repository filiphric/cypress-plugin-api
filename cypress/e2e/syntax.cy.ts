it('takes a single argument', () => {

  cy.api('/')

  // default method is GET
  cy.contains('GET')

});

it('takes two arguments', () => {

  cy.api('GET', '/')
  cy.contains('GET')

});

it('takes three arguments', () => {

  cy.api('POST', '/', { hello: 'world' })
  cy.contains('POST')
  cy.get('[data-cy=request]')
    .should('contain', '{')
    .should('contain', 'hello')
    .should('contain', ':')
    .should('contain', 'world')
    .should('contain', '}')

});