it('query string', () => {

  const qs = {
    listId: 1
  }

  cy.api({
    method: 'GET',
    url: '/',
    qs
  })

  cy.get('[data-cy=query]')
    .should('be.visible')
    .trigger('mouseover')
  cy.get('[data-cy=copyQuery]')
    .realClick()

  cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('eq', JSON.stringify(qs, null, 2))

});

it('headers', () => {

  const headers = {
    'accept': 'application/json'
  }

  cy.api({
    method: 'GET',
    url: '/',
    headers
  })

  cy.get('[data-cy=requestHeaders]')
    .should('be.visible')
    .trigger('mouseover')
  cy.get('[data-cy=copyRequestHeaders]')
    .realClick()

  cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('eq', JSON.stringify(headers, null, 2))

});

it('request and response body', () => {

  const request = {
    "hello": "world"
  }

  const response = {
    "string": "string",
    "int": 1234,
    "object": {
      "array": [
        1,
        2
      ]
    }
  }

  cy.api('POST', '/', { hello: 'world' })

  // copy request
  cy.get('[data-cy=requestBody]')
    .should('be.visible')
    .trigger('mouseover')
  cy.get('[data-cy=copyRequest]')
    .realClick()

  cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('eq', JSON.stringify(request, null, 2))

  // copy response
  cy.get('[data-cy=responseBody]')
    .should('be.visible')
    .trigger('mouseover')
  cy.get('[data-cy=copyResponse]')
    .realClick()

  cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('eq', JSON.stringify(response, null, 2))

})