describe('cookie table', () => {

  it('shows cookie table', () => {

    cy.api('/cookies')
    cy.get('[data-cy=showCookies] + label')
      .click()

    cy.get('[data-cy=cookies]')
      .should('be.visible')

    cy.contains('th', 'Name')
    cy.contains('th', 'Value')

    cy.contains('td', 'hello')
    cy.contains('td', 'cookie')

  });

});