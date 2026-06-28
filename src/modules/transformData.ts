import { RequestProps } from "../types"
import { transform } from "./transform"
import { isValidJson } from '../utils/isValidJson'

export const transformData = (props: RequestProps[], index: number) => {

  // format request body
  const requestBody = props[index].requestBody.body
  const requestHeaders = props[index].requestHeaders.body
  let bodyForTransform: any = requestBody
  let bodyLanguage: 'json' | 'html' | 'xml' | 'blob' | 'plaintext' = 'json'
  
  if (requestBody !== undefined && requestBody !== null) {
    if (typeof requestBody === 'string') {
      const contentType = requestHeaders?.['content-type'] || requestHeaders?.['Content-Type'] || ''
      if (contentType.includes('application/x-www-form-urlencoded')) {
        try {
          const params = new URLSearchParams(requestBody)
          const jsonObject: Record<string, string> = {}
          params.forEach((value, key) => {
            jsonObject[key] = value
          })
          bodyForTransform = jsonObject
          bodyLanguage = 'json'
        } catch {
          bodyForTransform = requestBody
          bodyLanguage = 'plaintext'
        }
      } else {
        bodyForTransform = requestBody
        bodyLanguage = 'plaintext'
      }
    } else {
      const bodyString = typeof requestBody === 'object' && requestBody !== null ? Object.prototype.toString.call(requestBody) : ''
      const isArrayBuffer = requestBody instanceof ArrayBuffer || bodyString === '[object ArrayBuffer]'
      
      if (isArrayBuffer) {
        const decoder = new TextDecoder()
        const buffer = requestBody instanceof ArrayBuffer ? requestBody : (requestBody as any).buffer || requestBody
        let decodedString = ''
        try {
          const uint8Array = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
          decodedString = decoder.decode(uint8Array)
        } catch {
          try {
            decodedString = decoder.decode(buffer)
          } catch {
            decodedString = `[ArrayBuffer: ${buffer.byteLength || 0} bytes]`
          }
        }
        
        if (decodedString && isValidJson(decodedString)) {
          try {
            bodyForTransform = JSON.parse(decodedString)
            bodyLanguage = 'json'
          } catch {
            bodyForTransform = decodedString
            bodyLanguage = 'plaintext'
          }
        } else {
          bodyForTransform = decodedString
          bodyLanguage = 'plaintext'
        }
      } else if (requestBody instanceof Uint8Array) {
        const decoder = new TextDecoder()
        let decodedString = ''
        try {
          decodedString = decoder.decode(requestBody)
        } catch {
          decodedString = `[Uint8Array: ${requestBody.length} bytes]`
        }
        
        if (decodedString && isValidJson(decodedString)) {
          try {
            bodyForTransform = JSON.parse(decodedString)
            bodyLanguage = 'json'
          } catch {
            bodyForTransform = decodedString
            bodyLanguage = 'plaintext'
          }
        } else {
          bodyForTransform = decodedString
          bodyLanguage = 'plaintext'
        }
    } else if (requestBody instanceof FormData) {
      const jsonObject: Record<string, string> = {}
      requestBody.forEach((value, key) => {
        if (value instanceof File) {
          jsonObject[key] = `[File: ${value.name}, ${value.size} bytes, ${value.type}]`
        } else {
          jsonObject[key] = String(value)
        }
      })
      bodyForTransform = Object.keys(jsonObject).length > 0 
        ? jsonObject
        : {}
      bodyLanguage = 'json'
      } else if (requestBody instanceof Blob) {
        bodyForTransform = `[Blob: ${requestBody.size} bytes, ${requestBody.type || 'no type'}]`
        bodyLanguage = 'plaintext'
      }
    }
  }
  
  props[index].requestBody.formatted = transform(bodyForTransform, bodyLanguage)
  
  // format request headers
  props[index].requestHeaders.formatted = transform(props[index].requestHeaders.body)
  // format query
  props[index].query.formatted = transform(props[index].query.body)
  // format auth
  props[index].auth.formatted = transform(props[index].auth.body)

}