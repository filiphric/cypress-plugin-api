export const getContainer = () => {
  // @ts-ignore
  const doc: Document = cy.state('document');
  // @ts-ignore
  const win: Window = cy.state('window');
  return { win, doc };
}