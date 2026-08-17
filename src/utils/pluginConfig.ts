import type { PluginEnvOptions } from '../types'

const hasExpose = (): boolean =>
  typeof (Cypress as unknown as { expose?: unknown }).expose === 'function'

/** Cypress.env() throws when allowCypressEnv is explicitly set to false, so it must be checked before calling Cypress.env(). */
const canUseCypressEnv = (): boolean =>
  (Cypress as unknown as { config: (k: string) => unknown }).config?.('allowCypressEnv') !== false

/** Runtime store so values set by tests (setPluginConfig) are always visible to the plugin. Cypress.env() is not reliable for this. */
const runtimeStore: Partial<PluginEnvOptions> = {}

/**
 * Read plugin config. Checks runtime store first, then Cypress.expose() on 15.10+, then Cypress.env() (unless disallowed), then Cypress.config('env').
 * So hideCredentials set in config env (or via setPluginConfig) is used to hide credentials from cy.env() in the UI.
 */
export function getPluginConfig<K extends keyof PluginEnvOptions>(
  key: K
): PluginEnvOptions[K] | undefined {
  if (Object.prototype.hasOwnProperty.call(runtimeStore, key)) {
    return runtimeStore[key]
  }
  if (hasExpose()) {
    const exposeVal = (Cypress as unknown as { expose: (k: K) => PluginEnvOptions[K] }).expose(key)
    if (exposeVal !== undefined) return exposeVal
  }
  if (canUseCypressEnv()) {
    const envVal = Cypress.env(key)
    if (envVal !== undefined) return envVal
  }
  const configEnv = (Cypress as unknown as { config: (k: string) => unknown }).config?.('env') as Partial<PluginEnvOptions> | undefined
  return configEnv?.[key]
}

/**
 * Set plugin config (for tests/support). Stored in runtime so getPluginConfig always sees it; also syncs to Cypress.expose() or Cypress.env() when available.
 */
export function setPluginConfig<K extends keyof PluginEnvOptions>(
  key: K,
  value: PluginEnvOptions[K]
): void {
  runtimeStore[key] = value
  if (hasExpose()) {
    (Cypress as unknown as { expose: (k: K, v: PluginEnvOptions[K]) => void }).expose(key, value)
  } else if (canUseCypressEnv()) {
    Cypress.env(key, value)
  }
}
