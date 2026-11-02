export interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  paragraphs: number
  readingTimeMinutes: number
  speakingTimeMinutes: number
}

export function analyzeText(text: string): TextStats {
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s+/g, '').length
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const lines = text === '' ? 0 : text.split('\n').length
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length

  // Average reading speed: ~200-250 wpm, speaking: ~130-150 wpm
  const readingTimeMinutes = Math.ceil(words / 225)
  const speakingTimeMinutes = Math.ceil(words / 140)

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
  }
}

export function convertCase(
  text: string,
  targetCase: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' | 'pascal' | 'constant'
): string {
  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) return ''

  switch (targetCase) {
    case 'upper':
      return text.toUpperCase()
    case 'lower':
      return text.toLowerCase()
    case 'title':
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    case 'camel':
      return (
        words[0].toLowerCase() +
        words
          .slice(1)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join('')
      )
    case 'pascal':
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
    case 'snake':
      return words.map((w) => w.toLowerCase()).join('_')
    case 'kebab':
      return words.map((w) => w.toLowerCase()).join('-')
    case 'constant':
      return words.map((w) => w.toUpperCase()).join('_')
    default:
      return text
  }
}
