import { isValidJson } from "./isValidJson"

export const calculateSize = (value: object) => {

  if (value === null || value === undefined) {
    return 0
  }

  const stringified = value.toString()
  // remove all carriage return symbols
  const cleanString = stringified.replace(/\r\n/g, '\n')
  // replace white spaces if value is a JSON
  const finalString = isValidJson(cleanString) ? cleanString.replace(/\s/g, '') : cleanString
  const byteCount = new Blob([finalString]).size

  return byteCount

}
