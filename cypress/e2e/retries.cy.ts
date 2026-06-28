
describe('retryability', () => {
  it('Retry resets api state', { retries: 1 }, () => {

    cy.api('/')

    // Target only the visible div element (CodeBlock), not the hidden radio input
    cy.get('div[data-cy="responseBody"]')
      .should('be.visible')
      .and('have.length', 1)

  });

});