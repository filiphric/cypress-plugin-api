it('handles redirect', () => {

  cy.api({
    url: '/redirect',
    followRedirect: false
  }).then(response => {
    expect(response.status).eq(301);
    expect(response.redirectedToUrl).eq(`${Cypress.config('baseUrl')}/`);
  });

});