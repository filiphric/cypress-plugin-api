// adds cy.api command
import 'cypress-real-events/support';
import '../../dist/support'

import { recurse } from 'cypress-recurse'

Cypress.Commands.add('invokeCopyButton', (blockSelector: string, copyButtonSelector: string) => {
  return recurse(
    () => {
      return cy.get(blockSelector)
        .should('be.visible')
        .trigger('mouseover')
        .get(copyButtonSelector)
    },
    (button) => {
      expect(button).to.be.visible
    },
    {
      log: false,
      timeout: 8000
    }
  )
})