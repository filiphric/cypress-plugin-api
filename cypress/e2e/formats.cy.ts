describe('response formats', () => {

  it('works with xml', () => {

    cy.api({
      url: '/xml'
    })

  });

  it('works with html', () => {

    cy.api({
      url: '/html'
    })

  });

  it('works with json', () => {

    cy.api({
      url: '/json'
    })

  });

  it('works with text', () => {

    cy.api({
      url: '/text'
    })

    cy.contains('Hey there 👋').should('be.visible')

  });

});