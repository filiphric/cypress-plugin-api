<h2 align=center>Cypress plugin API</h2>
<p align="center">
<a href="https://github.com/sponsors/filiphric"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" /></a>
<a href="https://dashboard.cypress.io/projects/v2x96h/runs"><img src="https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/count/v2x96h/main&style=flat&logo=cypress" /></a>
</p>

<p align="center">
Cypress plugin for effective API testing. Imagine Postman, but in Cypress. Prints out information about the API call in the Cypress App UI.
</p>

![Cypress plugin for testing API](./images/demo.gif)

### Features
- cy.api() command that shows information about the API call (URL, headers, response, and more) in the UI
- all of the info can be viewed in a time-travel snapshots
- simple table for viewing cookies
- JSON data object and array folding
- color coding of methods in UI view and in timeline
- calculating size of the response
- [combine API calls with UI](#snapshot-only-mode)
- [hide sensitive headers and auth information](#hiding-credentials)
- [`requestMode` to add cy.api() features to cy.request() command](#requestmode---enable-ui-for-cyrequest-command)
- [TypeScript support](#typescript-support)

### Installation

Install this package:
```bash
npm i cypress-plugin-api
# or
yarn add cypress-plugin-api
```

Import the plugin into your `cypress/support/e2e.js` file:
```js
import 'cypress-plugin-api'
// or
require('cypress-plugin-api')
```

### Usage
You can now use `cy.api()` command. This command works exactly like `cy.request()` but in addition to calling your API, it will print our information about the API call in your Cypress runner.

#### Snapshot only mode
If you want to combine your API calls with your UI test, you can now use `snapshotOnly` mode, that will hide the plugin UI view after command ends. You can access it within the timeline.

`snapshotOnly` mode is set to `false` by default. To set up `snapshotOnly` mode, set it at runtime or in config (Cypress 15.10+ uses `expose` for plugin config):

```js
it('my UI & API test', () => {
  Cypress.expose('snapshotOnly', true)
  cy.visit('/') // open app
  cy.api('/item') // call api
  cy.get('#myElement') // still able to access element on page

})
```

or add to your `cypress.config.{js,ts}` file:
```js
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    expose: {
      snapshotOnly: true
    }
  },
})
```

#### Hiding credentials
By default, values are **shown** in the UI so you can see them when running locally. When you use **cy.env()** for secrets (or want to hide in CI), turn on **HideCredentials** so those values are masked (e.g. `****`) in request headers, auth, body, query params, and the cURL tab.

- **See values locally:** leave `hideCredentials` unset or `false` (default).
- **Hide credentials from `cy.env()` (recommended for secrets):**
  - **Globally via config** (applies to all specs):

    ```js
    // cypress.config.{js,ts}
    import { defineConfig } from 'cypress'

    export default defineConfig({
      e2e: {
        env: {
          // credentials passed from cy.env() will be masked in the plugin UI
          hideCredentials: true,
        },
      },
    })
    ```

  - **Per spec / per suite:** use any of these:
    - **Via env** (in a `before()` or at the start of the test):
      ```js
      Cypress.env('hideCredentials', true)
      // optional: Cypress.env('hideCredentialsOptions', { headers: ['authorization'], auth: ['pass'], body: ['username'], qs: ['password'] })
      ```
    - Or **test-level env** (env applies only to that test):
      ```js
      it('my secret test', { env: { hideCredentials: true } }, () => {
        cy.env(['myToken']).then(({ myToken }) => {
          cy.api({ url: '/', headers: { authorization: myToken } })
        })
      })
      ```
    - On Cypress 15.10+: `Cypress.expose('hideCredentials', true)`
    - Or the plugin helper: `setPluginConfig('hideCredentials', true)`

Example: use **cy.env()** for the token and **HideCredentials** so it’s masked in the UI:

```js
it('my secret test', () => {
  // Option 1 (Cypress 15.10+)
  Cypress.expose('hideCredentials', true)

  // Option 2 (helper from this plugin, also works when Cypress.expose is not available)
  // setPluginConfig('hideCredentials', true)

  cy.env(['myToken']).then(({ myToken }) => {
    cy.api({
      url: '/',
      headers: {
        authorization: myToken
      }
    })
  })
})
```

The result will look like this:

![Cypress plugin for testing API](./images/hideCredentials.png)

Use **hideCredentialsOptions** to choose which keys are masked (when not set, default keys include `authorization`, `password`, `user`, `pass`, `token`, `apiKey`). You can set it via **config env** or per spec:

- **Config env (global):**

  ```js
  // cypress.config.{js,ts}
  import { defineConfig } from 'cypress'

  export default defineConfig({
    e2e: {
      env: {
        hideCredentials: true,
        hideCredentialsOptions: {
          headers: ['authorization'],
          auth: ['pass'],
          body: ['username'],
          qs: ['password'],
        },
      },
    },
  })
  ```

- **Per spec** (use one of these):

  **Via env** (in a `before()` or at the start of the test):

  ```js
  Cypress.env('hideCredentials', true)
  Cypress.env('hideCredentialsOptions', {
    headers: ['authorization'],
    auth: ['pass'],
    body: ['username'],
    qs: ['password']
  })
  ```

  **Or via expose / helper inside the test:**

  ```js
  it('my secret test', () => {
    // Option 1: Cypress 15.10+
    Cypress.expose('hideCredentialsOptions', {
      headers: ['authorization'],
      auth: ['pass'],
      body: ['username'],
      qs: ['password']
    })

    // Option 2: helper from this plugin
    // setPluginConfig('hideCredentialsOptions', {
    //   headers: ['authorization'],
    //   auth: ['pass'],
    //   body: ['username'],
    //   qs: ['password']
    // })

    cy.env(['myToken', 'myPass', 'myUser', 'password']).then(
      ({ myToken, myPass, myUser, password }) => {
        cy.api({
          url: '/',
          headers: { authorization: myToken },
          auth: { pass: myPass },
          body: { username: myUser },
          qs: { password }
        })
      }
    )
  })
  ```

#### `requestMode` - enable UI for `cy.request()` command
When `false` (default), only `cy.api()` shows the plugin UI. When set to `true`, `cy.request()` also displays the same UI for every `cy.request()` call.

#### TypeScript support
In most cases, types work just by installing plugin, but you can add the types to your `tsconfig.json`
```json
{
  "types": ["cypress-plugin-api"]
}
```
This will add types for `cy.api()` command, it’s returned values as well as `env` properties.

### Issues
All the issues can be found on [issues page](https://github.com/filiphric/cypress-plugin-api/issues), feel free to open any new ones or contribute with your own code.

<!-- ### Want to learn more?
Come to my upcoming "Testing API with Cypress" workshop. We’ll be using this plugin and learning different ways of testing API.

[Register here](https://filiphric.com/cypress-api-testing-workshop)

![Testing API with Cypress workshop](./images/apiWorkshop.png) -->
<hr>
<p align="center">
...powered by coffee and love ❤️  <a href="https://filiphric.com">Filip Hric
</p>