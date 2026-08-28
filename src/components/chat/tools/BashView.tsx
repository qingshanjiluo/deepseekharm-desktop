import React, { useState } from 'react'
import './ToolView.css'

interface BashViewProps {
  command: string
  output?: string
  exitCode?: number
}

export function BashView({ command, output, exitCode }: BashViewProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="tool-view bash-view">
      <div className="tool-view-header" onClick={() => setExpanded(!expanded)}>
        <div className="tool-view-icon bash">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 17 10 11 4 5"/>
            <line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
        </div>
        <span className="tool-view-title">终端命令</span>
        <code className="tool-view-command">{command}</code>
        <svg 
          className={`expand-icon ${expanded ? 'expanded' : ''}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {expanded && (
        <div className="tool-view-body">
          <div className="bash-command-line">
            <span className="prompt">$</span>
            <code>{command}</code>
          </div>
          {output && (
            <pre className={`bash-output ${exitCode !== undefined ? (exitCode === 0 ? 'success' : 'error') : ''}`}>
              {output}
            </pre>
          )}
          {exitCode !== undefined && (
            <div className={`exit-code ${exitCode === 0 ? 'success' : 'error'}`}>
              退出码: {exitCode}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
