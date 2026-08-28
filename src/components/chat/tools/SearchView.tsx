import React, { useState } from 'react'
import './ToolView.css'

interface SearchResult {
  file: string
  line: number
  content: string
  match?: string
}

interface SearchViewProps {
  query: string
  results?: SearchResult[]
  resultCount?: number
}

export function SearchView({ query, results, resultCount }: SearchViewProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="tool-view search-view">
      <div className="tool-view-header" onClick={() => setExpanded(!expanded)}>
        <div className="tool-view-icon search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <span className="tool-view-title">搜索</span>
        <code className="tool-view-query">"{query}"</code>
        {resultCount !== undefined && (
          <span className="result-count">{resultCount} 个结果</span>
        )}
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
            <div className="no-results">未找到匹配结果</div>
          ) : (
            <div className="search-results">
              {results.map((result, i) => (
                <div key={i} className="search-result-item">
                  <div className="result-file">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <code>{result.file}</code>
                    <span className="line-badge">:{result.line}</span>
                  </div>
                  <pre className="result-content">{result.content}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
