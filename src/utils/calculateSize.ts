export const calculateSize = (value: any) => {

  const stringified = value.toString()
  // remove all carriage return symbols
  const cleanString = stringified.replace(/\r\n/g, '\n')
  // replace white spaces if value is a JSON
  const finalString = isJsonString(cleanString) ? cleanString.replace(/\s/g, '') : cleanString
  const byteCount = new Blob([finalString]).size

  return byteCount

}

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}