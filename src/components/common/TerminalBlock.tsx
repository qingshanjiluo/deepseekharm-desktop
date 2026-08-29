import React, { useState, useCallback } from 'react'
import { parseAnsi, ansiToStyle } from '../../utils/ansi'
import { CopyButton } from '../common/CopyButton'
import './TerminalBlock.css'

interface TerminalBlockProps {
  command?: string
  output: string
  exitCode?: number
  cwd?: string
  isRunning?: boolean
}

export function TerminalBlock({ 
  command, 
  output, 
  exitCode,
  cwd = '~',
  isRunning = false,
}: TerminalBlockProps) {
  const [expanded, setExpanded] = useState(true)
  const [showFull, setShowFull] = useState(false)

  const parsedSegments = parseAnsi(output)
  const displayOutput = showFull ? output : output.slice(0, 2000)
  const isTruncated = output.length > 2000

  return (
    <div className="terminal-block">
      {/* 运行状态头 */}
      <div className="terminal-header">
        <div className="terminal-status">
          <span className={`status-dot ${isRunning ? 'running' : exitCode === 0 ? 'success' : 'error'}`} />
          {command && (
            <span className="terminal-command">
              <span className="terminal-prompt">$</span>
              {command}
            </span>
          )}
        </div>
        <div className="terminal-actions">
          {isRunning && <span className="running-indicator">运行中...</span>}
          {!isRunning && exitCode !== undefined && (
            <span className={`exit-code ${exitCode === 0 ? 'success' : 'error'}`}>
              exit {exitCode}
            </span>
          )}
          <CopyButton text={output} />
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

      {/* 输出内容 */}
      {expanded && (
        <div className="terminal-output">
          <div className="output-content">
            {parsedSegments.map((segment, i) => (
              <span key={i} style={ansiToStyle(segment.style)}>
                {segment.text}
              </span>
            ))}
          </div>
          {isTruncated && !showFull && (
            <button className="show-more" onClick={() => setShowFull(true)}>
              显示全部 ({output.length} 字符)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
