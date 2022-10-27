/// <reference types="cypress" />

import './types'
import { transform } from "./utils/transform";
import base from "./style.css";
import timeline from "./timeline.css";
import { createApp, reactive } from 'vue'
import App from "./components/App.vue";
import { resolveOptions } from './utils/resolveOptions';

type requestOptions = {
  method: string
  status: string
  url: string
  query: Record<string, any>
  queryFormatted: string
  requestHeaders: Record<string, any>
  requestHeadersFormatted: string
  requestBody: Cypress.RequestBody
  requestBodyFormatted: string
  responseBody: Record<string, any>
  responseBodyFormatted: string
}

before(() => {
  window.props = {}
})

Cypress.Commands.add('api', (...args: any[]): Cypress.Chainable<any> => {

  // create an attribute that should be unique to the current test
  const path = Cypress.currentTest.titlePath.join('.')

  // @ts-ignore
  const attempt = cy.state('runnable')._currentRetry

  // if window does not already contain current test, create an empty array
  window.props && window.props[path] ? null : window.props[path] = []

  // @ts-ignore
  const doc: Document = cy.state('document');

  // load props saved into window if any present in current test
  let props = reactive({
    value: window?.props[path].length && attempt === 0 ? window.props[path] : [] as requestOptions[]
  })

  const app = createApp(App, {
    props
  })

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

  // mount plugin
  const plugin = doc.getElementById('api-plugin-root')
  app.mount(plugin as Element)

  let options: Cypress.RequestOptions = resolveOptions(...args)

  let index = props.value.length

  props.value.push({
    method: 'GET',
    status: '',
    url: '',
    query: {},
    queryFormatted: '',
    requestHeaders: {},
    requestHeadersFormatted: '',
    requestBody: {},
    requestBodyFormatted: '',
    responseBody: {},
    responseBodyFormatted: ''
  })

  props.value[index].method = options.method || 'GET'
  props.value[index].url = options.url || '/'
  props.value[index].query = options.qs || {}
  props.value[index].requestHeaders = options.headers || {}
  props.value[index].requestBody = options.body

  // format request body
  props.value[index].requestBodyFormatted = transform(options.body)
  // format request headers
  props.value[index].requestHeadersFormatted = transform(options.headers)
  // format query
  props.value[index].queryFormatted = transform(options.qs)

  // log the request
  let requestLog = Cypress.log({
    name: options.method || 'GET',
    autoEnd: false,
    message: `${options.url}`,
    consoleProps() {
      return {
        request: options
      }
    }
  })

  return cy.request({
    ...options,
    log: false
  }).then(({ duration, body, status, headers, requestHeaders, statusText, allRequestResponses, isOkStatusCode, redirectedToUrl, redirects }) => {

    const messageFormatted = `${status} (${statusText})`
    // make snapshot for request
    requestLog.snapshot('request').end()

    props.value[index].status = messageFormatted || ''

    // log the status
    let statusLog = Cypress.log({
      name: 'response',
      autoEnd: false,
      message: messageFormatted
    })

    // log the response        
    const type = typeof body
    const bodyRaw = type === 'object' ? JSON.stringify(body, null, 2) : body
    let responseLog = Cypress.log({
      name: 'body',
      autoEnd: false,
      message: bodyRaw,
      consoleProps() {
        return {
          type,
          response: bodyRaw
        }
      }
    })

    const contentTypeHeader = headers['content-type'] as string

    if (contentTypeHeader) {
      const contentType = contentTypeHeader.split(';')[0]
      const formats = {
        'text/xml': 'xml',
        'application/json': 'json',
        'text/html': 'html',
      } as const
      const language = formats[contentType as keyof typeof formats]
      // format response
      props.value[index].responseBodyFormatted = transform(body, language)
      props.value[index].responseBody = bodyRaw

    }

    // we need to make sure we do the snapshot at a right moment
    cy.then(() => {

      // save all props to current window to be loadeded
      window.props[path] = props.value

      statusLog.snapshot('response').end()
      responseLog.snapshot('response').end()

      // scroll to the bottom
      doc.getElementById('api-view-bottom')?.scrollIntoView()

      // if in snapshot mode, unmount plugin from view
      if (Cypress.env('snapshotOnly')) { app.unmount() }

      return {
        duration,
        body,
        status,
        statusText,
        headers,
        requestHeaders,
        allRequestResponses,
        isOkStatusCode,
        redirectedToUrl,
        redirects
      }

    })

  })
})