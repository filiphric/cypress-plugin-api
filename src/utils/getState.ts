export const getState = () => {
  // @ts-ignore cy.state() has no type definitions
  const doc: Document = cy.state('document');
  // @ts-ignore cy.state() has no type definitions
  const attempt: number = cy.state('runnable')._currentRetry
  return { doc, attempt }
}