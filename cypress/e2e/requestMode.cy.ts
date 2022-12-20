describe('request mode toggle', () => {

  it('request mode on', { env: { requestMode: true } }, () => {

    cy.request('DELETE', '/')
    cy.api('/')
    cy.request('POST', '/')

    cy.get('[data-cy=requestPanel]')
      .should('have.length', 3)

  });

  it('request mode off', { env: { requestMode: false } }, () => {

    cy.api('/')
    cy.request('POST', '/')

    cy.get('[data-cy=requestPanel]')
      .should('have.length', 1)

  });

});