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
      api<T = any>(url: string, body?: RequestBody): Chainable<apiResponseBody>
      /**
       * Make an HTTP request with specific method. Command works the same way as cy.request()
       *
       * @see https://on.cypress.io/request
       * @example
       *    cy.api('POST', 'http://localhost:8888/users', {name: 'Jane'})
       */
      api<T = any>(method: HttpMethod, url: string, body?: RequestBody): Chainable<apiResponseBody>
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
      api<T = any>(options: Partial<RequestOptions>): Chainable<apiResponseBody>
    }
    interface Cypress {
      /**
        * Returns all environment variables set with CYPRESS_ prefix or in "env" object in "cypress.json"
        *
        * @see https://on.cypress.io/env
        */
      env(): Partial<PluginEnvOptions>;
      /**
       * Returns specific environment variable or undefined
       * @see https://on.cypress.io/env
       * @example
       *    // cypress.json
       *    { "env": { "foo": "bar" } }
       *    Cypress.env("foo") // => bar
       */
      env<T extends keyof PluginEnvOptions>(key: T): PluginEnvOptions[T];
      /**
       * Set value for a variable.
       * Any value you change will be permanently changed for the remainder of your tests.
       * @see https://on.cypress.io/env
       * @example
       *    Cypress.env("host", "http://server.dev.local")
       */
      env<T extends keyof PluginEnvOptions>(key: T, value: PluginEnvOptions[T]): void;

      /**
       * Set values for multiple variables at once. Values are merged with existing values.
       * @see https://on.cypress.io/env
       * @example
       *    Cypress.env({ host: "http://server.dev.local", foo: "foo" })
       */
      env(object: Partial<PluginEnvOptions>): void;
    }
    interface TestConfigOverrides {
      env: Partial<PluginEnvOptions>
    }
  }
  interface Window {
    props: Record<string, requestProps[]>
  }
}

interface PluginEnvOptions {
  snapshotOnly: boolean
  hideCredentials: boolean
}

export interface apiRequestOptions extends Cypress.RequestOptions {
  headers: Record<string, any>
  auth: Record<string, any>
}
export interface apiResponseBody extends Cypress.Response<any> {
  size?: number
}

export interface requestProps {
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
    body: Record<string, any>
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