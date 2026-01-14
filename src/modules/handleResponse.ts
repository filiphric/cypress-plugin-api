import { removeStyles } from '@modules/removeStyles'
import setCookie from 'set-cookie-parser';
import { convertSize } from '@utils/convertSize';
import { calculateSize } from '@utils/calculateSize';
import { isValidJson } from '@utils/isValidJson';
import { ApiRequestOptions, ApiResponseBody, RequestProps } from '../types';
import { transform } from "@modules/transform";
import { getState } from '@utils/getState';
import { App } from 'vue';
import { getFormat } from '@utils/getFormat';
import { generateCurl } from '@utils/generateCurl';

export const handleResponse = (res: ApiResponseBody, options: ApiRequestOptions, props: RequestProps[], index: number, app: App<Element>) => {

  const { doc, testId } = getState()

  // log the request
  const log = Cypress.log({
    name: options.method || 'GET',
    autoEnd: false,
    message: `${options.url}`
  }).snapshot('request')

  const { body, status, headers, statusText, duration } = res

  const messageFormatted = `${status}\u00A0(${statusText})`
  props[index].status = messageFormatted || ''
  props[index].time = duration
  const contentTypeHeader = headers['content-type'] as string
  const contentLengthHeader = headers['content-length'] as string
  const contentCookieHeader = headers['set-cookie'] as string
  
  // Handle ArrayBuffer and binary responses
  let bodyRaw: string | object
  let bodyForTransform: any = body
  
  // Check for ArrayBuffer - handle both instanceof and string representation
  // This handles cases where instanceof fails due to cross-realm issues
  const bodyString = typeof body === 'object' && body !== null ? Object.prototype.toString.call(body) : ''
  const isArrayBuffer = body instanceof ArrayBuffer || bodyString === '[object ArrayBuffer]'
  
  if (isArrayBuffer) {
    // Convert ArrayBuffer to string for display
    const decoder = new TextDecoder()
    // Handle both direct ArrayBuffer and wrapped ArrayBuffer
    const buffer = body instanceof ArrayBuffer ? body : (body as any).buffer || body
    bodyRaw = decoder.decode(buffer)
    bodyForTransform = bodyRaw
  } else if (body instanceof Uint8Array) {
    // Handle Uint8Array (another binary format)
    const decoder = new TextDecoder()
    bodyRaw = decoder.decode(body)
    bodyForTransform = bodyRaw
  } else {
  const type = typeof body
    // Only JSON.stringify if it's a plain object (not ArrayBuffer, Blob, etc.)
    if (type === 'object' && body !== null && !(body instanceof Blob) && !(body instanceof FormData)) {
      try {
        bodyRaw = JSON.stringify(body, null, 2)
        bodyForTransform = body
      } catch (e) {
        // If JSON.stringify fails, convert to string
        bodyRaw = String(body)
        bodyForTransform = bodyRaw
      }
    } else {
      bodyRaw = body
      bodyForTransform = body
    }
  }

  // Always set the response body, even if there's no content-type header
  props[index].responseBody.body = bodyRaw

  if (contentTypeHeader) {
    const contentType = contentTypeHeader.split(';')[0]
    const formats = {
      'text/xml': 'xml',
      'application/json': 'json',
      'text/html': 'html',
      'text/plain': 'plaintext',
      'application/octet-stream': 'plaintext',
    } as const
    const definedFormat = formats[contentType as keyof typeof formats]
    // if format is in the "formats" object use that, else try to determine by the function
    // Use bodyForTransform which handles ArrayBuffer conversion
    const language = definedFormat || getFormat(bodyForTransform)
    // format response
    props[index].responseBody.formatted = transform(bodyForTransform, language)
  } else if (body !== undefined && body !== null && body !== '') {
    // If no content-type header, try to determine format from body
    // Use bodyForTransform which handles ArrayBuffer conversion
    const language = getFormat(bodyForTransform)
    props[index].responseBody.formatted = transform(bodyForTransform, language)
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
  // bodyRaw can be a string or object, so we need to handle both cases
  let size: number
  if (contentLengthHeader) {
    size = parseInt(contentLengthHeader)
  } else {
    const bodyForSize = props[index].responseBody.body
    if (typeof bodyForSize === 'string') {
      // If it's a string, calculate size directly
      const cleanString = bodyForSize.replace(/\r\n/g, '\n')
      const finalString = isValidJson(cleanString) ? cleanString.replace(/\s/g, '') : cleanString
      size = new Blob([finalString]).size
    } else {
      // If it's an object, use the calculateSize function
      size = calculateSize(bodyForSize as object)
    }
  }
  props[index].size = convertSize(size) // convert to readable format (kB, MB...)
  res.size = size

  const yielded = res

  const findSnapshotElement = () => {
    return Cypress.$(`#${props[index].id}`, { log: false })
  }

  // we need to make sure we do the snapshot at a right moment
  cy.window({ log: false })
    .then(findSnapshotElement)
    .then(($el) => {

      // Generate cURL for this request
      const generateCurl = () => {
        let curl = `curl -X ${options.method || 'GET'} "${options.url}"`;
        if (options.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            curl += ` -H "${key}: ${value}"`;
          });
        }
        if (options.body) {
          if (typeof options.body === 'object') {
            curl += ` -d '${JSON.stringify(options.body)}'`;
          } else {
            curl += ` -d '${options.body}'`;
          }
        }
        return curl;
      };

      // add response to console output
      log.set({
        consoleProps() {
          return {
            yielded,
            cURL: generateCurl()
          }
        }
      })

      // save all props to current window to be loaded
      window.props[testId] = props

      log.set({ $el });
      log.snapshot('response').end()

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