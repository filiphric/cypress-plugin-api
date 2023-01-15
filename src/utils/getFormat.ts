import { isValidJson } from "@utils/isValidJson";
import { isValidXml } from "@utils/isValidXml";
import { isValidHtml } from "@utils/isValidHtml";
import { isValidBlob } from "@utils/isValidBlob";

export function getFormat(str: string) {
  if (isValidJson(str)) {
    return "json";
  } else if (isValidXml(str)) {
    return "xml";
  } else if (isValidHtml(str)) {
    return "html";
  } else if (isValidBlob(str)) {
    return "blob";
  } else {
    return "plaintext";
  }
}
