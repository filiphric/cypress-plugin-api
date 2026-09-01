const methods = [{
  method: 'HEAD',
  color: 'rgb(237, 187, 74)'
},
{
  method: 'GET',
  color: 'rgb(100, 112, 243)'
},
{
  method: 'POST',
  color: 'rgb(31, 169, 113)'
},
{
  method: 'PUT',
  color: 'rgb(31, 169, 113)'
},
{
  method: 'PATCH',
  color: 'rgb(219, 121, 5)'
},
{
  method: 'DELETE',
  color: 'rgb(255, 87, 112)'
}]

const getReporterDocument = () => {
  const reporterFrame = top?.document.querySelector('#reporter-frame') as HTMLIFrameElement | null

  if (reporterFrame?.contentDocument) {
    return reporterFrame.contentDocument
  }

  return top?.document
}

const findInReporter = (selector: string) => {
  const reporterDoc = getReporterDocument()

  return Cypress.$(selector, reporterDoc)
}

describe('api methods', () => {

  it(`works with basic methods`, () => {

    methods.forEach(({ method }) => {
      cy.api({
        method,
        url: '/'
      })
    });

    methods.forEach(({ color }, i) => {
      cy.get('[data-cy=method]')
        .eq(i)
        .should('have.css', 'color', color)
    });

    cy.then(() => {
      const reporterDoc = getReporterDocument()
      expect(reporterDoc?.querySelectorAll('#api-plugin-timeline-styles'))
        .to.have.length(1)
    })

    cy.then(() => findInReporter('.command-name-GET .command-method').last())
      .should('have.css', 'background-color', methods[1].color)

  })

});
