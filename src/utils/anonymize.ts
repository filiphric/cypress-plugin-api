import { requestProps } from '../types';

export const anonymize = (options: requestProps) => {

  // as defined here https://github.com/request/request#http-authentication
  const authKeys = ['user', 'username', 'pass', 'password', 'bearer']
  const headerKeys = ['authorization'] // we may add more in future?

  authKeys.forEach(k => {
    if (options.auth && options.auth[k]) {
      options.auth[k] = options?.auth[k].replace(/./g, '*')
    }
  })

  headerKeys.forEach(k => {
    if (options.requestHeaders && options.requestHeaders[k]) {
      options.requestHeaders[k] = options?.requestHeaders[k].replace(/./g, '*')
    }
  })

  return options
}