import { RequestProps } from '../types';

export const generateCurl = (item: RequestProps): string => {
  const url = item.url || '';
  
  let curl = `curl -X ${item.method || 'GET'} "${url}"`;

  if (item.auth?.body) {
    const auth = item.auth.body;
    if (auth.user && auth.pass) {
      curl += ` -u "${auth.user}:${auth.pass}"`;
    } else if (auth.user) {
      curl += ` -u "${auth.user}"`;
    } else if (auth.bearer) {
      curl += ` -H "Authorization: Bearer ${auth.bearer}"`;
    }
  }

  if (item.query?.body && Object.keys(item.query.body).length > 0) {
    const queryParams = new URLSearchParams();
    Object.entries(item.query.body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      const separator = url.includes('?') ? '&' : '?';
      curl = curl.replace(`"${url}"`, `"${url}${separator}${queryString}"`);
    }
  }

  if (item.requestHeaders?.body && Object.keys(item.requestHeaders.body).length > 0) {
    Object.entries(item.requestHeaders.body).forEach(([key, value]) => {
      curl += ` -H "${key}: ${value}"`;
    });
  }

  const method = (item.method || 'GET').toUpperCase();
  const body = item.requestBody?.body;
  
  if (body !== undefined && body !== null) {
    if (!(method === 'GET' && typeof body === 'object' && !Array.isArray(body) && Object.keys(body).length === 0)) {
      if (Array.isArray(body)) {
        curl += ` -d '${JSON.stringify(body)}'`;
      } else if (typeof body === 'object') {
        curl += ` -d '${JSON.stringify(body)}'`;
      } else if (typeof body === 'string') {
        curl += ` -d '${body}'`;
      } else if (typeof body === 'number' || typeof body === 'boolean') {
        curl += ` -d '${String(body)}'`;
      }
    }
  }

  return curl;
};

