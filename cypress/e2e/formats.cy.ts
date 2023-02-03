describe('response formats', () => {

  it('works with xml', () => {

    cy.api('/xml')

    // xml tag is formatted
    cy.contains('xml')
      .should('have.css', 'color', 'rgb(100, 112, 243)')

  });

  it('works with html', () => {

    cy.api('/html')

    // html tag is formatted
    cy.contains('html')
      .should('have.css', 'color', 'rgb(255, 87, 112)')

  });

  it('works with json', () => {

    cy.api('/json')

    // numbers in json are formatted
    cy.contains('1234')
      .should('have.css', 'color', 'rgb(31, 169, 113)')

  });

  it('works with json that does not contain proper header', () => {

    cy.api('/json-weird')

    // numbers in json are formatted
    cy.contains('1234')
      .should('have.css', 'color', 'rgb(31, 169, 113)')

  });

  it('works with text', () => {

    cy.api({
      url: '/text'
    })

    cy.contains('Hey there 👋').should('be.visible')

  });

  it('works with undefined format', () => {

    cy.api('/undefined')

    // xml tag is formatted
    cy.contains('xml')
      .should('have.css', 'color', 'rgb(100, 112, 243)')

  });

});