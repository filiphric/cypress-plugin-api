export { }
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command for sending http requests and displaying results in Cypress App
       * @param options 
       */
      api<T>(options: Partial<Cypress.RequestOptions>): Chainable<Response<T>>
    }
  }
}