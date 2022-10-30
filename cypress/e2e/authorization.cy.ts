describe('Hiding credentials', { env: { 'hideCredentials': true } }, () => {

  it('hides authorization in headers', () => {

    cy.api({
      url: '/',
      headers: {
        authorization: 'Bearer 1234'
      }
    })

    cy.get('[data-cy="requestHeaders"]')
      .should('contain', '***********')
      .should('not.contain', 'Bearer 1234')

  });

  it('hides credentials in auth', () => {

    cy.api({
      url: '/',
      auth: {
        user: 'admin',
        pass: 'secret'
      }
    })

    cy.get('[data-cy="auth"]')
      .should('contain', '*****')
      .should('not.contain', 'admin')
      .should('contain', '******')
      .should('not.contain', 'secret')

  });

});

describe('Showing credentials', () => {

  it('hides authorization in headers', () => {

    cy.api({
      url: '/',
      headers: {
        authorization: 'Bearer 1234'
      }
    })

    cy.get('[data-cy="requestHeaders"]')
      .should('contain', 'Bearer 1234')
      .should('not.contain', '***********')

  });

  it('hides credentials in auth', () => {

    cy.api({
      url: '/',
      auth: {
        user: 'admin',
        pass: 'secret'
      }
    })

    cy.get('[data-cy="auth"]')
      .should('contain', 'admin')
      .should('not.contain', '*****')
      .should('contain', 'secret')
      .should('not.contain', '******')

  });

});
