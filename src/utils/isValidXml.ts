export const isValidXml = (str: string) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "application/xml");
    return doc.documentElement.nodeName !== "parsererror";
  } catch (_) {
    return false;
  }
}
