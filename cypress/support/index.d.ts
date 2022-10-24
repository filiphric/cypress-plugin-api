declare namespace Cypress {
  interface Chainable {
    invokeCopyButton(blockSelector: string, copyButtonSelector: string): Chainable<any>
  }
}