import type { RequestProps } from '../types'

const escapeForDoubleQuotes = (value: unknown): string => {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, '\\n')
}

const escapeForSingleQuotes = (value: unknown): string => {
  return String(value)
    .replace(/\r?\n/g, '\\n')
    .replace(/'/g, "'\\''")
}

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
  const safeUrl = escapeForDoubleQuotes(fullUrl)

  let curl = `curl -X ${item.method || 'GET'} "${safeUrl}"`

  const auth = item.auth?.body as any
  if (auth && typeof auth === 'object') {
    const userRaw = auth.user ?? auth.username
    const passRaw = auth.pass ?? auth.password

    const user = userRaw != null ? escapeForDoubleQuotes(userRaw) : null
    const pass = passRaw != null ? escapeForDoubleQuotes(passRaw) : null

    if (user !== null && pass !== null) {
      curl += ` -u "${user}:${pass}"`
    } else if (auth.bearer != null) {
      const bearer = escapeForDoubleQuotes(auth.bearer)
      curl += ` -H "Authorization: Bearer ${bearer}"`
    } else if (user !== null) {
      curl += ` -u "${user}"`
    }
  }

  const headers = item.requestHeaders?.body
  if (headers && typeof headers === 'object') {
    Object.entries(headers).forEach(([key, value]) => {
      if (value == null) return
      const safeKey = escapeForDoubleQuotes(key)
      const safeValue = escapeForDoubleQuotes(value)
      curl += ` -H "${safeKey}: ${safeValue}"`
    })
  }

  const body = item.requestBody?.body
  if (body !== undefined && body !== null) {
    if (typeof body === 'object' && !Array.isArray(body) && !(body instanceof FormData) && !(body instanceof Blob)) {
      const json = JSON.stringify(body)
      const safeJson = escapeForSingleQuotes(json)
      curl += ` -d '${safeJson}'`
    } else if (typeof body === 'string') {
      const safeBody = escapeForSingleQuotes(body)
      curl += ` -d '${safeBody}'`
    } else {
      const safeBody = escapeForSingleQuotes(String(body))
      curl += ` -d '${safeBody}'`
    }
  }

  return curl
}
