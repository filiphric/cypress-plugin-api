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