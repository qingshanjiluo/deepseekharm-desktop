import React, { useState } from 'react'
import { ToolCall } from '../../store'
import { getToolView } from './tools'
import './ToolCallTree.css'

interface ToolCallTreeProps {
  toolCalls: ToolCall[]
}

export function ToolCallTree({ toolCalls }: ToolCallTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (toolCalls.length === 0) return null

  return (
    <div className="tool-call-tree">
      <div className="tree-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        <span>工具调用 ({toolCalls.length})</span>
      </div>
      <div className="tree-content">
        {toolCalls.map((tool) => (
          <ToolCallItem
            key={tool.id}
            tool={tool}
            isExpanded={expandedIds.has(tool.id)}
            onToggle={() => toggleExpand(tool.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface ToolCallItemProps {
  tool: ToolCall
  isExpanded: boolean
  onToggle: () => void
}

function ToolCallItem({ tool, isExpanded, onToggle }: ToolCallItemProps) {
  // 解析参数
  let parsedArgs: Record<string, any> = {}
  try {
    parsedArgs = JSON.parse(tool.arguments || '{}')
  } catch {
    parsedArgs = { raw: tool.arguments }
  }

  // 获取工具图标
  const getToolIcon = (name: string) => {
    if (name.includes('read') || name.includes('file')) {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      )
    }
    if (name.includes('write') || name.includes('edit')) {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      )
    }
    if (name.includes('search') || name.includes('grep')) {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      )
    }
    if (name.includes('bash') || name.includes('exec') || name.includes('run')) {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4 17 10 11 4 5"/>
          <line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
      )
    }
    // 默认工具图标
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    )
  }

  // 尝试获取专用工具视图
  const specializedView = getToolView(tool)

  return (
    <div className={`tool-call-item ${isExpanded ? 'expanded' : ''}`}>
      <div className="tool-header" onClick={onToggle}>
        <div className="tool-icon">{getToolIcon(tool.name)}</div>
        <div className="tool-info">
          <span className="tool-name">{tool.name}</span>
          {!isExpanded && (
            <span className="tool-summary">
              {Object.keys(parsedArgs).slice(0, 2).map(k => k).join(', ')}
              {Object.keys(parsedArgs).length > 2 ? '...' : ''}
            </span>
          )}
        </div>
        <svg 
          className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      
      {isExpanded && (
        <div className="tool-details">
          {/* 优先使用专用视图 */}
          {specializedView ? (
            specializedView
          ) : (
            <>
              {/* 参数 */}
              <div className="tool-section">
                <div className="section-header">
                  <span className="section-label">参数</span>
                </div>
                <pre className="code-block">
                  {JSON.stringify(parsedArgs, null, 2)}
                </pre>
              </div>

              {/* 结果 */}
              {tool.result && (
                <div className="tool-section">
                  <div className="section-header">
                    <span className="section-label">结果</span>
                  </div>
                  <pre className="code-block result">
                    {tool.result.length > 500 
                      ? tool.result.substring(0, 500) + '\n...'
                      : tool.result
                    }
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
