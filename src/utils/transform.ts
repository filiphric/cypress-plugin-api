import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { isStringValidJson } from './isStringValidJson';

export const transform = (body: any, language: 'json' | 'html' | 'xml' | 'plaintext' = 'json') => {
  let content = language === 'json' ? JSON.stringify(body, null, 2) : body
  if (body) {
    let formatted = Prism.highlight(content, Prism.languages[language], language)

    let code = formatted.split('\n')
      .map((line, num) => `<span class="line-number text-slate-700 select-none contents align-top">${(num + 1).toString().padStart(4, ' ')}  </span>${line}`)
      .join('\n');


    // add folding to every json object and array
    if (isStringValidJson(content)) {
      code = code
        .replaceAll('<span class="token punctuation">{</span>', '<details class="contents" open><summary class="inline-block brace"><span class="token punctuation">{</span></summary>')
        .replaceAll('<span class="token punctuation">[</span>', '<details class="contents" open><summary class="inline-block bracket"><span class="token punctuation">[</span></summary>')
        .replaceAll('<span class="token punctuation">}</span>', '</details><span class="token punctuation inline-block">}</span>')
        .replaceAll('<span class="token punctuation">]</span>', '</details><span class="token punctuation inline-block">]</span>')
    }

    return `<code class="language-${language}">${code}</code>`
  }

  return ''

}