export const isValidUrl = (str: string | URL) => {
  try {
    return new URL(str);
  } catch (e) {
    return null;
  }
}
