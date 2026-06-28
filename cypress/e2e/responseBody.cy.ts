/// <reference types="cypress" />
/// <reference types="../../dist/types" />

describe('Response Body Display', () => {

  it('displays JSON object in response body', () => {
    cy.api('/json').then((response) => {
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('string')
      expect(response.body).to.have.property('int')
      
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '"string": "string"')
            .and('contain', '"int": 1234')
        })
    })
  })

  it('displays JSON array in response body', () => {
    cy.api({
      method: 'POST',
      url: '/',
      body: { items: [1, 2, 3] }
    }).then((response) => {
      expect(response.body).to.have.property('object')
      expect(response.body.object).to.have.property('array')
      
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '"array": [')
            .and('contain', '1,')
            .and('contain', '2')
        })
    })
  })

  it('displays empty object {} in response body on single line', () => {
    cy.api('/empty-object').then((response) => {
      expect(response.body).to.deep.equal({})
      
      cy.get('[data-cy="responseBody"]')
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

  it('displays empty array [] in response body on single line', () => {
    cy.api('/empty-array').then((response) => {
      expect(response.body).to.deep.equal([])
      
      cy.get('[data-cy="responseBody"]')
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

  it('displays nested JSON with empty arrays and objects in response', () => {
    cy.api('/nested-empty').then((response) => {
      expect(response.body).to.have.property('items')
      expect(response.body).to.have.property('metadata')
      expect(response.body).to.have.property('data')
      expect(response.body.items).to.deep.equal([])
      expect(response.body.metadata).to.deep.equal({})
      
      cy.get('[data-cy="responseBody"]')
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

  it('displays ArrayBuffer in response body', () => {
    cy.api({
      method: 'GET',
      url: '/arraybuffer-response'
    }).then((response) => {
      let responseText: string
      
      if (response.body instanceof ArrayBuffer) {
        const dec = new TextDecoder()
        responseText = dec.decode(response.body)
      } else if (typeof response.body === 'string') {
        responseText = response.body
      } else {
        responseText = String(response.body)
      }
      
      expect(responseText).to.include('This is an ArrayBuffer response')
      
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', 'This is an ArrayBuffer response')
        })
    })
  })

  it('displays HTML in response body', () => {
    cy.api('/html').then((response) => {
      expect(response.body).to.include('<!DOCTYPE html>')
      expect(response.body).to.include('<html')
      
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '<!DOCTYPE html>')
            .and('contain', '<html')
            .and('contain', '</html>')
        })
    })
  })

  it('displays XML in response body', () => {
    cy.api('/xml').then((response) => {
      expect(response.body).to.include('<xml>')
      expect(response.body).to.include('</xml>')
      
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '<xml>XML</xml>')
        })
    })
  })

  it('displays plain text in response body', () => {
    cy.api('/text').then((response) => {
      expect(response.body).to.equal('Hey there 👋')
      
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', 'Hey there 👋')
        })
    })
  })

  it('displays empty response body as "(No content)"', () => {
    cy.api('/empty').then((response) => {
      expect(response.status).to.equal(204)
      
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.contains('(No content)')
            .should('be.visible')
        })
    })
  })

  it('displays complex nested JSON structure in response body', () => {
    cy.api({
      method: 'POST',
      url: '/json-with-commas',
      body: {
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
    }).then(() => {
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '"message": "Response with commas"')
            .and('contain', '"data": {')
            .and('contain', '"items": [')
            .and('contain', '1,')
            .and('contain', '2,')
            .and('contain', '3')
            .and('contain', '"nested": {')
        })
    })
  })

  it('displays response body tab when body exists', () => {
    cy.api('/json').then(() => {
      cy.get('[data-cy="responsePanel"]')
        .should('be.visible')
        .within(() => {
          cy.get('[data-cy="showResponseBody"]')
            .should('exist')
          cy.get('label[for*="responseBody"]')
            .should('be.visible')
            .and('contain', 'Response')
        })
    })
  })

  it('displays response body content is visible and formatted', () => {
    cy.api('/json').then((response) => {
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('string')
      expect(response.body).to.have.property('int')
      expect(response.body).to.have.property('object')
      
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', '"string": "string"')
            .and('contain', '"int": 1234')
            .and('contain', '"object": {')
            .and('contain', '"array": [')
        })
    })
  })

  it('displays response with empty arrays and objects in nested structure', () => {
    cy.api({
      method: 'POST',
      url: '/',
      body: {
        test: 'data',
        emptyObj: {},
        emptyArr: [],
        nested: {
          empty: {},
          list: []
        }
      }
    }).then(() => {
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre').then(($pre) => {
            const text = $pre[0].textContent || $pre[0].innerText || ''
            expect(text).to.include('"object": {')
            expect(text).to.include('"array": [')
            expect(text).not.to.match(/\[\s*\n\s*\]/)
            expect(text).not.to.match(/\{\s*\n\s*\}/)
          })
        })
    })
  })

  it('displays JSON with empty arrays and objects from server response', () => {
    cy.api({
      method: 'POST',
      url: '/json-with-commas',
      body: {
        response: {
          items: [],
          metadata: {},
          data: {
            empty: {},
            list: []
          }
        }
      }
    }).then(() => {
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre').then(($pre) => {
            const text = $pre[0].textContent || $pre[0].innerText || ''
            expect(text).to.include('"items": [')
            expect(text).to.include('1,')
            expect(text).to.include('2,')
            expect(text).to.include('3')
            expect(text).to.include('"nested": {')
            expect(text).to.include('"array": [')
            expect(text).to.include('4,')
            expect(text).to.include('5')
            expect(text).not.to.match(/\[\s*\n\s*\]/)
            expect(text).not.to.match(/\{\s*\n\s*\}/)
          })
        })
    })
  })

  it('displays binary response decoded correctly', () => {
    cy.api({
      method: 'GET',
      url: '/arraybuffer-response'
    }).then((response) => {
      let responseText: string
      
      if (response.body instanceof ArrayBuffer) {
        const dec = new TextDecoder()
        responseText = dec.decode(response.body)
      } else if (typeof response.body === 'string') {
        responseText = response.body
      } else {
        responseText = String(response.body)
      }
      
      expect(responseText).to.include('This is an ArrayBuffer response')
      
      cy.get('[data-cy="responseBody"]')
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('be.visible')
            .and('contain', 'This is an ArrayBuffer response')
        })
      
      cy.contains('200').should('be.visible')
      cy.contains('Response').should('be.visible')
    })
  })

})
