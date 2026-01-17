import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import { isValidJson } from '../utils/isValidJson';

export const transform = (body: any, language: 'json' | 'html' | 'xml' | 'blob' | 'plaintext' = 'json') => {
  let content: string
  if (language === 'json') {
    if (body === undefined || body === null) {
      return ''
    }
    if (typeof body === 'string') {
      try {
        const parsed = JSON.parse(body)
        content = JSON.stringify(parsed, null, 2)
      } catch {
        content = body
      }
    } else {
      content = JSON.stringify(body, null, 2)
    }
    
    if (content) {
      content = content.replace(/\[\s*\n\s*\]/gm, '[]')
      content = content.replace(/\{\s*\n\s*\}/gm, '{}')
    }
  } else {
    if (body === undefined || body === null) {
      return ''
    }
    content = typeof body === 'string' ? body : String(body)
  }
  
  if (content) {
    let prismLanguageName: string = language
    if (language === 'html' || language === 'xml') {
      prismLanguageName = 'markup'
    }
    
    const prismLanguage = Prism.languages[prismLanguageName]
    if (!prismLanguage) {
      return `<code class="language-plaintext">${content}</code>`
    }
    const formatted = Prism.highlight(content, prismLanguage, prismLanguageName)

    let code = formatted.split('\n')
      .map((line, num) => `<span class="line-number text-slate-700 select-none contents align-top">${(num + 1).toString().padStart(4, ' ')}  </span>${line}`)
      .join('\n');

    if (language === 'json' && isValidJson(content)) {
      const openBracePattern = '<span class="token punctuation">{</span>'
      const closeBracePattern = '<span class="token punctuation">}</span>'
      const openBracketPattern = '<span class="token punctuation">[</span>'
      const closeBracketPattern = '<span class="token punctuation">]</span>'
      
      interface TokenPosition {
        index: number
        type: 'openBrace' | 'closeBrace' | 'openBracket' | 'closeBracket'
        nestingLevel: number
      }
      
      const tokens: TokenPosition[] = []
      let searchIndex = 0
      
      while ((searchIndex = code.indexOf(openBracePattern, searchIndex)) !== -1) {
        tokens.push({ index: searchIndex, type: 'openBrace', nestingLevel: 0 })
        searchIndex += openBracePattern.length
      }
      
      searchIndex = 0
      while ((searchIndex = code.indexOf(closeBracePattern, searchIndex)) !== -1) {
        tokens.push({ index: searchIndex, type: 'closeBrace', nestingLevel: 0 })
        searchIndex += closeBracePattern.length
      }
      
      searchIndex = 0
      while ((searchIndex = code.indexOf(openBracketPattern, searchIndex)) !== -1) {
        tokens.push({ index: searchIndex, type: 'openBracket', nestingLevel: 0 })
        searchIndex += openBracketPattern.length
      }
      
      searchIndex = 0
      while ((searchIndex = code.indexOf(closeBracketPattern, searchIndex)) !== -1) {
        tokens.push({ index: searchIndex, type: 'closeBracket', nestingLevel: 0 })
        searchIndex += closeBracketPattern.length
      }
      
      tokens.sort((a, b) => a.index - b.index)
      
      const stack: Array<{ type: 'brace' | 'bracket', index: number, nestingLevel: number }> = []
      const matchedPairs: Array<{ open: number, close: number, type: 'brace' | 'bracket' }> = []
      
      for (const token of tokens) {
        if (token.type === 'openBrace' || token.type === 'openBracket') {
          const type = token.type === 'openBrace' ? 'brace' : 'bracket'
          const nestingLevel = stack.length
          stack.push({ type, index: token.index, nestingLevel })
          token.nestingLevel = nestingLevel
        } else if (token.type === 'closeBrace' || token.type === 'closeBracket') {
          const type = token.type === 'closeBrace' ? 'brace' : 'bracket'
          let matchingIndex = -1
          for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i].type === type) {
              matchingIndex = i
              break
            }
          }
          
          if (matchingIndex !== -1) {
            const openToken = stack[matchingIndex]
            matchedPairs.push({ open: openToken.index, close: token.index, type })
            stack.splice(matchingIndex, 1)
            token.nestingLevel = openToken.nestingLevel
          }
        }
      }
      
      interface Replacement {
        index: number
        replacement: string
        originalLength: number
      }
      
      const allReplacements: Replacement[] = []
      
      for (const pair of matchedPairs) {
        const openEnd = pair.open + (pair.type === 'brace' ? openBracePattern.length : openBracketPattern.length)
        const contentBetween = code.substring(openEnd, pair.close)
        const isEmpty = contentBetween.trim().length === 0 || contentBetween.match(/^[\s\n]*$/)
        
        if (isEmpty) {
          continue
        }
        
        const commaPattern = '<span class="token punctuation">,</span>'
        const closeIndex = pair.close
        const afterClose = code.substring(closeIndex + (pair.type === 'brace' ? closeBracePattern.length : closeBracketPattern.length))
        const hasComma = afterClose.trim().startsWith(commaPattern)
        
        if (pair.type === 'brace') {
          allReplacements.push({
            index: pair.open,
            replacement: '<details class="contents" open><summary class="inline-block brace"><span class="token punctuation">{</span></summary>',
            originalLength: openBracePattern.length
          })
          if (hasComma) {
            allReplacements.push({
              index: pair.close,
              replacement: '<span class="token punctuation closing-brace">}</span><span class="token punctuation">,</span></details>',
              originalLength: closeBracePattern.length + commaPattern.length
            })
          } else {
            allReplacements.push({
              index: pair.close,
              replacement: '<span class="token punctuation closing-brace">}</span></details>',
              originalLength: closeBracePattern.length
            })
          }
        } else {
          allReplacements.push({
            index: pair.open,
            replacement: '<details class="contents" open><summary class="inline-block bracket"><span class="token punctuation">[</span></summary>',
            originalLength: openBracketPattern.length
          })
          if (hasComma) {
            allReplacements.push({
              index: pair.close,
              replacement: '<span class="token punctuation closing-bracket">]</span><span class="token punctuation">,</span></details>',
              originalLength: closeBracketPattern.length + commaPattern.length
            })
          } else {
            allReplacements.push({
              index: pair.close,
              replacement: '<span class="token punctuation closing-bracket">]</span></details>',
              originalLength: closeBracketPattern.length
            })
          }
        }
      }
      
      allReplacements.sort((a, b) => b.index - a.index)
      
      for (const replacement of allReplacements) {
        code = code.substring(0, replacement.index) + replacement.replacement + code.substring(replacement.index + replacement.originalLength)
      }
    }

    return `<code class="language-${language}">${code}</code>`
  }

  return ''

}