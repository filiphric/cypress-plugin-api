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
        * Returns all environment variables set with CYPRESS_ prefix or in "env" object in "cypress.json"
        *
        * @see https://on.cypress.io/env
        */
      env(): Partial<PluginEnvOptions> & object;
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
      env?: Partial<PluginEnvOptions>
    }
  }
  interface Window {
    props: Record<string, RequestProps[]>
  }
}

export interface PluginEnvOptions {
  snapshotOnly: boolean
  hideCredentials: boolean
  hideCredentialsOptions: HideCredentialsOptions,
  requestMode: boolean
}

export interface HideCredentialsOptions {
  auth?: string[]
  headers?: string[]
  body?: string[]
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