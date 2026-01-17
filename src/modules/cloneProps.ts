import { isValidUrlOrIp } from "@utils/isValidUrlOrIp"
import { ApiRequestOptions, RequestProps } from "../types"
const { _ } = Cypress

export const cloneProps = (props: RequestProps[], index: number, options: ApiRequestOptions) => {
  props[index].method = _.cloneDeep(options.method) || 'GET'
  
  let finalUrl = ''
  
  if (options.url) {
    if (isValidUrlOrIp(options.url)) {
      finalUrl = options.url
    } else {
      const baseUrl = Cypress.config('baseUrl')
      if (baseUrl && typeof baseUrl === 'string' && baseUrl.trim() !== '') {
        const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
        const path = options.url.startsWith('/') ? options.url : '/' + options.url
        finalUrl = base + path
      } else {
        finalUrl = options.url
      }
    }
  }
  
  props[index].url = finalUrl
  
  props[index].query.body = _.cloneDeep(options.qs)
  props[index].auth.body = _.cloneDeep(options.auth)
  props[index].requestHeaders.body = _.cloneDeep(options.headers)
  
  if (options.body instanceof FormData) {
    const formData = new FormData()
    options.body.forEach((value, key) => {
      formData.append(key, value)
    })
    props[index].requestBody.body = formData
  } else if (options.body instanceof ArrayBuffer) {
    props[index].requestBody.body = options.body.slice(0)
  } else if (options.body instanceof Blob) {
    props[index].requestBody.body = options.body
  } else {
    props[index].requestBody.body = _.cloneDeep(options.body)
  }
}