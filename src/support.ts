/// <reference types="cypress" />

import './types'
import { getContainer } from './utils/getContainer';
import { transform } from "./utils/transform";
import base from "./style.css";
import timeline from "./timeline.css";
import { createApp, reactive, ref } from 'vue'
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
  requestBody: Record<string, any>
  requestBodyFormatted: string
  responseBody: Record<string, any>
  responseBodyFormatted: string
}

Cypress.on('test:before:run', () => {

  const { win, doc } = getContainer()

  let props = reactive({
    value: [] as requestOptions[]
  })

  const app = createApp(App, {
    props
  })

  // append styles
  const head = doc.head || doc.getElementsByTagName('head')[0]

  const style = doc.createElement('style');
  head.appendChild(style);
  style.appendChild(doc.createTextNode(base));

  // append timeline styles
  const reporterEl = top?.document.querySelector('#unified-reporter')
  if (!reporterEl) {
    return
  }
  const reporterStyleEl = document.createElement('style')
  reporterEl.appendChild(reporterStyleEl)
  reporterStyleEl.appendChild(doc.createTextNode(timeline));

  // TODO it would be cool if we could ignore the viewportHeight and just use the full height of the runner window. it’s possible to transform certain styles, but it doesn’t work when user resizes window, and for some reason it keeps cutting of some of the content
  // // append runner styles
  // const runnerEl = top?.document.querySelector('#unified-runner')
  // if (!runnerEl) {
  //   return
  // }
  // // runnerEl.removeAttribute("style")
  // const transform: string = getComputedStyle(runnerEl).transform
  // // @ts-ignore
  // const runnerStyleEl = document.createElement('style')
  // runnerStyleEl.innerHTML = `
  //   #unified-runner {
  //     height: 100% !important;
  //     width: 100% !important;
  //     overflow: scroll !important;
  //   }
  // `
  // reporterEl.appendChild(runnerStyleEl)

  app.mount(doc.body)

  Cypress.Commands.add('api', (...args: any[]): Cypress.Chainable<any> => {

    let options: Cypress.RequestOptions = resolveOptions(...args)

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

    let index = props.value.length - 1

    props.value[index].method = options.method || 'GET'
    props.value[index].url = options.url || '/'
    props.value[index].query = options.qs || {}
    props.value[index].requestHeaders = options.headers || {}

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
    }).then(({ duration, body, status, headers, requestHeaders, statusText }) => {

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

      // this is kinda dumb, but don’t know how to make sure we do the snapshot at a right moment
      // if (body.length) {
      //   cy.get('[data-cy=response]', { log: false, timeout: 50 })
      // }

      cy.then(() => {

        statusLog.snapshot('response').end()
        responseLog.snapshot('response').end()

        // scroll to the bottom
        win.scrollTo(0, doc.body.scrollHeight)

        return {
          duration,
          body,
          status,
          statusText,
          headers,
          requestHeaders
        }

      })

    })
  })
})