/// <reference types="cypress" />
/// <reference types="../../dist/types" />

describe('binary response handling', () => {

  it('handles FormData file upload with cy.request() and requestMode - exact user scenario', { env: { requestMode: true } }, () => {
    const fileName = 'test.html';
    const type = 'text/html';
    const statusCode = 201;

    cy.fixture(fileName, 'binary')
      .then(file => Cypress.Blob.binaryStringToBlob(file, type))
      .then(blob => {
        const formData = new FormData();
        formData.append('file', blob, fileName);

        const httpOptions = {
          method: 'POST',
          url: '/upload',
          headers: {
            'Authorization': 'Bearer test-token',
            'content-type': 'multipart/form-data',
          },
          body: formData,
          failOnStatusCode: false,
        };

        cy.request(httpOptions).then(response => {
          const dec = new TextDecoder();
          let decodedBody: string;
          
          // Handle ArrayBuffer detection (same as plugin does)
          const bodyString = typeof response.body === 'object' && response.body !== null 
            ? Object.prototype.toString.call(response.body) 
            : '';
          const isArrayBuffer = response.body instanceof ArrayBuffer || bodyString === '[object ArrayBuffer]';
          
          if (isArrayBuffer) {
            const buffer = response.body instanceof ArrayBuffer 
              ? response.body 
              : (response.body as any).buffer || response.body;
            try {
              const uint8Array = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
              decodedBody = dec.decode(uint8Array);
            } catch {
              decodedBody = dec.decode(buffer);
            }
          } else if (typeof response.body === 'string') {
            decodedBody = response.body;
          } else {
            decodedBody = String(response.body);
            if (decodedBody === '[object ArrayBuffer]') {
              const buffer = (response.body as any).buffer || response.body;
              const uint8Array = new Uint8Array(buffer);
              decodedBody = dec.decode(uint8Array);
            }
          }
          
          response.body = decodedBody;
          
          expect(response.status, 'POST Response Status').to.equal(statusCode);
          
          // Verify the plugin displayed the response correctly in the UI
          // With requestMode enabled, cy.request() should show the UI
          cy.contains('201').should('be.visible');
          cy.contains('POST').should('be.visible');
          cy.contains('Response').should('be.visible');
          // The plugin should have decoded the ArrayBuffer, so content should be visible
          cy.contains('File uploaded successfully').should('be.visible');
        });
      });
  });

  it('handles FormData file upload with binary response - similar to user scenario', () => {
    const fileName = 'test.html';
    const fileType = 'text/html';

    cy.fixture('test.html', 'binary')
      .then(file => Cypress.Blob.binaryStringToBlob(file, fileType))
      .then(blob => {
        const formData = new FormData();
        formData.append('file', blob, fileName);

        cy.api({
          method: 'POST',
          url: '/upload',
          headers: {
            'Authorization': 'Bearer test-token',
            'content-type': 'multipart/form-data',
          },
          body: formData,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(201);
          
          // The key test: the plugin should handle the response without errors
          // Even if response.body is an ArrayBuffer, the plugin should decode it
          // and display it in the UI without throwing "cannot translate" errors
          
          // Verify the response is displayed in the UI without translation errors
          cy.contains('201').should('be.visible');
          cy.contains('Response').should('be.visible');
          
          // The plugin should have decoded any ArrayBuffer response, so the content should be visible
          // If the response was an ArrayBuffer, the plugin decoded it, so we should see the text
          cy.contains('File uploaded successfully').should('be.visible');
          
          const dec = new TextDecoder();
          let decodedBody: string;
          
          // Check if it's an ArrayBuffer using the same method as the plugin
          // This handles cross-realm issues in Cypress
          const bodyString = typeof response.body === 'object' && response.body !== null 
            ? Object.prototype.toString.call(response.body) 
            : '';
          const isArrayBuffer = response.body instanceof ArrayBuffer || bodyString === '[object ArrayBuffer]';
          
          if (isArrayBuffer) {
            // It's an ArrayBuffer - decode it
            // Handle both direct ArrayBuffer and wrapped ArrayBuffer
            const buffer = response.body instanceof ArrayBuffer 
              ? response.body 
              : (response.body as any).buffer || response.body;
            
            // Decode using Uint8Array to handle both cases
            try {
              const uint8Array = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
              decodedBody = dec.decode(uint8Array);
            } catch {
              decodedBody = dec.decode(buffer);
            }
          } else if (typeof response.body === 'string') {
            decodedBody = response.body;
          } else {
            // Fallback - convert to string
            decodedBody = String(response.body);
            
            // If String() returns "[object ArrayBuffer]", it's an ArrayBuffer that failed instanceof
            // This shouldn't happen if the plugin is working, but handle it anyway
            if (decodedBody === '[object ArrayBuffer]') {
              // The plugin should have decoded this, but if not, try to decode it manually
              // This is a fallback for the test
              const buffer = (response.body as any).buffer || response.body;
              try {
                const uint8Array = new Uint8Array(buffer);
                decodedBody = dec.decode(uint8Array);
              } catch {
                // This indicates the plugin might not be working correctly
                throw new Error('Response body is ArrayBuffer but could not be decoded. Plugin should have handled this.');
              }
            }
          }
          
          // Verify the decoded body contains the expected content
          // The plugin should have decoded it, so decodedBody should not be "[object ArrayBuffer]"
          expect(decodedBody).to.not.equal('[object ArrayBuffer]');
          expect(decodedBody).to.include('File uploaded successfully');
        });
      });
  });

  it('handles ArrayBuffer response body', () => {
    // Request binary data - Cypress may return it as ArrayBuffer or auto-decode to string
    cy.api({
      method: 'GET',
      url: '/binary',
    }).then((response) => {
      // Cypress may auto-decode binary responses to strings, or they may be ArrayBuffer
      // The plugin should handle both cases without errors
      let responseText: string;
      
      if (response.body instanceof ArrayBuffer) {
        // If it's an ArrayBuffer, decode it
        const dec = new TextDecoder();
        responseText = dec.decode(response.body);
      } else if (typeof response.body === 'string') {
        // Cypress auto-decoded it to a string
        responseText = response.body;
      } else {
        // Fallback - convert to string
        responseText = String(response.body);
      }
      
      expect(responseText).to.include('Binary content');
      
      // Verify the response is displayed in the UI without errors
      // The plugin should have handled the response (whether ArrayBuffer or string)
      // and displayed it correctly without "cannot translate" errors
      cy.contains('200').should('be.visible');
      cy.contains('Response').should('be.visible');
      cy.contains('Binary content').should('be.visible');
    });
  });

  it('handles already decoded binary response', () => {
    cy.api({
      method: 'GET',
      url: '/binary-decoded',
    }).then((response) => {
      // Response body is already a decoded string
      expect(response.body).to.be.a('string');
      expect(response.body).to.include('Decoded binary content');
      
      // Verify the response is displayed in the UI
      cy.contains('200').should('be.visible');
      cy.contains('Response').should('be.visible');
    });
  });

  it('still works with JSON object responses', () => {
    cy.api('/json').then((response) => {
      // Verify the response is valid JSON object
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('string');
      expect(response.body).to.have.property('int');
      expect(response.body.int).to.equal(1234);
      
      // Verify JSON can be stringified and parsed
      const jsonString = JSON.stringify(response.body);
      const parsed = JSON.parse(jsonString);
      expect(parsed).to.deep.equal(response.body);
      
      // Verify the JSON content is displayed correctly in the UI
      cy.contains('1234')
        .should('have.css', 'color', 'rgb(31, 169, 113)');
      
      // Verify JSON formatting is preserved
      cy.contains('"int":').should('be.visible');
      cy.contains('"string":').should('be.visible');
    });
  });

  it('handles JSON string responses', () => {
    // Some APIs return JSON as a string instead of an object
    cy.api({
      method: 'GET',
      url: '/json',
      headers: {
        'Accept': 'application/json'
      }
    }).then((response) => {
      // Response should be an object (Cypress auto-parses JSON)
      expect(response.body).to.be.an('object');
      
      // Verify it's displayed correctly
      cy.contains('200').should('be.visible');
      cy.contains('Response').should('be.visible');
    });
  });

});
