describe('UI panels', () => {

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

  // These tests verify that when a request has headers/query/body,
  // the corresponding panel in RequestPanel.vue is visible and
  // displays the data.

  it('shows request headers panel when request has headers', () => {
    cy.api({
      method: 'GET',
      url: '/',
      headers: {
        'X-API-Key': 'my-secret-api-key-12345',
      },
    }).then(() => {
      cy.get('[data-cy="requestPanel"]')
        .last()
        .within(() => {
          cy.get('[data-cy="requestHeaders"]')
            .should('be.visible')
            .within(() => {
              cy.get('pre')
                .should('be.visible')
                .and('contain', 'X-API-Key')
                .and('contain', 'my-secret-api-key-12345');
            });
        });
    });
  });

  it('shows query panel when request has query string', () => {
    cy.api({
      method: 'GET',
      url: '/',
      qs: {
        search: 'cypress-plugin',
      },
    }).then(() => {
      cy.get('[data-cy="requestPanel"]')
        .last()
        .within(() => {
          cy.get('[data-cy="query"]')
            .should('be.visible')
            .within(() => {
              cy.get('pre')
                .should('be.visible')
                .and('contain', 'search')
                .and('contain', 'cypress-plugin');
            });
        });
    });
  });

  it('shows request body panel when request has body', () => {
    const body = {
      message: 'Headers and body should be visible',
      flag: true,
    };

    cy.api({
      method: 'POST',
      url: '/',
      body,
    }).then(() => {
      cy.get('[data-cy="requestPanel"]')
        .last()
        .within(() => {
          cy.get('[data-cy="requestBody"]')
            .should('be.visible')
            .within(() => {
              cy.get('pre')
                .should('be.visible')
                .and('contain', '"message": "Headers and body should be visible"')
                .and('contain', '"flag": true');
            });
        });
    });
  });

});