import React, { useState, useCallback, useRef, useEffect } from 'react'
import './JsonTree.css'

interface JsonTreeProps {
  data: any
  name?: string
  defaultExpanded?: boolean
  depth?: number
}

interface JsonNodeProps {
  name: string | number
  value: any
  depth: number
  isLast: boolean
  defaultExpanded?: boolean
}

function JsonNode({ name, value, depth, isLast, defaultExpanded = depth < 2 }: JsonNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [copied, setCopied] = useState(false)
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value)
  const isArray = Array.isArray(value)
  const isExpandable = isObject || isArray
  const nodeRef = useRef<HTMLDivElement>(null)

  const handleCopy = useCallback(async (format: 'value' | 'json' | 'path') => {
    let text: string
    if (format === 'value') {
      text = typeof value === 'string' ? value : JSON.stringify(value)
    } else if (format === 'json') {
      text = JSON.stringify(value, null, 2)
    } else {
      text = JSON.stringify(value)
    }
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } catch {
      // 降级
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    }
  }, [value])

  const renderValue = () => {
    if (value === null) return <span className="json-null">null</span>
    if (value === undefined) return <span className="json-undefined">undefined</span>
    if (typeof value === 'string') return <span className="json-string">"{value}"</span>
    if (typeof value === 'number') return <span className="json-number">{value}</span>
    if (typeof value === 'boolean') return <span className="json-boolean">{value.toString()}</span>
    return null
  }

  return (
    <div className="json-node" ref={nodeRef}>
      <div 
        className={`json-row ${isExpandable ? 'expandable' : ''}`}
        onClick={() => isExpandable && setExpanded(!expanded)}
      >
        {isExpandable ? (
          <svg 
            className={`json-chevron ${expanded ? 'expanded' : ''}`}
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        ) : (
          <span className="json-spacer" />
        )}
        
        <span className="json-key">{name}</span>
        <span className="json-colon">:</span>
        
        {isExpandable ? (
          <span className="json-preview">
            {isArray ? `[${value.length}]` : `{${Object.keys(value).length}}`}
          </span>
        ) : (
          renderValue()
        )}

        <div className="json-actions">
          <button 
            className={`json-copy-btn ${copied ? 'copied' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleCopy('value')
            }}
            title={copied ? '已复制' : '复制值'}
          >
            {copied ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {isExpandable && expanded && (
        <div className="json-children">
          {isArray ? (
            value.map((item: any, index: number) => (
              <JsonNode
                key={index}
                name={index}
                value={item}
                depth={depth + 1}
                isLast={index === value.length - 1}
                defaultExpanded={depth < 1}
              />
            ))
          ) : (
            Object.entries(value).map(([key, val], index, arr) => (
              <JsonNode
                key={key}
                name={key}
                value={val}
                depth={depth + 1}
                isLast={index === arr.length - 1}
                defaultExpanded={depth < 1}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

interface JsonTreeRootProps {
  data: any
  title?: string
}

export function JsonTree({ data, title }: JsonTreeRootProps) {
  const [copiedAll, setCopiedAll] = useState(false)

  const handleCopyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1000)
    } catch {}
  }, [data])

  return (
    <div className="json-tree">
      {title && (
        <div className="json-tree-header">
          <span className="json-tree-title">{title}</span>
          <button 
            className={`json-tree-copy ${copiedAll ? 'copied' : ''}`}
            onClick={handleCopyAll}
          >
            {copiedAll ? '已复制' : '复制全部'}
          </button>
        </div>
      )}
      <div className="json-tree-content">
        <JsonNode name="root" value={data} depth={0} isLast={true} defaultExpanded={true} />
      </div>
    </div>
  )
}
