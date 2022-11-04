const hljs = require('highlight.js/lib/common');

export const transform = (body: any, language: 'json' | 'html' | 'xml' | 'plaintext' = 'json') => {
  let content = language === 'json' ? JSON.stringify(body, null, 2) : body
  return body ? hljs.highlight(content, { language }).value : ''
}