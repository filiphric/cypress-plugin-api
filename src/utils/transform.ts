import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/plugins/line-numbers/prism-line-numbers';

// import 'prism-js-fold'

export const transform = (body: any, language: 'json' | 'html' | 'xml' | 'plaintext' = 'json') => {
  let content = language === 'json' ? JSON.stringify(body, null, 2) : body
  if (body) {
    let formatted = Prism.highlight(content, Prism.languages[language], language)
    const html = formatted.split('\n')
      .map((line, num) => `<span class="line-number text-slate-700">${(num + 1).toString().padStart(4, ' ')}</span>  ${line}`)
      .join('\n');
    return html
  }

  return ''

}