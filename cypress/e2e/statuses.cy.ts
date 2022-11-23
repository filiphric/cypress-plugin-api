it('handles redirect', () => {

  cy.api({
    url: '/redirect',
    followRedirect: false
  }).then(response => {
    expect(response.status).eq(301);
    expect(response.redirectedToUrl).eq(`${Cypress.config('baseUrl')}/`);
  });

  cy.get('[data-cy=status]')
    .should('be.visible')
    .and('contain', '301')
    .and('have.css', 'color', 'rgb(219, 121, 5)')

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
    .and('have.css', 'color', 'rgb(255, 87, 112)')

  cy.api({
    url: '/400',
    failOnStatusCode: false
  })

  cy.get('[data-cy=status]')
    .should('have.length', 2)
    .eq(1)
    .should('be.visible')
    .and('contain', '400')
    .and('have.css', 'color', 'rgb(255, 87, 112)')

});

it('works with empty response', () => {

  cy.api('/empty')

});