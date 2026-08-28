import React, { useState } from 'react'
import { ToolCall } from '../../store'
import './ToolDetails.css'

interface ToolDetailsProps {
  tool: ToolCall
  isOpen: boolean
  onClose: () => void
}

type Tab = 'input' | 'output' | 'meta'

export function ToolDetails({ tool, isOpen, onClose }: ToolDetailsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('input')

  if (!isOpen) return null

  let parsedArgs: Record<string, any> = {}
  try {
    parsedArgs = JSON.parse(tool.arguments || '{}')
  } catch {
    parsedArgs = { raw: tool.arguments }
  }

  return (
    <div className="tool-details-overlay" onClick={onClose}>
      <div className="tool-details-panel" onClick={(e) => e.stopPropagation()}>
        <div className="details-header">
          <div className="details-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            <span>{tool.name}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="details-tabs">
          <button 
            className={`tab ${activeTab === 'input' ? 'active' : ''}`}
            onClick={() => setActiveTab('input')}
          >
            输入
          </button>
          <button 
            className={`tab ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            输出
          </button>
          <button 
            className={`tab ${activeTab === 'meta' ? 'active' : ''}`}
            onClick={() => setActiveTab('meta')}
          >
            元数据
          </button>
        </div>

        <div className="details-content">
          {activeTab === 'input' && (
            <pre className="code-view">
              {JSON.stringify(parsedArgs, null, 2)}
            </pre>
          )}
          {activeTab === 'output' && (
            <pre className="code-view">
              {tool.result || '(无输出)'}
            </pre>
          )}
          {activeTab === 'meta' && (
            <div className="meta-view">
              <div className="meta-row">
                <span className="meta-label">工具名称</span>
                <span className="meta-value">{tool.name}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">调用 ID</span>
                <span className="meta-value mono">{tool.id}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">参数长度</span>
                <span className="meta-value">{tool.arguments.length} 字符</span>
              </div>
              {tool.result && (
                <div className="meta-row">
                  <span className="meta-label">结果长度</span>
                  <span className="meta-value">{tool.result.length} 字符</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="details-footer">
          <button 
            className="copy-all-btn"
            onClick={() => {
              const data = JSON.stringify({ tool: tool.name, input: parsedArgs, output: tool.result }, null, 2)
              navigator.clipboard.writeText(data)
            }}
          >
            复制全部
          </button>
        </div>
      </div>
    </div>
  )
}
