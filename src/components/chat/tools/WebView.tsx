import React, { useState } from 'react'
import './ToolView.css'

interface WebResult {
  title: string
  url: string
  snippet: string
}

interface WebViewProps {
  query: string
  results?: WebResult[]
}

export function WebView({ query, results }: WebViewProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="tool-view web-view">
      <div className="tool-view-header" onClick={() => setExpanded(!expanded)}>
        <div className="tool-view-icon web">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <span className="tool-view-title">网页搜索</span>
        <code className="tool-view-query">"{query}"</code>
        {results && <span className="result-count">{results.length} 个结果</span>}
        <svg 
          className={`expand-icon ${expanded ? 'expanded' : ''}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {expanded && results && (
        <div className="tool-view-body">
          {results.length === 0 ? (
            <div className="no-results">未找到结果</div>
          ) : (
            <div className="web-results">
              {results.map((result, i) => (
                <div key={i} className="web-result-item">
                  <div className="result-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                      {result.title}
                    </a>
                  </div>
                  <div className="result-url">{result.url}</div>
                  <div className="result-snippet">{result.snippet}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
