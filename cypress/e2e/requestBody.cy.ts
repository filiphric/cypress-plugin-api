/// <reference types="cypress" />
/// <reference types="../../dist/types" />

describe('Request Body Display', () => {

  it('displays JSON object in request body', () => {
    const jsonBody = {
      name: 'John Doe',
      age: 30,
      active: true
    }

    cy.api({
      method: 'POST',
      url: '/',
      body: jsonBody
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '"name": "John Doe"')
            .and('contain', '"age": 30')
            .and('contain', '"active": true')
        })
    })
  })

  it('displays JSON array in request body', () => {
    const arrayBody = [1, 2, 3, 'test', { key: 'value' }]

    cy.api({
      method: 'POST',
      url: '/',
      body: arrayBody
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '1,')
            .and('contain', '2,')
            .and('contain', '3,')
            .and('contain', '"test"')
            .and('contain', '"key": "value"')
        })
    })
  })

  it('displays empty object {} in request body on single line', () => {
    const emptyObject = {}

    cy.api({
      method: 'POST',
      url: '/',
      body: emptyObject
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre').then(($pre) => {
            const text = $pre[0].textContent || $pre[0].innerText || ''
            expect(text).to.match(/\{\s*\}/)
            expect(text).not.to.match(/\{\s*\n\s*\}/)
          })
        })
    })
  })

  it('displays empty array [] in request body on single line', () => {
    const emptyArray: any[] = []

    cy.api({
      method: 'POST',
      url: '/',
      body: emptyArray
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre').then(($pre) => {
            const text = $pre[0].textContent || $pre[0].innerText || ''
            expect(text).to.match(/\[\s*\]/)
            expect(text).not.to.match(/\[\s*\n\s*\]/)
          })
        })
    })
  })

  it('displays nested JSON with empty arrays and objects', () => {
    const nestedBody = {
      items: [],
      metadata: {},
      data: {
        empty: {},
        list: []
      }
    }

    cy.api({
      method: 'POST',
      url: '/',
      body: nestedBody
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre').then(($pre) => {
            const text = $pre[0].textContent || $pre[0].innerText || ''
            expect(text).to.include('"items": []')
            expect(text).to.include('"metadata": {}')
            expect(text).to.include('"empty": {}')
            expect(text).to.include('"list": []')
            expect(text).not.to.match(/\[\s*\n\s*\]/)
            expect(text).not.to.match(/\{\s*\n\s*\}/)
          })
        })
    })
  })

  it('displays string in request body', () => {
    const stringBody = 'This is a plain text request body'

    cy.api({
      method: 'POST',
      url: '/',
      body: stringBody,
      headers: {
        'Content-Type': 'text/plain'
      }
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', stringBody)
        })
    })
  })

  it('displays FormData in request body as JSON', () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('age', '30')

    cy.api({
      method: 'POST',
      url: '/upload',
      body: formData
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '"name": "John Doe"')
            .and('contain', '"email": "john@example.com"')
            .and('contain', '"age": "30"')
        })
    })
  })

  it('displays FormData with file in request body as JSON', () => {
    cy.fixture('test.html', 'binary')
      .then(file => Cypress.Blob.binaryStringToBlob(file, 'text/html'))
      .then(blob => {
        const formData = new FormData()
        formData.append('file', blob, 'test.html')
        formData.append('domain', 'default')

        cy.api({
          method: 'POST',
          url: '/upload',
          body: formData
        }).then(() => {
          cy.get('[data-cy="requestBody"]')
            .should('be.visible')
            .within(() => {
              cy.get('pre')
                .should('be.visible')
                .and('contain', '"file":')
                .and('contain', '[File:')
                .and('contain', 'test.html')
                .and('contain', '"domain": "default"')
            })
        })
      })
  })

  it('displays URL-encoded form data in request body as JSON', () => {
    const urlEncodedBody = 'name=John+Doe&email=john%40example.com&role=admin'

    cy.api({
      method: 'POST',
      url: '/',
      body: urlEncodedBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '"name": "John Doe"')
            .and('contain', '"email": "john@example.com"')
            .and('contain', '"role": "admin"')
        })
    })
  })

  it('displays ArrayBuffer in request body', () => {
    const requestContent = 'ArrayBuffer request body content'
    const encoder = new TextEncoder()
    const arrayBuffer = encoder.encode(requestContent).buffer

    cy.api({
      method: 'POST',
      url: '/arraybuffer-request',
      body: arrayBuffer,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', requestContent)
        })
    })
  })

  it('displays complex nested JSON structure in request body', () => {
    const complexBody = {
      user: {
        name: 'John',
        contacts: {
          email: 'john@example.com',
          phones: ['123-456-7890', '098-765-4321']
        },
        tags: []
      },
      metadata: {
        created: '2024-01-01',
        updated: '2024-01-02',
        empty: {}
      },
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ],
      emptyArray: []
    }

    cy.api({
      method: 'POST',
      url: '/',
      body: complexBody
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '"name": "John"')
            .and('contain', '"email": "john@example.com"')
            .and('contain', '"tags": []')
            .and('contain', '"empty": {}')
            .and('contain', '"emptyArray": []')
            .and('contain', '"id": 1')
            .and('contain', '"id": 2')
        })
    })
  })

  it('displays request body tab when body exists', () => {
    cy.api({
      method: 'POST',
      url: '/',
      body: { test: 'data' }
    }).then(() => {
      cy.get('[data-cy="requestPanel"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-cy="showRequestBody"]')
            .should('exist')
          cy.get('label[for*="requestBody"]')
            .should('be.visible')
            .and('contain', 'Body')
        })
    })
  })

  it('displays request body content is visible and formatted', () => {
    const jsonBody = {
      string: 'test',
      number: 123,
      boolean: true,
      nullValue: null,
      array: [1, 2, 3],
      object: { nested: 'value' }
    }

    cy.api({
      method: 'POST',
      url: '/',
      body: jsonBody
    }).then(() => {
      cy.get('[data-cy="requestBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '"string": "test"')
            .and('contain', '"number": 123')
            .and('contain', '"boolean": true')
            .and('contain', '"nullValue": null')
            .and('contain', '"array": [')
            .and('contain', '"object": {')
            .and('contain', '"nested": "value"')
        })
    })
  })

})
