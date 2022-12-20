export const getState = () => {
  // @ts-ignore cy.state() has no type definitions
  const doc: Document = cy.state('document');
  // @ts-ignore cy.state() has no type definitions
  const attempt: number = cy.state('runnable')._currentRetry
  // @ts-ignore cy.state() has no type definitions
  const testId: string = cy.state('test').id
  return { doc, attempt, testId }
}