export function isValidHtml(str: string) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.documentElement.nodeName === "html";
  } catch (_) {
    return false;
  }
}
