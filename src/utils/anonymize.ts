import { requestProps } from '../types';

export const anonymize = (options: requestProps) => {

  // as defined here https://github.com/request/request#http-authentication
  const authKeys = ['user', 'username', 'pass', 'password', 'bearer']
  const headerKeys = ['authorization', 'Authorization', 'password', 'username'] // we may add more in future?

  authKeys.forEach(k => {
    if (options.auth.body && options.auth.body[k]) {
      options.auth.body[k] = options?.auth.body[k].replace(/./g, '*')
    }
  })

  headerKeys.forEach(k => {
    if (options.requestHeaders.body && options.requestHeaders.body[k]) {
      options.requestHeaders.body[k] = options?.requestHeaders.body[k].replace(/./g, '*')
    }
  })

  return options
}