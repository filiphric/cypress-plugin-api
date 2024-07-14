import { RequestProps } from "../types"
import { transform } from "./transform"

export const transformData = (props: RequestProps[], index: number) => {

  // format request body
  props[index].requestBody.formatted = transform(props[index].requestBody.body)
  // format request headers
  props[index].requestHeaders.formatted = transform(props[index].requestHeaders.body)
  // format query
  props[index].query.formatted = transform(props[index].query.body)
  // format auth
  props[index].auth.formatted = transform(props[index].auth.body)

}