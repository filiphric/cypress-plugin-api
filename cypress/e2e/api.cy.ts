const methods = ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']

it(`works with basic methods`, () => {

  methods.forEach(method => {
    cy.api({
      method,
      url: '/'
    })

  });

})

it('works with query string', () => {

  cy.api({
    method: 'GET',
    url: '/',
    qs: {
      listId: 1
    }
  }).its('status')
    .should('eq', 200)

  cy.get('[data-cy=query]')
    .should('be.visible')

});

it('works with headers', () => {

  cy.api({
    method: 'GET',
    url: '/',
    headers: {
      'accept': 'application/json'
    }
  })

  cy.get('[data-cy=requestHeaders]')
    .should('be.visible')

});

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
    .eq(1)
    .should('be.visible')
    .and('contain', '400')

});
