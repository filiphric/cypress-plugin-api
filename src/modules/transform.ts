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
      
      // Increase indentation for content inside root brace
      const lines = content.split('\n')
      const adjustedLines = lines.map((line) => {
        const trimmed = line.trim()
        const indent = line.length - trimmed.length
        
        if (indent > 0 && trimmed !== '}' && trimmed !== ']') {
          return '  ' + line
        }
        if (indent > 0 && (trimmed === '}' || trimmed === ']' || trimmed.endsWith('},') || trimmed.endsWith('],'))) {
          return '  ' + line
        }
        
        return line
      })
      content = adjustedLines.join('\n')
      
      // Align closing braces/brackets with their opening counterparts
      const linesForBraceFix = content.split('\n')
      const braceStack: Array<{lineIndex: number, indent: number, type: 'brace' | 'bracket'}> = []
      const closingMap = new Map<number, number>()
      
      // Track opening braces/brackets and match with closing ones
      for (let i = 0; i < linesForBraceFix.length; i++) {
        const line = linesForBraceFix[i]
        const trimmed = line.trim()
        const baseIndent = line.length - trimmed.length
        
        // Skip empty objects/arrays
        if (/^\s*\{\s*\}[,\s]*$/.test(line) || 
            /^\s*\[\s*\][,\s]*$/.test(line) ||
            /:\s*\{\s*\}[,\s]*$/.test(trimmed) ||
            /:\s*\[\s*\][,\s]*$/.test(trimmed)) {
          continue
        }
        
        if (trimmed.includes('{') && 
            !/^\s*\{\s*\}[,\s]*$/.test(line) && 
            !/:\s*\{\s*\}[,\s]*$/.test(trimmed)) {
          braceStack.push({lineIndex: i, indent: baseIndent, type: 'brace'})
        }
        
        if (trimmed.includes('[') && 
            !/^\s*\[\s*\][,\s]*$/.test(line) && 
            !/:\s*\[\s*\][,\s]*$/.test(trimmed)) {
          braceStack.push({lineIndex: i, indent: baseIndent, type: 'bracket'})
        }
        
        if (/^[^}]*\}[,]*$/.test(trimmed) && 
            !/^\s*\{\s*\}[,\s]*$/.test(line) &&
            !/:\s*\{\s*\}[,\s]*$/.test(trimmed)) {
          for (let j = braceStack.length - 1; j >= 0; j--) {
            if (braceStack[j].type === 'brace') {
              closingMap.set(i, braceStack[j].indent)
              braceStack.splice(j, 1)
              break
            }
          }
        }
        else if (/^[^\]]*\][,]*$/.test(trimmed) && 
                 !/^\s*\[\s*\][,\s]*$/.test(line) &&
                 !/:\s*\[\s*\][,\s]*$/.test(trimmed)) {
          for (let j = braceStack.length - 1; j >= 0; j--) {
            if (braceStack[j].type === 'bracket') {
              closingMap.set(i, braceStack[j].indent)
              braceStack.splice(j, 1)
              break
            }
          }
        }
      }
      
      // Fix indentation of closing braces/brackets
      const fixedLines: string[] = []
      for (let i = 0; i < linesForBraceFix.length; i++) {
        const line = linesForBraceFix[i]
        const trimmed = line.trim()
        
        if (/^\s*\{\s*\}[,\s]*$/.test(line) || 
            /^\s*\[\s*\][,\s]*$/.test(line) ||
            /:\s*\{\s*\}[,\s]*$/.test(trimmed) ||
            /:\s*\[\s*\][,\s]*$/.test(trimmed)) {
          fixedLines.push(line)
          continue
        }
        
        if (closingMap.has(i)) {
          const targetIndent = closingMap.get(i)!
          const closingMatch = trimmed.match(/([}\]][,]*)$/)
          if (closingMatch) {
            const closing = closingMatch[1]
            fixedLines.push(' '.repeat(targetIndent) + closing)
            continue
          }
        }
        
        fixedLines.push(line)
      }
      
      // Remove empty lines before closing braces/brackets
      const cleanedLines: string[] = []
      for (let i = 0; i < fixedLines.length; i++) {
        const line = fixedLines[i]
        const trimmed = line.trim()
        
        if (!trimmed && i + 1 < fixedLines.length) {
          const nextTrimmed = fixedLines[i + 1].trim()
          if (/^[}\]][,]*$/.test(nextTrimmed)) {
            continue
          }
        }
        
        cleanedLines.push(line)
      }
      
      content = cleanedLines.join('\n')
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
            replacement: '<details class="contents" open><summary class="brace"><span class="token punctuation">{</span></summary>',
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
            replacement: '<details class="contents" open><summary class="bracket"><span class="token punctuation">[</span></summary>',
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
      
      code = code.replace(/<\/summary>\s*\n\s*(<span class="line-number)/g, '</summary>$1')
      code = code.replace(/(<span class="line-number[^>]*>[^<]*<\/span>)\s*\n\s*(<span class="line-number[^>]*>[^<]*<\/span>\s*<span class="token punctuation closing-[^"]*">[}\]])/g, '$2')
      code = code.replace(/(<\/details>)\s*\n\s*(<span class="line-number[^>]*>[^<]*<\/span>\s*<span class="token punctuation closing-[^"]*">[}\]])/g, '$1$2')
    }

    return `<code class="language-${language}">${code}</code>`
  }

  return ''

}