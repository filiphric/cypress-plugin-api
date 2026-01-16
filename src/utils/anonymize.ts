import { RequestProps, HideCredentialsOptions } from '../types';

export const anonymize = (options: RequestProps) => {

  const optionsUndefined = Cypress.env('hideCredentialsOptions') === undefined

  const anonymizeOptions: HideCredentialsOptions = {
    auth: [],
    body: [],
    headers: [],
    qs: [],
    ...Cypress.env('hideCredentialsOptions')
  }

  if (optionsUndefined) {
    anonymizeOptions.auth?.push('user', 'username', 'pass', 'password', 'bearer')
    anonymizeOptions.headers?.push('authorization', 'Authorization', 'password', 'username')
    anonymizeOptions.body?.push('pass', 'password')
  }

  anonymizeOptions.auth?.forEach(k => {
    if (options.auth.body && options.auth.body[k]) {
      options.auth.body[k] = options?.auth.body[k].replace(/./g, '*')
    }
  })

  anonymizeOptions.headers?.forEach(k => {
    if (options.requestHeaders.body && options.requestHeaders.body[k]) {
      options.requestHeaders.body[k] = options?.requestHeaders.body[k].replace(/./g, '*')
    }
  })

  anonymizeOptions.body?.forEach(k => {
    if (options.requestBody.body && typeof options.requestBody.body === 'object' && options.requestBody.body !== null && k in options.requestBody.body) {
      const bodyValue = (options.requestBody.body as Record<string, any>)[k]
      if (typeof bodyValue === 'string') {
        (options.requestBody.body as Record<string, any>)[k] = bodyValue.replace(/./g, '*')
      }
    }
  })

  anonymizeOptions.qs?.forEach(k => {
    if (options.query.body && k in options.query.body) {
      const queryValue = options.query.body[k]
      if (typeof queryValue === 'string') {
        options.query.body[k] = queryValue.replace(/./g, '*')
      }
    }
  })

  return options
}