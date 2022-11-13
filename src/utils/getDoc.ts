export const getDoc = () => {
  // @ts-ignore cy.state() has no type definitions
  const doc: Document = cy.state('document');
  return doc
}