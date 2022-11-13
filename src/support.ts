/// <reference types="cypress" />

import './types'

import { createApp, reactive } from 'vue'
import App from "./components/App.vue";
import { resolveOptions } from './utils/resolveOptions';
import { ApiRequestOptions, ApiResponseBody, RequestProps } from './types';
import { anonymize } from './utils/anonymize';
import { transform } from "./modules/transform";
import { convertSize } from './utils/convertSize';
import { calculateSize } from './utils/calculateSize';
import { isValidUrl } from './utils/isValidUrl';
import { getDoc } from './utils/getDoc';
import { mountPlugin } from './modules/mountPlugin';
import setCookie from 'set-cookie-parser';
const { _ } = Cypress

before(() => {
  // initialize global props object
  window.props = {}
})

const api: Cypress.CommandFnWithOriginalFn<"request"> = (originalFn: any, ...args: Partial<ApiRequestOptions>[]) => {

  // create an attribute that should be unique to the current test
  const currentTestTitle = Cypress.currentTest.titlePath.join('.')

  // get the number of retry, 0 if first attempt
  // @ts-ignore cy.state() has no type definitions
  const attempt = cy.state('runnable')._currentRetry
  const isRetry = attempt !== 0

  // determine if there are props from the same test but previous cy.api() call
  const propsExist = window.props[currentTestTitle]?.length ? true : false

  // initialize an empty array for current test if this is a first call of cy.api() in current test
  const currentProps: RequestProps[] = propsExist && !isRetry ? window.props[currentTestTitle] : [] as RequestProps[]

  const doc = getDoc()

  // load props saved into window if any present in current test
  const props = reactive(currentProps)

  const app = createApp(App, {
    props
  })

  // mount plugin only on first call in the test or on retry
  if (!propsExist || isRetry || Cypress.env('snapshotOnly')) {
    mountPlugin(app)
  }

  const options: ApiRequestOptions = resolveOptions(...args)

  const index = props.length

  const propItem: RequestProps = {
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

  props[index].method = _.cloneDeep(options.method) || 'GET'
  props[index].url = isValidUrl(options.url) ? options.url : Cypress.config('baseUrl') + options.url
  props[index].query.body = _.cloneDeep(options.qs)
  props[index].auth.body = _.cloneDeep(options.auth)
  props[index].requestHeaders.body = _.cloneDeep(options.headers)
  props[index].requestBody.body = _.cloneDeep(options.body)

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
  let yielded: ApiResponseBody
  const log = Cypress.log({
    name: options.method || 'GET',
    autoEnd: false,
    message: `${options.url}`
  })

  return cy.wrap<ApiResponseBody>(originalFn({ ...options, log: false }, options), { log: false }).then((res: ApiResponseBody) => {

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
    props[index].size = convertSize(size) // convert to readable format (kB, MB...)
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
  Cypress.Commands.add('api', (...args: Partial<ApiRequestOptions>[]) => {
    const options: ApiRequestOptions = resolveOptions(...args)
    return cy.request({ ...options, log: false })
  })

} else {

  Cypress.Commands.add('api', (...args: Partial<ApiRequestOptions>[]) => {
    Cypress.Commands.overwrite('request', api)
    const options: ApiRequestOptions = resolveOptions(...args)
    return cy.request({ ...options, log: false })
  })

}