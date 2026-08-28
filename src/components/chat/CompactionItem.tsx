import React, { useState } from 'react'
import './CompactionItem.css'

interface CompactionItemProps {
  beforeTokens: number
  afterTokens: number
  removedMessages: number
  summary?: string
  timestamp?: number
}

export function CompactionItem({ 
  beforeTokens, 
  afterTokens, 
  removedMessages, 
  summary,
  timestamp 
}: CompactionItemProps) {
  const [expanded, setExpanded] = useState(false)
  const saved = beforeTokens - afterTokens

  return (
    <div className="compaction-item">
      <div className="compaction-header" onClick={() => setExpanded(!expanded)}>
        <div className="compaction-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 14 10 14 10 20"/>
            <polyline points="20 10 14 10 14 4"/>
            <line x1="14" y1="10" x2="21" y2="3"/>
            <line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        </div>
        <span className="compaction-title">上下文已压缩</span>
        <span className="compaction-summary">
          节省 {saved.toLocaleString()} tokens，移除 {removedMessages} 条消息
        </span>
        <svg 
          className={`expand-icon ${expanded ? 'expanded' : ''}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {expanded && (
        <div className="compaction-details">
          <div className="detail-row">
            <span>压缩前</span>
            <span>{beforeTokens.toLocaleString()} tokens</span>
          </div>
          <div className="detail-row">
            <span>压缩后</span>
            <span>{afterTokens.toLocaleString()} tokens</span>
          </div>
          <div className="detail-row">
            <span>节省</span>
            <span className="saved">{saved.toLocaleString()} tokens</span>
          </div>
          {summary && (
            <div className="compaction-summary-text">
              <span className="summary-label">摘要</span>
              <p>{summary}</p>
            </div>
          )}
          {timestamp && (
            <div className="detail-row timestamp">
              <span>{new Date(timestamp).toLocaleString('zh-CN')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
