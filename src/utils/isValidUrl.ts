export const isValidUrl = (str: any) => {
  try {
    return new URL(str);
  } catch (e) {
    return null;
  }
}
