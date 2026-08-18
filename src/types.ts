declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Make an HTTP GET request. Command works the same way as cy.request()
       *
       * @see https://on.cypress.io/request
       * @example
       *    cy.api('http://dev.local/seed')
       */
      api(url: string, body?: RequestBody): Chainable<ApiResponseBody>
      /**
       * Make an HTTP request with specific method. Command works the same way as cy.request()
       *
       * @see https://on.cypress.io/request
       * @example
       *    cy.api('POST', 'http://localhost:8888/users', {name: 'Jane'})
       */
      api(method: HttpMethod, url: string, body?: RequestBody): Chainable<ApiResponseBody>
      /**
       * Make an HTTP request with specific behavior. Command works the same way as cy.request()
       *
       * @see https://on.cypress.io/request
       * @example
       *    cy.api({
       *      url: '/dashboard',
       *      followRedirect: false // turn off following redirects
       *    })
       */
      api(options: Partial<RequestOptions>): Chainable<ApiResponseBody>
      /**
       * Make an HTTP GET request. Command works the same way as cy.request()
       *
       * @see https://on.cypress.io/request
       * @example
       *    cy.request('http://dev.local/seed')
       */
      request(url: string, body?: RequestBody): Chainable<ApiResponseBody>
      /**
       * Make an HTTP request with specific method. Command works the same way as cy.request()
       *
       * @see https://on.cypress.io/request
       * @example
       *    cy.request('POST', 'http://localhost:8888/users', {name: 'Jane'})
       */
      request(method: HttpMethod, url: string, body?: RequestBody): Chainable<ApiResponseBody>
      /**
       * Make an HTTP request with specific behavior. Command works the same way as cy.request()
       *
       * @see https://on.cypress.io/request
       * @example
       *    cy.request({
       *      url: '/dashboard',
       *      followRedirect: false // turn off following redirects
       *    })
       */
      request(options: Partial<RequestOptions>): Chainable<ApiResponseBody>
    }
    interface Cypress {
      /**
       * Plugin config (Cypress 15.10+). Use Cypress.expose() for non-sensitive options.
       * @see https://docs.cypress.io/api/cypress-api/expose
       */
      expose(): PluginEnvOptions;
      expose<T extends keyof PluginEnvOptions>(key: T): PluginEnvOptions[T] | undefined;
      expose<T extends keyof PluginEnvOptions>(key: T, value: PluginEnvOptions[T]): void;
      expose(object: Partial<PluginEnvOptions>): void;
      /**
       * @deprecated Use Cypress.expose() for plugin config or cy.env() for secrets.
       * @see https://docs.cypress.io/guides/references/migration-guide#migrating-away-from-cypressenv
       */
      env(): PluginEnvOptions;
      env<T extends keyof PluginEnvOptions>(key: T): PluginEnvOptions[T];
      env<T extends keyof PluginEnvOptions>(key: T, value: PluginEnvOptions[T]): void;
      env(object: PluginEnvOptions): void;
    }
    interface TestConfigOverrides {
      env?: Partial<PluginEnvOptions>
      /** Cypress 15.10+: use expose for plugin options (requestMode, snapshotOnly, etc.) */
      expose?: Partial<PluginEnvOptions>
    }
  }
  interface Window {
    props: Record<string, RequestProps[]>
  }
}

export interface PluginEnvOptions extends Cypress.ObjectLike {
  enableTimeline?: boolean
  snapshotOnly?: boolean
  hideCredentials?: boolean
  hideCredentialsOptions?: HideCredentialsOptions
  requestMode?: boolean
  /**
   * Skip rendering the plugin UI (Vue app + syntax highlighting) for performance.
   * - unset (default): render in open mode, skip in run mode (`cypress run`/CI)
   * - `true`: always skip the UI
   * - `false`: always render, even in run mode
   */
  disableUi?: boolean
}

export interface HideCredentialsOptions {
  auth?: string[]
  headers?: string[]
  body?: string[]
  qs?: string[]
}

export interface ApiRequestOptions extends Cypress.RequestOptions {
  headers: Record<string, any>
  auth: Record<string, any>
}
export interface ApiResponseBody extends Cypress.Response<any> {
  size?: number
}

export interface RequestProps {
  id: string
  method: string
  status: string
  time: number
  size: string
  url: string
  query: {
    body: Record<string, any>
    formatted: string
  }
  auth: {
    body: Record<string, any>
    formatted: string
  }
  requestHeaders: {
    body: Record<string, any>
    formatted: string
  }
  requestBody: {
    body: Cypress.RequestBody
    formatted: string
  }
  responseBody: {
    body: string | Record<string, any>
    formatted: string
  },
  responseHeaders: {
    body: Record<string, any>
    formatted: string
  },
  cookies: {
    body: Record<string, any>
  }
}