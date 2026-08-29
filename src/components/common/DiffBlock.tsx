import React, { useState } from 'react'
import './DiffBlock.css'

interface DiffBlockProps {
  content: string
  filePath?: string
  language?: string
}

interface DiffLine {
  type: 'added' | 'removed' | 'context'
  content: string
  lineNumber?: number
}

function parseDiff(content: string): DiffLine[] {
  const lines = content.split('\n')
  const result: DiffLine[] = []
  let lineNumber = 0

  for (const line of lines) {
    if (line.startsWith('+')) {
      lineNumber++
      result.push({ type: 'added', content: line.slice(1), lineNumber })
    } else if (line.startsWith('-')) {
      result.push({ type: 'removed', content: line.slice(1) })
    } else if (line.startsWith('@@')) {
      // 跳过 hunk 头
      continue
    } else if (line.startsWith('diff') || line.startsWith('index') || 
               line.startsWith('---') || line.startsWith('+++')) {
      // 跳过 diff 元数据
      continue
    } else {
      lineNumber++
      result.push({ type: 'context', content: line, lineNumber })
    }
  }

  return result
}

export function DiffBlock({ content, filePath, language }: DiffBlockProps) {
  const [expanded, setExpanded] = useState(true)
  const [showFull, setShowFull] = useState(false)

  const lines = parseDiff(content)
  const addedCount = lines.filter(l => l.type === 'added').length
  const removedCount = lines.filter(l => l.type === 'removed').length
  const displayLines = showFull ? lines : lines.slice(0, 100)
  const isTruncated = lines.length > 100

  return (
    <div className="diff-block">
      {/* 头部 */}
      <div className="diff-header">
        <div className="diff-info">
          {filePath && <span className="diff-filepath">{filePath}</span>}
          {language && <span className="diff-language">{language}</span>}
          <span className="diff-stats">
            <span className="stat-added">+{addedCount}</span>
            <span className="stat-removed">-{removedCount}</span>
          </span>
        </div>
        <div className="diff-actions">
          <button 
            className="expand-toggle"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 内容 */}
      {expanded && (
        <div className="diff-content">
          {displayLines.map((line, index) => (
            <div 
              key={index} 
              className={`diff-line ${line.type}`}
            >
              <span className="line-number">
                {line.type === 'removed' ? '' : line.lineNumber}
              </span>
              <span className="line-prefix">
                {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
              </span>
              <span className="line-content">{line.content}</span>
            </div>
          ))}
          {isTruncated && !showFull && (
            <button className="show-more" onClick={() => setShowFull(true)}>
              显示全部 ({lines.length} 行)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
