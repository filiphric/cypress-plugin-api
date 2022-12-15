import { isValidUrl } from "@utils/isValidUrl"
import { ApiRequestOptions, RequestProps } from "src/types"
const { _ } = Cypress

export const cloneProps = (props: RequestProps[], index: number, options: ApiRequestOptions) => {
  props[index].method = _.cloneDeep(options.method) || 'GET'
  props[index].url = isValidUrl(options.url) ? options.url : Cypress.config('baseUrl') + options.url
  props[index].query.body = _.cloneDeep(options.qs)
  props[index].auth.body = _.cloneDeep(options.auth)
  props[index].requestHeaders.body = _.cloneDeep(options.headers)
  props[index].requestBody.body = _.cloneDeep(options.body)
}