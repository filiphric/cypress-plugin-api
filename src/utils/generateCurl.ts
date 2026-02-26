import type { RequestProps } from '../types'

export const generateCurl = (item: RequestProps): string => {
  const url = item.url || ''
  const separator = url.includes('?') ? '&' : '?'
  const queryBody = item.query?.body
  const queryString =
    queryBody && typeof queryBody === 'object' && Object.keys(queryBody).length > 0
      ? Object.entries(queryBody)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&')
      : ''
  const fullUrl = queryString ? `${url}${separator}${queryString}` : url

  let curl = `curl -X ${item.method || 'GET'} "${fullUrl}"`

  const auth = item.auth?.body
  if (auth && typeof auth === 'object') {
    if (auth.user != null && auth.pass != null) {
      curl += ` -u "${auth.user}:${auth.pass}"`
    } else if (auth.bearer) {
      curl += ` -H "Authorization: Bearer ${auth.bearer}"`
    } else if (auth.user != null) {
      curl += ` -u "${auth.user}"`
    }
  }

  const headers = item.requestHeaders?.body
  if (headers && typeof headers === 'object') {
    Object.entries(headers).forEach(([key, value]) => {
      if (value != null) curl += ` -H "${key}: ${value}"`
    })
  }

  const body = item.requestBody?.body
  if (body !== undefined && body !== null) {
    if (typeof body === 'object' && !Array.isArray(body) && !(body instanceof FormData) && !(body instanceof Blob)) {
      curl += ` -d '${JSON.stringify(body)}'`
    } else if (typeof body === 'string') {
      curl += ` -d '${body}'`
    } else {
      curl += ` -d '${String(body)}'`
    }
  }

  return curl
}
