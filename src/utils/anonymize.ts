import { RequestProps, HideCredentialsOptions } from '../types';
import { getPluginConfig } from './pluginConfig';

const mask = (value: unknown): string => {
  if (value == null) return '****'
  if (typeof value === 'string') return value.replace(/./g, '*')
  return '****'
}

export const anonymize = (options: RequestProps) => {

  const hideCredentialsOptions = getPluginConfig('hideCredentialsOptions')
  const optionsUndefined = hideCredentialsOptions === undefined

  const anonymizeOptions: HideCredentialsOptions = {
    auth: [],
    body: [],
    headers: [],
    qs: [],
    ...hideCredentialsOptions
  }

  if (optionsUndefined) {
    anonymizeOptions.auth?.push('user', 'username', 'pass', 'password', 'bearer')
    anonymizeOptions.headers?.push('authorization', 'Authorization', 'password', 'username', 'token', 'api-key', 'x-api-key', 'apiKey')
    anonymizeOptions.body?.push('pass', 'password', 'token', 'secret', 'apiKey', 'api_key')
    anonymizeOptions.qs?.push('token', 'key', 'apiKey', 'api_key', 'secret', 'password')
  }

  const headersToMask = new Set((anonymizeOptions.headers ?? []).map((h: string) => h.toLowerCase()))

  anonymizeOptions.auth?.forEach(k => {
    if (options.auth.body && options.auth.body[k] != null) {
      options.auth.body[k] = mask(options.auth.body[k])
    }
  })

  // Headers: match case-insensitively so we mask regardless of Authorization vs authorization
  if (options.requestHeaders?.body && typeof options.requestHeaders.body === 'object') {
    Object.keys(options.requestHeaders.body).forEach(headerKey => {
      if (headersToMask.has(headerKey.toLowerCase())) {
        (options.requestHeaders.body as Record<string, unknown>)[headerKey] = mask((options.requestHeaders.body as Record<string, unknown>)[headerKey])
      }
    })
  }

  anonymizeOptions.body?.forEach(k => {
    if (options.requestBody.body && typeof options.requestBody.body === 'object' && options.requestBody.body !== null && k in options.requestBody.body) {
      const bodyValue = (options.requestBody.body as Record<string, any>)[k]
      ;(options.requestBody.body as Record<string, any>)[k] = mask(bodyValue)
    }
  })

  anonymizeOptions.qs?.forEach(k => {
    if (options.query.body && typeof options.query.body === 'object' && k in options.query.body) {
      const queryValue = (options.query.body as Record<string, unknown>)[k]
      ;(options.query.body as Record<string, unknown>)[k] = mask(queryValue)
    }
  })

  return options
}