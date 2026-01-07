import { isValidJson } from "@utils/isValidJson";
import { isValidXml } from "@utils/isValidXml";
import { isValidHtml } from "@utils/isValidHtml";
import { isValidBlob } from "@utils/isValidBlob";

export function getFormat(str: string) {
  if (isValidJson(str)) {
    return "json";
  } else if (isValidHtml(str)) {
    // Check HTML before XML because HTML is a subset of XML
    // HTML documents will pass XML validation, so we need to check HTML first
    return "html";
  } else if (isValidXml(str)) {
    return "xml";
  } else if (isValidBlob(str)) {
    return "blob";
  } else {
    return "plaintext";
  }
}
