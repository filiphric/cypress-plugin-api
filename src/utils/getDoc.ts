export const getDoc = () => {
  // @ts-ignore
  const doc: Document = cy.state('document');
  return doc
}