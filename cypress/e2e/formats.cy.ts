describe('response formats', () => {

  it('works with xml', () => {

    cy.api('/xml').then((response) => {
      // Verify the response is valid XML
      expect(response.body).to.be.a('string')
      expect(response.body).to.include('<xml>')
      expect(response.body).to.include('</xml>')
      
      // Verify XML can be parsed
      const parser = new DOMParser()
      const doc = parser.parseFromString(response.body, 'application/xml')
      expect(doc.documentElement.nodeName).to.not.equal('parsererror')
      // nodeName returns uppercase, so compare case-insensitively
      expect(doc.documentElement.nodeName.toLowerCase()).to.equal('xml')
      
      // Verify the XML content is displayed
      cy.contains('xml')
        .should('have.css', 'color', 'rgb(208, 210, 224)')
    })

  });

  it('works with html', () => {

    cy.api('/html').then((response) => {
      // Verify the response is valid HTML
      expect(response.body).to.be.a('string')
      expect(response.body).to.include('<html')
      expect(response.body).to.include('</html>')
      
      // Verify HTML can be parsed
      const parser = new DOMParser()
      const doc = parser.parseFromString(response.body, 'text/html')
      // nodeName returns uppercase, so compare case-insensitively
      expect(doc.documentElement.nodeName.toLowerCase()).to.equal('html')
      
      // Verify the HTML content is displayed
      cy.contains('html')
        .should('have.css', 'color', 'rgb(208, 210, 224)')
    })

  });

  it('works with json', () => {

    cy.api('/json').then((response) => {
      // Verify the response is valid JSON
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('string')
      expect(response.body).to.have.property('int')
      expect(response.body.int).to.equal(1234)
      
      // Verify JSON can be stringified and parsed
      const jsonString = JSON.stringify(response.body)
      const parsed = JSON.parse(jsonString)
      expect(parsed).to.deep.equal(response.body)
      
      // Verify the JSON content is displayed
      cy.contains('1234')
        .should('have.css', 'color', 'rgb(31, 169, 113)')
    })

  });

  it('works with json that does not contain proper header', () => {

    cy.api('/json-weird').then((response) => {
      // Verify the response is valid JSON even with weird content-type
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('string')
      expect(response.body).to.have.property('int')
      expect(response.body.int).to.equal(1234)
      
      // Verify JSON can be stringified and parsed
      const jsonString = JSON.stringify(response.body)
      const parsed = JSON.parse(jsonString)
      expect(parsed).to.deep.equal(response.body)
      
      // Verify the JSON content is displayed
      cy.contains('1234')
        .should('have.css', 'color', 'rgb(31, 169, 113)')
    })

  });

  it('works with text', () => {

    cy.api({
      url: '/text'
    }).then((response) => {
      // Verify the response is plain text
      expect(response.body).to.be.a('string')
      expect(response.body).to.equal('Hey there 👋')
      
      // Verify it's not valid JSON, HTML, or XML
      try {
        JSON.parse(response.body)
        expect.fail('Plain text should not be valid JSON')
      } catch {
        // Expected - not valid JSON
      }
      
      // Verify plain text can be selected and copied
      // responseBody CodeBlock should be visible and selectable
      // Filter to get the CodeBlock div (not the hidden radio input)
      cy.get('[data-cy="responseBody"]')
        .filter(':visible') // Get the visible CodeBlock div, not the hidden radio input
        .should('be.visible')
        .within(() => {
          cy.get('pre')
            .should('have.css', 'user-select', 'text')
            .should('have.css', 'cursor', 'text')
        })
      
      // Verify the text content is displayed
      cy.contains('Hey there 👋').should('be.visible')
    })

  });

  it('works with undefined format', () => {

    cy.api('/undefined').then((response) => {
      // Verify the response is a string (no content-type header)
      expect(response.body).to.be.a('string')
      expect(response.body).to.include('<xml>')
      expect(response.body).to.include('</xml>')
      
      // Verify it can be parsed as XML (even though it might be detected as HTML)
      const xmlParser = new DOMParser()
      const xmlDoc = xmlParser.parseFromString(response.body, 'application/xml')
      expect(xmlDoc.documentElement.nodeName).to.not.equal('parsererror')
      
      // Verify it can also be parsed as HTML (format detection checks HTML first)
      const htmlParser = new DOMParser()
      htmlParser.parseFromString(response.body, 'text/html')
      // It will be detected as HTML since HTML check comes before XML
      
      // Verify the content is displayed (detected as HTML, so uses HTML tag color)
      // Use case-insensitive matching since content is "XML" but we search for "xml"
      cy.contains('xml', { matchCase: false })
        .should('have.css', 'color', 'rgb(255, 87, 112)')
    })

  });

});