import { removeStyles } from '@modules/removeStyles'
import setCookie from 'set-cookie-parser';
import { convertSize } from '@utils/convertSize';
import { calculateSize } from '@utils/calculateSize';
import { isValidJson } from '@utils/isValidJson';
import { ApiRequestOptions, ApiResponseBody, RequestProps } from '../types';
import { transform } from "@modules/transform";
import { getState } from '@utils/getState';
import { getPluginConfig } from '@utils/pluginConfig';
import { App } from 'vue';
import { getFormat } from '@utils/getFormat';
import { isValidUrlOrIp } from '@utils/isValidUrlOrIp';

export const handleResponse = (res: ApiResponseBody, options: ApiRequestOptions, props: RequestProps[], index: number, app: App<Element>) => {

  const { doc, testId } = getState()

  if (!props[index].url || props[index].url === '') {
    const baseUrl = Cypress.config('baseUrl')
    if (options.url) {
      if (baseUrl && typeof baseUrl === 'string' && baseUrl.trim() !== '' && !isValidUrlOrIp(options.url)) {
        const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
        const path = options.url.startsWith('/') ? options.url : '/' + options.url
        props[index].url = base + path
      } else {
        props[index].url = options.url
      }
    }
  }

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
  
  let bodyRaw: string | object
  let bodyForTransform: any = body
  
  const bodyString = typeof body === 'object' && body !== null ? Object.prototype.toString.call(body) : ''
  const isArrayBuffer = body instanceof ArrayBuffer || bodyString === '[object ArrayBuffer]'
  
  if (isArrayBuffer) {
    const decoder = new TextDecoder()
    const buffer = body instanceof ArrayBuffer ? body : (body as any).buffer || body
    let decodedString = ''
    try {
      const uint8Array = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
      decodedString = decoder.decode(uint8Array)
    } catch {
      try {
        decodedString = decoder.decode(buffer)
      } catch {
        decodedString = String(body)
      }
    }
    
    if (decodedString && isValidJson(decodedString)) {
      try {
        const parsed = JSON.parse(decodedString)
        bodyRaw = decodedString
        bodyForTransform = parsed
      } catch {
        bodyRaw = decodedString
        bodyForTransform = decodedString
      }
    } else {
      bodyRaw = decodedString
      bodyForTransform = decodedString
    }
  } else if (body instanceof Uint8Array) {
    const decoder = new TextDecoder()
    let decodedString = ''
    try {
      decodedString = decoder.decode(body)
    } catch {
      decodedString = String(body)
    }
    
    if (decodedString && isValidJson(decodedString)) {
      try {
        const parsed = JSON.parse(decodedString)
        bodyRaw = decodedString
        bodyForTransform = parsed
      } catch {
        bodyRaw = decodedString
        bodyForTransform = decodedString
      }
    } else {
      bodyRaw = decodedString
      bodyForTransform = decodedString
    }
  } else {
  const type = typeof body
    if (type === 'object' && body !== null && !(body instanceof Blob) && !(body instanceof FormData)) {
      try {
        bodyRaw = JSON.stringify(body, null, 2)
        bodyForTransform = body
      } catch {
        bodyRaw = String(body)
        bodyForTransform = bodyRaw
      }
    } else {
      bodyRaw = body
      bodyForTransform = body
    }
  }

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
    const language = definedFormat || getFormat(bodyForTransform)
    props[index].responseBody.formatted = transform(bodyForTransform, language)
  } else if (body !== undefined && body !== null && body !== '') {
    const language = getFormat(bodyForTransform)
    props[index].responseBody.formatted = transform(bodyForTransform, language)
  }
  
  if (!props[index].responseBody.formatted || !props[index].responseBody.formatted.length) {
    if (bodyRaw && typeof bodyRaw === 'string' && bodyRaw.trim().length > 0) {
      props[index].responseBody.formatted = transform(bodyRaw, 'plaintext')
    } else if (bodyRaw && typeof bodyRaw === 'object' && bodyRaw !== null) {
      props[index].responseBody.formatted = transform(bodyRaw, 'json')
    }
  }

  const parsedCookie = setCookie.parse(contentCookieHeader, {
    decodeValues: true
  })

  props[index].cookies.body = parsedCookie

  if (!props[index].requestBody.formatted || !props[index].requestBody.formatted.length) {
    props[index].requestBody.formatted = '<div class="pl-4 text-cy-gray text-xs font-mono">(No content)</div>'
  }

  if (!props[index].responseBody.formatted || !props[index].responseBody.formatted.length) {
    if (bodyRaw && typeof bodyRaw === 'string' && bodyRaw.trim().length > 0) {
      props[index].responseBody.formatted = transform(bodyRaw, 'plaintext')
    } else {
      props[index].responseBody.formatted = '<div class="pl-4 text-cy-gray text-xs font-mono">(No content)</div>'
    }
  }

  props[index].responseHeaders.body = headers
  props[index].responseHeaders.formatted = transform(headers)

  let size: number
  if (contentLengthHeader) {
    size = parseInt(contentLengthHeader)
  } else {
    const bodyForSize = props[index].responseBody.body
    if (typeof bodyForSize === 'string') {
      const cleanString = bodyForSize.replace(/\r\n/g, '\n')
      const finalString = isValidJson(cleanString) ? cleanString.replace(/\s/g, '') : cleanString
      size = new Blob([finalString]).size
    } else {
      size = calculateSize(bodyForSize as object)
    }
  }
  props[index].size = convertSize(size)
  res.size = size

  const yielded = res

  const findSnapshotElement = () => {
    return Cypress.$(`#${props[index].id}`, { log: false })
  }

  cy.window({ log: false })
    .then(findSnapshotElement)
    .then(($el) => {

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

      log.set({
        consoleProps() {
          return {
            yielded,
            cURL: generateCurl()
          }
        }
      })

      window.props[testId] = props

      log.set({ $el });
      log.snapshot('response').end()

      doc.getElementById('api-view-bottom')?.scrollIntoView()

      if (getPluginConfig('snapshotOnly')) {
        app.unmount()
        removeStyles()
      }

      return res

    })
}