import React, { useState } from 'react'
import './ToolView.css'

interface DiffLine {
  type: 'add' | 'remove' | 'context'
  line: string
  oldLine?: number
  newLine?: number
}

interface FileEditViewProps {
  filePath: string
  diff?: string
  content?: string
}

function parseDiff(diff: string): DiffLine[] {
  return diff.split('\n').map((line, i) => {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      return { type: 'add', line: line.substring(1), newLine: i }
    }
    if (line.startsWith('-') && !line.startsWith('---')) {
      return { type: 'remove', line: line.substring(1), oldLine: i }
    }
    return { type: 'context', line: line.startsWith(' ') ? line.substring(1) : line }
  })
}

export function FileEditView({ filePath, diff, content }: FileEditViewProps) {
  const [expanded, setExpanded] = useState(true)
  const [showDiff, setShowDiff] = useState(true)

  const fileName = filePath.split(/[/\\]/).pop() || filePath
  const diffLines = diff ? parseDiff(diff) : null

  return (
    <div className="tool-view file-edit-view">
      <div className="tool-view-header" onClick={() => setExpanded(!expanded)}>
        <div className="tool-view-icon edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <span className="tool-view-title">编辑文件</span>
        <code className="tool-view-filepath">{fileName}</code>
        {diff && (
          <button 
            className="diff-toggle"
            onClick={(e) => { e.stopPropagation(); setShowDiff(!showDiff) }}
          >
            {showDiff ? '查看内容' : '查看差异'}
          </button>
        )}
        <svg 
          className={`expand-icon ${expanded ? 'expanded' : ''}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {expanded && (
        <div className="tool-view-body">
          <div className="file-path-line">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <code>{filePath}</code>
          </div>
          {diffLines && showDiff ? (
            <div className="diff-container">
              {diffLines.map((line, i) => (
                <div key={i} className={`diff-line ${line.type}`}>
                  <span className="diff-marker">
                    {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                  </span>
                  <code>{line.line}</code>
                </div>
              ))}
            </div>
          ) : content ? (
            <pre className="file-content">{content}</pre>
          ) : null}
        </div>
      )}
    </div>
  )
}
