import { getPluginConfig } from './pluginConfig'

/**
 * Decide whether the plugin UI (Vue app + Prism syntax highlighting) should be rendered.
 *
 * Rendering the full UI is expensive: every cy.api() call syntax-highlights the entire
 * request/response body and mounts it into the DOM, which Test Replay then captures. In
 * run mode (`cypress run`/CI) the UI can't be interacted with, so this is pure overhead
 * and can crash the browser renderer on large responses (see issue #135).
 *
 * Behaviour (controlled by the `disableUi` plugin option):
 * - `undefined` (default): auto — render in open mode, skip in run mode.
 * - `true`: always skip the UI (also helps open-mode performance).
 * - `false`: treated the same as `undefined` (UI is still skipped in run mode).
 */
export const shouldRenderUi = (): boolean => {
  // Compliance/safety requirement: never render the full UI in run mode/CI.
  if (Cypress.config('isInteractive') === false) return false

  const disableUi = getPluginConfig('disableUi')
  if (disableUi === true) return false

  // Open mode: render unless explicitly disabled.
  return true
}
