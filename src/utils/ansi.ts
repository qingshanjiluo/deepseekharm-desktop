// ANSI 转义码解析器 - 简化版
// 支持基本 SGR (Select Graphic Rendition) 属性

interface AnsiStyle {
  color?: string
  backgroundColor?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
}

interface AnsiSegment {
  text: string
  style: AnsiStyle
}

// 8 色 ANSI 调色板
const ANSI_COLORS = [
  '#000000', '#c91b00', '#00c200', '#c7c400',
  '#0225c7', '#ca30c7', '#00c5c7', '#c7c7c7',
]

// 8 色 ANSI 亮色
const ANSI_BRIGHT_COLORS = [
  '#686868', '#ff6e67', '#5ffa68', '#fffc67',
  '#6871ff', '#ff77ff', '#60fdff', '#ffffff',
]

function parseAnsiSGR(params: number[]): AnsiStyle {
  const style: AnsiStyle = {}
  let i = 0

  while (i < params.length) {
    const code = params[i]

    if (code === 0) {
      // 重置
      return {}
    } else if (code === 1) {
      style.bold = true
    } else if (code === 2) {
      // dim (忽略)
    } else if (code === 3) {
      style.italic = true
    } else if (code === 4) {
      style.underline = true
    } else if (code === 9) {
      style.strikethrough = true
    } else if (code >= 30 && code <= 37) {
      // 前景色
      style.color = ANSI_COLORS[code - 30]
    } else if (code === 38) {
      // 扩展前景色
      if (params[i + 1] === 5 && params[i + 2] !== undefined) {
        // 256 色
        const colorIndex = params[i + 2]
        if (colorIndex < 16) {
          style.color = colorIndex < 8 ? ANSI_COLORS[colorIndex] : ANSI_BRIGHT_COLORS[colorIndex - 8]
        } else if (colorIndex < 232) {
          // 6x6x6 色彩立方
          const idx = colorIndex - 16
          const r = Math.floor(idx / 36) * 51
          const g = Math.floor((idx % 36) / 6) * 51
          const b = (idx % 6) * 51
          style.color = `rgb(${r},${g},${b})`
        } else {
          // 灰度
          const gray = (colorIndex - 232) * 10 + 8
          style.color = `rgb(${gray},${gray},${gray})`
        }
        i += 2
      } else if (params[i + 1] === 2 && params[i + 4] !== undefined) {
        // 24-bit 真彩色
        style.color = `rgb(${params[i + 2]},${params[i + 3]},${params[i + 4]})`
        i += 4
      }
    } else if (code === 39) {
      // 默认前景色
      delete style.color
    } else if (code >= 40 && code <= 47) {
      // 背景色
      style.backgroundColor = ANSI_COLORS[code - 40]
    } else if (code === 48) {
      // 扩展背景色 (类似 38)
      if (params[i + 1] === 5 && params[i + 2] !== undefined) {
        const colorIndex = params[i + 2]
        if (colorIndex < 16) {
          style.backgroundColor = colorIndex < 8 ? ANSI_COLORS[colorIndex] : ANSI_BRIGHT_COLORS[colorIndex - 8]
        } else if (colorIndex < 232) {
          const idx = colorIndex - 16
          const r = Math.floor(idx / 36) * 51
          const g = Math.floor((idx % 36) / 6) * 51
          const b = (idx % 6) * 51
          style.backgroundColor = `rgb(${r},${g},${b})`
        } else {
          const gray = (colorIndex - 232) * 10 + 8
          style.backgroundColor = `rgb(${gray},${gray},${gray})`
        }
        i += 2
      } else if (params[i + 1] === 2 && params[i + 4] !== undefined) {
        style.backgroundColor = `rgb(${params[i + 2]},${params[i + 3]},${params[i + 4]})`
        i += 4
      }
    } else if (code === 49) {
      // 默认背景色
      delete style.backgroundColor
    }

    i++
  }

  return style
}

export function parseAnsi(input: string): AnsiSegment[] {
  const segments: AnsiSegment[] = []
  const regex = /\x1b\[([0-9;]*)m/g
  let lastIndex = 0
  let currentStyle: AnsiStyle = {}

  let match
  while ((match = regex.exec(input)) !== null) {
    // 添加匹配前的文本
    if (match.index > lastIndex) {
      segments.push({
        text: input.slice(lastIndex, match.index),
        style: { ...currentStyle },
      })
    }

    // 解析 SGR 参数
    const params = match[1].split(';').map(Number)
    currentStyle = parseAnsiSGR(params)
    lastIndex = regex.lastIndex
  }

  // 添加剩余文本
  if (lastIndex < input.length) {
    segments.push({
      text: input.slice(lastIndex),
      style: { ...currentStyle },
    })
  }

  return segments
}

export function ansiToStyle(style: AnsiStyle): React.CSSProperties {
  const cssStyle: React.CSSProperties = {}

  if (style.color) cssStyle.color = style.color
  if (style.backgroundColor) cssStyle.backgroundColor = style.backgroundColor
  if (style.bold) cssStyle.fontWeight = 'bold'
  if (style.italic) cssStyle.fontStyle = 'italic'
  if (style.underline) cssStyle.textDecoration = 'underline'
  if (style.strikethrough) {
    cssStyle.textDecoration = cssStyle.textDecoration 
      ? `${cssStyle.textDecoration} line-through`
      : 'line-through'
  }

  return cssStyle
}
