describe('Hiding credentials', { env: { 'hideCredentials': true } }, () => {

  it('hides authorization in headers', () => {

    cy.api({
      url: '/auth',
      headers: {
        authorization: 'abcd'
      }
    })

    cy.get('[data-cy="requestHeaders"]')
      .should('contain', '****')
      .should('not.contain', 'abcd')

  });

  it('hides Authorization (Title case) in headers', () => {

    cy.api({
      url: '/auth',
      headers: {
        Authorization: 'abcd'
      }
    })

    cy.get('[data-cy="requestHeaders"]')
      .should('contain', '****')
      .should('not.contain', 'abcd')

  });

  it('hides credentials in auth', () => {

    cy.api({
      url: '/auth',
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
      url: '/auth',
      headers: {
        authorization: 'abcd'
      }
    })

    cy.get('[data-cy="requestHeaders"]')
      .should('contain', 'abcd')
      .should('not.contain', '****')

  });

  it('hides credentials in auth', () => {

    cy.api({
      url: '/auth',
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
