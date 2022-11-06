it('shows url', () => {

  cy.api('/')
  cy.get('[data-cy=url]')
    .should('have.value', `${Cypress.config('baseUrl')}/`)

  cy.api('http://localhost:3003/')
  cy.get('[data-cy=url]')
    .eq(1)
    .should('have.value', `${Cypress.config('baseUrl')}/`)

});

it('contains response information - status, time and duration', () => {

  cy.api('/').then(({ duration, size }) => {

    cy.get('[data-cy=status]')
      .should('have.text', '200\u00A0(OK)')

    cy.get('[data-cy=time]')
      .should('have.text', `${duration}\u00A0ms`)

    cy.get('[data-cy=size]')
      .should('have.text', '55\u00A0B')

    expect(size).to.eq(55)

  })




});