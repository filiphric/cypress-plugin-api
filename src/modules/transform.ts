import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import { isValidJson } from '../utils/isValidJson';

export const transform = (body: any, language: 'json' | 'html' | 'xml' | 'blob' | 'plaintext' = 'json') => {
  const content = language === 'json' ? JSON.stringify(body, null, 2) : body
  if (body) {
    // Map language names to Prism.js language names
    // prism-markup registers the language as 'markup' (not 'html' or 'xml')
    // We use 'markup' for highlighting but keep the original language for CSS class
    let prismLanguageName: string = language
    if (language === 'html' || language === 'xml') {
      // Use 'markup' for both HTML and XML - prism-markup handles both
      // The import should have registered 'markup' language at module load time
      prismLanguageName = 'markup'
    }
    
    const prismLanguage = Prism.languages[prismLanguageName]
    if (!prismLanguage) {
      // If language isn't available, fallback to plaintext
      return `<code class="language-plaintext">${content}</code>`
    }
    const formatted = Prism.highlight(content, prismLanguage, prismLanguageName)

    let code = formatted.split('\n')
      .map((line, num) => `<span class="line-number text-slate-700 select-none contents align-top">${(num + 1).toString().padStart(4, ' ')}  </span>${line}`)
      .join('\n');


    // add folding to every json object and array
    if (isValidJson(content)) {
      code = code
        .replaceAll('<span class="token punctuation">{</span>', '<details class="contents"><summary class="inline-block brace"><span class="token punctuation">{</span></summary>')
        .replaceAll('<span class="token punctuation">[</span>', '<details class="contents"><summary class="inline-block bracket"><span class="token punctuation">[</span></summary>')
        .replaceAll('<span class="token punctuation">}</span>', '</details><span class="token punctuation inline-block">}</span>')
        .replaceAll('<span class="token punctuation">]</span>', '</details><span class="token punctuation inline-block">]</span>')
    }

    return `<code class="language-${language}">${code}</code>`
  }

  return ''

}