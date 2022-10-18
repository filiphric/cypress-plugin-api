const methods = ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']

it(`works with basic methods`, () => {

  methods.forEach(method => {
    cy.api({
      method,
      url: '/'
    })

  });

})

it('shows failed status code', () => {

  cy.api({
    url: '/404',
    failOnStatusCode: false
  })

  cy.get('[data-cy=status]')
    .eq(0)
    .should('be.visible')
    .and('contain', '404')

  cy.api({
    url: '/400',
    failOnStatusCode: false
  })

  cy.get('[data-cy=status]')
    .should('have.length', 2)
    .eq(1)
    .should('be.visible')
    .and('contain', '400')

});
