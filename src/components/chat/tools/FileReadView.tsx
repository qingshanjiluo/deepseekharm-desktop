import React, { useState } from 'react'
import './ToolView.css'

interface FileReadViewProps {
  filePath: string
  content?: string
  lineCount?: number
  startLine?: number
}

export function FileReadView({ filePath, content, lineCount, startLine = 1 }: FileReadViewProps) {
  const [expanded, setExpanded] = useState(true)

  const fileName = filePath.split(/[/\\]/).pop() || filePath
  const lines = content?.split('\n') || []

  return (
    <div className="tool-view file-read-view">
      <div className="tool-view-header" onClick={() => setExpanded(!expanded)}>
        <div className="tool-view-icon read">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <span className="tool-view-title">读取文件</span>
        <code className="tool-view-filepath">{fileName}</code>
        {lineCount && <span className="line-count">{lineCount} 行</span>}
        <svg 
          className={`expand-icon ${expanded ? 'expanded' : ''}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {expanded && content && (
        <div className="tool-view-body">
          <div className="file-path-line">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <code>{filePath}</code>
          </div>
          <pre className="file-content with-line-numbers">
            {lines.map((line, i) => (
              <div key={i} className="code-line">
                <span className="line-number">{startLine + i}</span>
                <span className="line-text">{line}</span>
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  )
}
