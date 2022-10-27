// this test will fail on first try, but pass on second
it('Retry resets api state', { retries: 1 }, () => {

  // @ts-ignore
  const currentRetry = cy.state('runnable')._currentRetry

  // making sure we don’t see requests from previous retry
  cy.get('[data-cy="responseBody"]').should('not.exist')

  cy.api('/')

  cy.get('[data-cy="responseBody"]', { timeout: 50 })
    .should('be.visible')
    .and('have.length', currentRetry) // will be 0 on first try, 1 on second

});