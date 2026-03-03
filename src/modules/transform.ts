import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import { isValidJson } from '../utils/isValidJson';

export const transform = (body: any, language: 'json' | 'html' | 'xml' | 'markup' | 'blob' | 'plaintext' = 'json') => {
  if (body == null) return ''

  const content = language === 'json'
    ? JSON.stringify(body, null, 2)
    : String(body);

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const grammar = Prism.languages[language];

  // Fallback for unregistered languages (e.g. plaintext/blob):
  // encode HTML, add line numbers, and return without Prism highlighting.
  if (!grammar) {
    const escaped = escapeHtml(content);
    const code = escaped
      .split('\n')
      .map((line, num) =>
        `<span class="line-number text-slate-700 select-none contents align-top">${(num + 1)
          .toString()
          .padStart(4, ' ')}  </span>${line}`,
      )
      .join('\n');

    return `<code class="language-plaintext">${code}</code>`;
  }

  const formatted = Prism.highlight(content, grammar, language);

  let code = formatted
    .split('\n')
    .map(
      (line, num) =>
        `<span class="line-number text-slate-700 select-none contents align-top">${(num + 1)
          .toString()
          .padStart(4, ' ')}  </span>${line}`,
    )
    .join('\n');

  // add folding to every json object and array
  if (isValidJson(content)) {
    code = code
      .replaceAll(
        '<span class="token punctuation">{</span>',
        '<details class="contents" open><summary class="inline-block brace"><span class="token punctuation">{</span></summary>',
      )
      .replaceAll(
        '<span class="token punctuation">[</span>',
        '<details class="contents" open><summary class="inline-block bracket"><span class="token punctuation">[</span></summary>',
      )
      .replaceAll(
        '<span class="token punctuation">}</span>',
        '</details><span class="token punctuation inline-block">}</span>',
      )
      .replaceAll(
        '<span class="token punctuation">]</span>',
        '</details><span class="token punctuation inline-block">]</span>',
      );
  }

  return `<code class="language-${language}">${code}</code>`

}