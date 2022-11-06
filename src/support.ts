/// <reference types="cypress" />

import './types'
import base from "./style.css";
import timeline from "./timeline.css";
import { createApp, reactive } from 'vue'
import App from "./components/App.vue";
import { resolveOptions } from './utils/resolveOptions';
import { apiRequestOptions, apiResponseBody, requestProps } from './types';
import { anonymize } from './utils/anonymize';
import { transform } from "./utils/transform";
import { convertSize } from './utils/convertSize';
import { calculateSize } from './utils/calculateSize';
const setCookie = require('set-cookie-parser');

before(() => {
  // initialize global props object
  window.props = {}
})

const api: Cypress.CommandFnWithOriginalFn<"request"> = (originalFn: any, ...args: Partial<apiRequestOptions>[]) => {

  // create an attribute that should be unique to the current test
  const currentTestTitle = Cypress.currentTest.titlePath.join('.')

  // get the number of retry, 0 if first attempt
  // @ts-ignore 
  const attempt = cy.state('runnable')._currentRetry
  const isRetry = attempt !== 0

  // determine if there are props from the same test but previous cy.api() call
  const propsExist = window.props[currentTestTitle]?.length ? true : false

  // initialize an empty array for current test if this is a first call of cy.api() in current test
  const currentProps: requestProps[] = propsExist && !isRetry ? window.props[currentTestTitle] : [] as requestProps[]

  // @ts-ignore
  const doc: Document = cy.state('document');

  // load props saved into window if any present in current test
  let props = reactive(currentProps)

  const app = createApp(App, {
    props
  })

  // mount plugin only on first call in the test or on retry
  if (!propsExist || isRetry || Cypress.env('snapshotOnly')) {

    // append styles
    const head = doc.head || doc.getElementsByTagName('head')[0]

    const style = doc.createElement('style');
    head.appendChild(style);
    style.appendChild(doc.createTextNode(base));

    let reporterEl = top?.document.querySelector('#unified-reporter') || top?.document.querySelector('#app')
    const reporterStyleEl = document.createElement('style')
    reporterEl?.appendChild(reporterStyleEl)
    reporterStyleEl.appendChild(doc.createTextNode(timeline));

    // create an element where our plugin will mount
    const root = doc.createElement('div');
    root.setAttribute('id', 'api-plugin-root')
    doc.body.appendChild(root);

    const plugin = doc.getElementById('api-plugin-root')
    app.mount(plugin as Element)
  }

  let options: apiRequestOptions = resolveOptions(...args)

  let index = props.length

  const propItem: requestProps = {
    method: 'GET',
    status: '',
    time: 0,
    size: '',
    url: '',
    auth: {
      body: {},
      formatted: ''
    },
    query: {
      body: {},
      formatted: ''
    },
    requestHeaders: {
      body: {},
      formatted: ''
    },
    requestBody: {
      body: {},
      formatted: ''
    },
    responseBody: {
      body: {},
      formatted: ''
    },
    responseHeaders: {
      body: {},
      formatted: ''
    },
    cookies: {
      body: {}
    }
  }

  props.push(propItem)

  props[index].method = structuredClone(options.method) || 'GET'
  props[index].url = (Cypress.config('baseUrl') + structuredClone(options.url).replace(Cypress.config('baseUrl') as string, '')).replace('null', '') || Cypress.config('baseUrl') + '/'
  props[index].query.body = structuredClone(options.qs)
  props[index].auth.body = structuredClone(options.auth)
  props[index].requestHeaders.body = structuredClone(options.headers)
  props[index].requestBody.body = structuredClone(options.body)

  // hide credentials if the options was set up
  if (Cypress.env('hideCredentials')) props[index] = anonymize(props[index])

  // format request body
  props[index].requestBody.formatted = transform(props[index].requestBody.body)
  // format request headers
  props[index].requestHeaders.formatted = transform(props[index].requestHeaders.body)
  // format query
  props[index].query.formatted = transform(props[index].query.body)
  // format auth
  props[index].auth.formatted = transform(props[index].auth.body)

  // log the request
  let yielded: apiResponseBody
  let log = Cypress.log({
    name: options.method || 'GET',
    autoEnd: false,
    message: `${options.url}`
  })

  return cy.wrap<apiResponseBody>(originalFn({ ...options, log: false }, options), { log: false }).then((res: apiResponseBody) => {

    const { body, status, headers, statusText, duration } = res

    const messageFormatted = `${status}\u00A0(${statusText})`
    props[index].status = messageFormatted || ''
    props[index].time = duration
    const contentTypeHeader = headers['content-type'] as string
    const contentLengthHeader = headers['content-length'] as string
    const contentCookieHeader = headers['set-cookie'] as string
    const type = typeof body
    const bodyRaw = type === 'object' ? JSON.stringify(body, null, 2) : body

    if (contentTypeHeader) {
      const contentType = contentTypeHeader.split(';')[0]
      const formats = {
        'text/xml': 'xml',
        'application/json': 'json',
        'text/html': 'html',
        'text/plain': 'plaintext',
      } as const
      const language = formats[contentType as keyof typeof formats]
      // format response
      props[index].responseBody.formatted = transform(body, language)
      props[index].responseBody.body = bodyRaw

    }

    // format cookies
    const parsedCookie = setCookie.parse(contentCookieHeader, {
      decodeValues: true
    })

    props[index].cookies.body = parsedCookie

    // show "no content" message if there’s no response
    if (!props[index].requestBody.formatted.length) {
      props[index].requestBody.formatted = '<div class="pl-4 text-cy-gray text-xs font-mono">(No content)</div>'
    }

    // show "no content" message if there’s no response
    if (!props[index].responseBody.formatted.length) {
      props[index].responseBody.formatted = '<div class="pl-4 text-cy-gray text-xs font-mono">(No content)</div>'
    }

    // format response header
    props[index].responseHeaders.body = headers
    props[index].responseHeaders.formatted = transform(headers)

    // count content size from header if available, or calculate manually
    const size = contentLengthHeader ? parseInt(contentLengthHeader) : calculateSize(props[index].responseBody.body)
    props[index].size = convertSize(size)
    res.size = size

    yielded = res

    // we need to make sure we do the snapshot at a right moment
    cy.then(() => {

      // add response to console output
      log.set({
        consoleProps() {
          return {
            yielded
          }
        }
      })

      // save all props to current window to be loaded
      window.props[currentTestTitle] = props

      log.snapshot('snapshot').end()

      // scroll to the bottom
      doc.getElementById('api-view-bottom')?.scrollIntoView()

      // if in snapshot mode, unmount plugin from view
      if (Cypress.env('snapshotOnly')) { app.unmount() }

      return res

    })

  })
}

if (Cypress.env('requestMode')) {

  Cypress.Commands.overwrite('request', api)
  Cypress.Commands.add('api', (...args: Partial<apiRequestOptions>[]) => {
    let options: apiRequestOptions = resolveOptions(...args)
    return cy.request({ ...options, log: false })
  })

} else {

  Cypress.Commands.add('api', (...args: Partial<apiRequestOptions>[]) => {
    Cypress.Commands.overwrite('request', api)
    let options: apiRequestOptions = resolveOptions(...args)
    return cy.request({ ...options, log: false })
  })

}