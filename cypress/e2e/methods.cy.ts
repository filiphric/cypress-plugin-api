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

const BASE_STYLE_ID = 'api-plugin-styles'
const TIMELINE_STYLE_ID = 'api-plugin-timeline-styles'
const STYLE_OWNER_SELECTOR = 'style[data-cypress-plugin-api-style="true"]'

const getReporterDocument = () => {
  const reporterFrame = top?.document.querySelector('#reporter-frame') as HTMLIFrameElement | null

  if (reporterFrame?.contentDocument) {
    return reporterFrame.contentDocument
  }

  return top?.document
}

describe('api methods', () => {

  it(`works with basic methods`, () => {

    cy.document().then((doc) => {
      const collidingElement = doc.createElement('div')
      collidingElement.id = BASE_STYLE_ID
      doc.body.appendChild(collidingElement)
    })

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

    cy.document().then((doc) => {
      expect(doc.body.querySelector(`div#${BASE_STYLE_ID}`), 'application element')
        .not.to.eq(null)

      const pluginStyle = Array.from(doc.querySelectorAll(STYLE_OWNER_SELECTOR))
        .find((style) => style.id === BASE_STYLE_ID)

      expect(pluginStyle, 'plugin base stylesheet').not.to.eq(undefined)
    })

    cy.then(() => {
      const reporterDoc = getReporterDocument()
      expect(reporterDoc, 'reporter document').not.to.eq(undefined)

      const doc = reporterDoc as Document
      expect(doc.querySelectorAll(`${STYLE_OWNER_SELECTOR}#${TIMELINE_STYLE_ID}`))
        .to.have.length(1)

      const reporter = doc.createElement('div')
      reporter.className = 'reporter'

      const command = doc.createElement('div')
      command.className = 'command command-name-GET'

      const commandMethod = doc.createElement('span')
      commandMethod.className = 'command-method'

      command.appendChild(commandMethod)
      reporter.appendChild(command)
      doc.body.appendChild(reporter)

      const backgroundColor = doc.defaultView
        ?.getComputedStyle(commandMethod)
        .backgroundColor

      reporter.remove()
      expect(backgroundColor).to.eq(methods[1].color)
    })

  })

});
