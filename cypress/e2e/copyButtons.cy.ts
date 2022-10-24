it('copy buttons', () => {

  const headers = {
    'accept': 'application/json'
  }

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

  const qs = {
    listId: 1
  }

  cy.api({
    method: 'GET',
    url: '/',
    qs,
    headers
  })

  cy.log('query')
  // make the copy button appear
  cy.invokeCopyButton('[data-cy=query]', '[data-cy=copyQuery]')

  cy.get('[data-cy=copyQuery]')
    .realClick()

  cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('eq', JSON.stringify(qs, null, 2))

  cy.log('response')
  // make the copy button appear
  cy.invokeCopyButton('[data-cy=responseBody]', '[data-cy=copyResponse]')

  // copy response
  cy.get('[data-cy=copyResponse]')
    .realClick()

  cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('eq', JSON.stringify(response, null, 2))

  cy.log('headers')
  // make the copy button appear
  cy.invokeCopyButton('[data-cy=requestHeaders]', '[data-cy=copyRequestHeaders]')

  cy.get('[data-cy=copyRequestHeaders]')
    .realClick()

  cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('eq', JSON.stringify(headers, null, 2))

  cy.log('request')
  cy.api('POST', '/', { hello: 'world' })

  // make the copy button appear
  cy.invokeCopyButton('[data-cy=requestBody]', '[data-cy=copyRequest]')

  // copy request
  cy.get('[data-cy=copyRequest]')
    .realClick()

  cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('eq', JSON.stringify(request, null, 2))

})