export const isValidJson = (input: any): boolean => {
  if (typeof input === 'object') {
    return true;
  } else if (typeof input === 'string') {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  } else {
    return false;
  }
}