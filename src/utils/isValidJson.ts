export const isValidJson = (input: any): boolean => {
  // all objects are JSONs
  if (typeof input === 'object') {
    return true;
  } else if (typeof input === 'string') {
    // strings are tested for JSON format
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}