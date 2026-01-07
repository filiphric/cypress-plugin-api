import { RequestProps } from '../types';

export const generateCurl = (item: RequestProps): string => {
  // Ensure URL is not empty
  const url = item.url || '';
  
  let curl = `curl -X ${item.method || 'GET'} "${url}"`;

  // Add Basic Auth credentials (if present)
  if (item.auth?.body) {
    const auth = item.auth.body;
    if (auth.user && auth.pass) {
      curl += ` -u "${auth.user}:${auth.pass}"`;
    } else if (auth.user) {
      curl += ` -u "${auth.user}"`;
    } else if (auth.bearer) {
      // Bearer token can be in auth.bearer or in Authorization header
      curl += ` -H "Authorization: Bearer ${auth.bearer}"`;
    }
  }

  // Add query parameters (if present)
  if (item.query?.body && Object.keys(item.query.body).length > 0) {
    const queryParams = new URLSearchParams();
    Object.entries(item.query.body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      // Check if URL already has query parameters
      const separator = url.includes('?') ? '&' : '?';
      curl = curl.replace(`"${url}"`, `"${url}${separator}${queryString}"`);
    }
  }

  // Add headers
  if (item.requestHeaders?.body && Object.keys(item.requestHeaders.body).length > 0) {
    Object.entries(item.requestHeaders.body).forEach(([key, value]) => {
      curl += ` -H "${key}: ${value}"`;
    });
  }

  // Add request body - only for methods that typically have bodies
  // GET requests should not have bodies unless explicitly provided
  const method = (item.method || 'GET').toUpperCase();
  const body = item.requestBody?.body;
  
  // Only add body if it's not undefined/null and not an empty object for GET requests
  if (body !== undefined && body !== null) {
    // For GET requests, skip empty objects (they shouldn't have bodies)
    if (method === 'GET' && typeof body === 'object' && !Array.isArray(body) && Object.keys(body).length === 0) {
      // Skip empty object body for GET request
    } else {
      if (Array.isArray(body)) {
        // Handle arrays
        curl += ` -d '${JSON.stringify(body)}'`;
      } else if (typeof body === 'object') {
        // Handle objects (including empty objects for non-GET requests)
        curl += ` -d '${JSON.stringify(body)}'`;
      } else if (typeof body === 'string') {
        // Handle strings
        curl += ` -d '${body}'`;
      } else if (typeof body === 'number' || typeof body === 'boolean') {
        // Handle numbers and booleans
        curl += ` -d '${String(body)}'`;
      }
    }
  }

  return curl;
};

