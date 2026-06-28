import { isValidJson } from "./isValidJson"

export const calculateSize = (value: object) => {

  if (!value) {
    return 0
  }

  const stringified = value.toString()
  const cleanString = stringified.replace(/\r\n/g, '\n')
  const finalString = isValidJson(cleanString) ? cleanString.replace(/\s/g, '') : cleanString
  const byteCount = new Blob([finalString]).size

  return byteCount

}
