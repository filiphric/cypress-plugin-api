describe('Hiding credentials', { env: { 'hideCredentials': true } }, () => {

  it('hides authorization in headers', () => {

    cy.api({
      method: 'POST',
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
      method: 'POST',
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
      method: 'POST',
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

describe('Hiding credentials by defining them', () => {

  it('hides authorization in headers', {
    env: {
      hideCredentials: true,
      hideCredentialsOptions: {
        headers: ['authorization']
      }
    }
  }, () => {

    cy.api({
      method: 'POST',
      url: '/auth',
      headers: {
        authorization: 'abcd',
        accept: 'application/json'
      }
    })

    cy.get('[data-cy="requestHeaders"]')
      .should('contain', '****')
      .should('not.contain', 'abcd')
      .should('contain', 'accept')
      .should('contain', 'application/json')

  });

  it('hides credentials in auth', {
    env: {
      hideCredentials: true,
      hideCredentialsOptions: {
        auth: ['user']
      }
    }
  }, () => {

    cy.api({
      method: 'POST',
      url: '/auth',
      auth: {
        user: 'admin',
        pass: 'secret'
      }
    })

    cy.get('[data-cy="auth"]')
      .should('contain', '*****')
      .should('not.contain', 'admin')
      .should('contain', 'pass')
      .should('contain', 'secret')

  });

  it('hides credentials in body', {
    env: {
      hideCredentials: true,
      hideCredentialsOptions: {
        body: ['password']
      }
    }
  }, () => {

    cy.api({
      method: 'POST',
      url: '/',
      body: {
        password: 'secret'
      }
    })

    cy.get('[data-cy="requestBody"]')
      .should('contain', '******')
      .should('contain', 'password')

  });

});

describe('Showing credentials', () => {

  it('shows authorization in headers', () => {

    cy.api({
      method: 'POST',
      url: '/auth',
      headers: {
        authorization: 'abcd'
      }
    })

    cy.get('[data-cy="requestHeaders"]')
      .should('contain', 'abcd')
      .should('not.contain', '****')

  });

  it('shows credentials in auth', () => {

    cy.api({
      method: 'POST',
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
