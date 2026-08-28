import React, { useState, useRef, useEffect } from 'react'
import './ReasoningRow.css'

interface ReasoningRowProps {
  text: string
  running?: boolean
}

function firstLine(text: string): string {
  const lines = text.split('\n').filter(l => l.trim())
  return lines[0]?.trim().slice(0, 160) || ''
}

function latestLine(text: string): string {
  const lines = text.split('\n').filter(l => l.trim())
  return lines[lines.length - 1]?.trim().slice(0, 160) || ''
}

export function ReasoningRow({ text, running = false }: ReasoningRowProps) {
  const [expanded, setExpanded] = useState(false)
  const summaryRef = useRef<HTMLSpanElement>(null)

  const summary = running ? latestLine(text) : firstLine(text)

  useEffect(() => {
    if (running && summaryRef.current) {
      summaryRef.current.scrollLeft = summaryRef.current.scrollWidth - summaryRef.current.clientWidth
    }
  }, [summary, running])

  return (
    <div className="reasoning-row" data-state={running ? 'running' : 'settled'}>
      <button
        className="reasoning-toggle"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        title="展开/折叠思考过程"
      >
        <svg
          className={`reasoning-icon ${expanded ? 'expanded' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        <span className="reasoning-label">思考</span>
        <span className="reasoning-separator" aria-hidden>·</span>
        <span
          ref={summaryRef}
          className={`reasoning-summary ${running ? 'streaming' : ''}`}
          data-follow-end={running || undefined}
        >
          {summary}
        </span>
        <svg
          className={`reasoning-chevron ${expanded ? 'expanded' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {expanded && (
        <div className="reasoning-body">
          <div className="reasoning-text">{text}</div>
        </div>
      )}
    </div>
  )
}
