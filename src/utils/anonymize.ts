import { RequestProps, HideCredentialsOptions } from '../types';

export const anonymize = (options: RequestProps) => {

  const optionsUndefined = Cypress.env('hideCredentialsOptions') === undefined

  const anonymizeOptions: HideCredentialsOptions = {
    auth: [],
    body: [],
    headers: [],
    ...Cypress.env('hideCredentialsOptions')
  }

  if (optionsUndefined) {
    // as defined here https://github.com/request/request#http-authentication
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
    if (options.requestBody.body && options.requestBody.body[k as keyof Cypress.RequestBody]) {
      // @ts-ignore until I figure out how to fix this
      options.requestBody.body[k] = options?.requestBody.body[k].replace(/./g, '*')
    }
  })

  return options
}