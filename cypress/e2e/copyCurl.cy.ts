describe('cURL functionality', () => {

  it('displays cURL for a simple GET request in the cURL tab', () => {
    cy.api('/')

    cy.get('[data-cy="requestPanel"]')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="curl-tab"]')
          .click({ force: true })

        cy.get('[data-cy="curl"]')
          .should('exist')
          .should('be.visible')
          .should('contain', 'curl -X GET')
          .should('contain', `${Cypress.config('baseUrl')}/`)
          .should('not.contain', '-d')
      })
  })

  it('displays cURL for GET request with query parameters in the cURL tab', () => {
    cy.api({
      method: 'GET',
      url: '/',
      qs: {
        page: '1',
        limit: '10',
        search: 'test query'
      }
    })

    cy.get('[data-cy="requestPanel"]')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="curl-tab"]')
          .should('be.visible')
          .click()

        cy.get('[data-cy="curl"]')
          .should('exist')
          .should('be.visible')
          .should('contain', 'curl -X GET')
          .should('contain', `${Cypress.config('baseUrl')}/`)
      })
  })

  it('displays cURL for POST request with body in the cURL tab', () => {
    const requestBody = { hello: 'world', number: 123 }

    cy.api('POST', '/', requestBody)

    cy.get('[data-cy="requestPanel"]')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="curl-tab"]')
          .should('be.visible')
          .click()

        cy.get('[data-cy="curl"]')
          .should('exist')
          .should('be.visible')
          .should('contain', 'curl -X POST')
          .should('contain', `-d '${JSON.stringify(requestBody)}'`)
          .should('contain', `${Cypress.config('baseUrl')}/`)
      })
  })

  it('displays cURL for PUT request with body in the cURL tab', () => {
    const requestBody = { id: 1, name: 'Updated Item' }

    cy.api('PUT', '/', requestBody)

    cy.get('[data-cy="requestPanel"]')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="curl-tab"]')
          .should('be.visible')
          .click()

        cy.get('[data-cy="curl"]')
          .should('exist')
          .should('be.visible')
          .should('contain', 'curl -X PUT')
          .should('contain', `-d '${JSON.stringify(requestBody)}'`)
      })
  })

  it('displays cURL for PATCH request with body in the cURL tab', () => {
    const requestBody = { status: 'active' }

    cy.api('PATCH', '/', requestBody)

    cy.get('[data-cy="requestPanel"]')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="curl-tab"]')
          .should('be.visible')
          .click()

        cy.get('[data-cy="curl"]')
          .should('exist')
          .should('be.visible')
          .should('contain', 'curl -X PATCH')
          .should('contain', `-d '${JSON.stringify(requestBody)}'`)
      })
  })

  it('displays cURL for DELETE request in the cURL tab', () => {
    cy.api('DELETE', '/')

    cy.get('[data-cy="requestPanel"]')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="curl-tab"]')
          .should('be.visible')
          .click()

        cy.get('[data-cy="curl"]')
          .should('exist')
          .should('be.visible')
          .should('contain', 'curl -X DELETE')
          .should('contain', `${Cypress.config('baseUrl')}/`)
          .should('not.contain', '-d')
      })
  })

  it('displays cURL with custom headers in the cURL tab', () => {
    Cypress.env('hideCredentials', false)

    cy.api({
      method: 'POST',
      url: '/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
        'X-Custom-Header': 'custom-value'
      },
      body: { test: 'data' }
    })

    cy.get('[data-cy="requestPanel"]')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="curl-tab"]')
          .should('be.visible')
          .click()

        cy.get('[data-cy="curl"]')
          .should('exist')
          .should('be.visible')
          .should('contain', 'curl -X POST')
          .should('contain', '-H "Content-Type: application/json"')
          .should('contain', '-H "Authorization: Bearer token123"')
          .should('contain', '-H "X-Custom-Header: custom-value"')
      })
  })

  it('displays cURL with query parameters and headers in the cURL tab', () => {
    cy.api({
      method: 'GET',
      url: '/',
      qs: {
        filter: 'active',
        sort: 'name'
      },
      headers: {
        Accept: 'application/json'
      }
    })

    cy.get('[data-cy="requestPanel"]')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="curl-tab"]')
          .should('be.visible')
          .click()

        cy.get('[data-cy="curl"]')
          .should('exist')
          .should('be.visible')
          .should('contain', 'curl -X GET')
          .should('contain', '-H "Accept: application/json"')
      })
  })

  it('displays cURL with string body in the cURL tab', () => {
    const stringBody = 'plain text body'

    cy.api({
      method: 'POST',
      url: '/',
      body: stringBody
    })

    cy.get('[data-cy="requestPanel"]')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="curl-tab"]')
          .should('be.visible')
          .click()

        cy.get('[data-cy="curl"]')
          .should('exist')
          .should('be.visible')
          .should('contain', 'curl -X POST')
          .should('contain', `-d '${stringBody}'`)
      })
  })

  it('displays different cURL for multiple requests - each tab shows its own request cURL', () => {
    cy.api('GET', '/')
    cy.api('POST', '/', { first: 'request' })
    cy.api('PUT', '/', { second: 'request' })

    cy.get('[data-cy="requestPanel"]')
      .should('have.length', 3)

    // Panel 0 (GET)
    cy.get('[data-cy="requestPanel"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="curl-tab"]').click({ force: true })
        cy.wait(100)
        cy.get('[data-cy="curl"]')
          .should('exist')
          .scrollIntoView()
          .should('be.visible')
          .should('contain', 'curl -X GET')
          .should('not.contain', '-d')
      })

    // Panel 1 (POST)
    cy.get('[data-cy="requestPanel"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="curl-tab"]').click({ force: true })
        cy.wait(100)
        cy.get('[data-cy="curl"]')
          .should('exist')
          .scrollIntoView()
          .should('be.visible')
          .should('contain', 'curl -X POST')
          .should('contain', `-d '${JSON.stringify({ first: 'request' })}'`)
      })

    // Panel 2 (PUT)
    cy.get('[data-cy="requestPanel"]')
      .eq(2)
      .within(() => {
        cy.get('[data-cy="curl-tab"]').click({ force: true })
        cy.wait(100)
        cy.get('[data-cy="curl"]')
          .should('exist')
          .scrollIntoView()
          .should('be.visible')
          .should('contain', 'curl -X PUT')
          .should('contain', `-d '${JSON.stringify({ second: 'request' })}'`)
      })

    // Switch back to panel 1 and verify its cURL is unchanged
    cy.get('[data-cy="requestPanel"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="curl-tab"]').click({ force: true })
        cy.wait(100)
        cy.get('[data-cy="curl"]')
          .should('exist')
          .scrollIntoView()
          .should('be.visible')
          .should('contain', 'curl -X POST')
          .should('contain', `-d '${JSON.stringify({ first: 'request' })}'`)
          .should('not.contain', 'second')
          .should('not.contain', 'third')
      })
  })

  describe('Hiding credentials in cURL', () => {
    before(() => {
      Cypress.env('hideCredentials', true)
    })

    it('hides authorization header in cURL', () => {
      cy.api({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer secret-token-123'
        }
      })

      cy.get('[data-cy="requestPanel"]')
        .first()
        .should('be.visible')
        .within(() => {
          cy.get('[data-cy="curl-tab"]').click({ force: true })
          cy.get('[data-cy="curl"]')
            .should('exist')
            .scrollIntoView()
            .should('be.visible')
            .should('contain', 'curl -X POST')
            .should('contain', '-H "authorization:')
            .should('contain', '****')
            .should('not.contain', 'secret-token-123')
        })
    })

    it('hides auth credentials in cURL', () => {
      cy.api({
        method: 'POST',
        url: '/',
        auth: {
          user: 'admin',
          pass: 'secret'
        }
      })

      cy.get('[data-cy="requestPanel"]')
        .first()
        .should('be.visible')
        .within(() => {
          cy.get('[data-cy="curl-tab"]').click({ force: true })

          cy.get('[data-cy="curl"]')
            .should('exist')
            .scrollIntoView()
            .should('be.visible')
            .should('contain', 'curl -X POST')
            .should('contain', '-u')
            .should('contain', '*****')
            .should('contain', '******')
            .should('not.contain', 'admin')
            .should('not.contain', 'secret')
        })
    })

    it('hides password in request body in cURL', () => {
      cy.api({
        method: 'POST',
        url: '/',
        body: {
          username: 'user',
          password: 'secret123'
        }
      })

      cy.get('[data-cy="requestPanel"]')
        .first()
        .should('be.visible')
        .within(() => {
          cy.get('[data-cy="curl-tab"]').click({ force: true })

          cy.get('[data-cy="curl"]')
            .should('exist')
            .scrollIntoView()
            .should('be.visible')
            .should('contain', 'curl -X POST')
            .should('contain', '-d')
            .should('contain', 'password')
            .should('contain', '****')
            .should('not.contain', 'secret123')
        })
    })

    it('hides credentials in query parameters in cURL', () => {
      cy.api({
        method: 'GET',
        url: '/',
        qs: {
          apiKey: 'secret-key-123',
          token: 'my-token'
        }
      })

      cy.get('[data-cy="requestPanel"]')
        .first()
        .should('be.visible')
        .within(() => {
          cy.get('[data-cy="curl-tab"]').click({ force: true })

          cy.get('[data-cy="curl"]')
            .should('exist')
            .scrollIntoView()
            .should('be.visible')
            .should('contain', 'curl -X GET')
            .should('contain', 'apiKey')
            .should('contain', 'token')
        })
    })
  })

  describe('Showing credentials in cURL when hideCredentials is false', () => {
    before(() => {
      Cypress.env('hideCredentials', false)
    })

    it('shows authorization header in cURL', () => {
      cy.api({
        method: 'POST',
        url: '/',
        headers: {
          authorization: 'Bearer visible-token-123'
        }
      })

      cy.get('[data-cy="requestPanel"]')
        .first()
        .should('be.visible')
        .within(() => {
          cy.get('[data-cy="curl-tab"]').click({ force: true })
          cy.wait(100)

          cy.get('[data-cy="curl"]')
            .should('exist')
            .scrollIntoView()
            .should('be.visible')
            .should('contain', 'curl -X POST')
            .should('contain', '-H "authorization: Bearer visible-token-123"')
            .should('not.contain', '****')
        })
    })
  })

  it('allows text selection in cURL CodeBlock when section is highlighted from assertion', () => {
    cy.api('POST', '/', { test: 'data' })

    cy.get('[data-cy="requestBody"]')
      .should('contain', 'test')
      .click()

    cy.get('section')
      .first()
      .then(($section) => {
        $section[0].classList.add('__cypress-highlight')
      })

    cy.get('[data-cy="requestPanel"]')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="curl-tab"]').click({ force: true })

        cy.get('[data-cy="curl"]')
          .should('exist')
          .should('be.visible')
          .scrollIntoView()

        // The cURL block is user-select: all; here we just assert it contains curl text.
        cy.get('[data-cy="curl"] pre')
          .should('exist')
          .should('be.visible')
          .invoke('text')
          .should('contain', 'curl')
      })
  })
})

