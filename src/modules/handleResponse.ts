import { removeStyles } from '@modules/removeStyles'
import setCookie from 'set-cookie-parser';
import { convertSize } from '@utils/convertSize';
import { calculateSize } from '@utils/calculateSize';
import { ApiRequestOptions, ApiResponseBody, RequestProps } from 'src/types';
import { transform } from "@modules/transform";
import { getState } from '@utils/getState';
import { App } from 'vue';
import { getFormat } from '@utils/getFormat';

export const handleResponse = (res: ApiResponseBody, options: ApiRequestOptions, props: RequestProps[], index: number, app: App<Element>) => {

  const { doc, testId } = getState()

  // log the request
  const log = Cypress.log({
    name: options.method || 'GET',
    autoEnd: false,
    message: `${options.url}`
  })

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
    const definedFormat = formats[contentType as keyof typeof formats]
    // if format is in the "formats" object use that, else try to determine by the function
    const language = definedFormat || getFormat(body)
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
  const size = contentLengthHeader ? parseInt(contentLengthHeader) : calculateSize(props[index].responseBody.body?.value)
  props[index].size = convertSize(size) // convert to readable format (kB, MB...)
  res.size = size

  const yielded = res

  // we need to make sure we do the snapshot at a right moment
  cy.get(`#${props[index].id}`, { log: false }).then(($el) => {

    // add response to console output
    log.set({
      consoleProps() {
        return {
          yielded
        }
      }
    })

    // save all props to current window to be loaded
    window.props[testId] = props

    log.set({ $el });
    log.snapshot('snapshot').end()

    // scroll to the bottom
    doc.getElementById('api-view-bottom')?.scrollIntoView()

    // if in snapshot mode, unmount plugin from view
    if (Cypress.env('snapshotOnly')) {
      app.unmount()
      removeStyles()
    }

    return res

  })
}