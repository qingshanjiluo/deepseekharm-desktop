import React, { useState } from 'react'
import { useAppStore, Message, ToolCall } from '../../store'
import { useTranslation } from '../../i18n'
import { TrajectoryTimeline } from './TrajectoryTimeline'
import './TrajectoryView.css'

interface TrajectoryViewProps {
  isOpen: boolean
  onClose: () => void
}

type TrajectoryTab = 'messages' | 'tools' | 'tokens' | 'json' | 'timeline'

export function TrajectoryView({ isOpen, onClose }: TrajectoryViewProps) {
  const { currentSessionId, settings } = useAppStore()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TrajectoryTab>('messages')
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())
  
  const currentSession = useAppStore(state =>
    state.sessions.find(s => s.id === state.currentSessionId)
  )

  if (!isOpen || !currentSession) return null

  // 切换消息展开状态
  const toggleMessageExpand = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })
  }

  // 获取所有工具调用
  const allToolCalls = currentSession.messages.reduce<ToolCall[]>((acc, msg) => {
    if (msg.toolCalls) {
      acc.push(...msg.toolCalls)
    }
    return acc
  }, [])

  // 计算 Token 统计
  const tokenStats = currentSession.messages.reduce((acc, msg) => {
    if (msg.usage) {
      acc.prompt += msg.usage.promptTokens
      acc.completion += msg.usage.completionTokens
      acc.total += msg.usage.totalTokens
    }
    return acc
  }, { prompt: 0, completion: 0, total: 0 })

  const tabs: { id: TrajectoryTab; label: string; count?: number }[] = [
    { id: 'messages', label: '消息', count: currentSession.messages.length },
    { id: 'tools', label: '工具调用', count: allToolCalls.length },
    { id: 'tokens', label: 'Token 统计', count: tokenStats.total },
    { id: 'json', label: 'JSON 导出' },
    { id: 'timeline', label: '时间线' },
  ]

  // 导出 JSON
  const handleExportJSON = () => {
    const data = {
      session: {
        id: currentSession.id,
        name: currentSession.name,
        createdAt: currentSession.createdAt,
        updatedAt: currentSession.updatedAt,
        model: currentSession.model,
      },
      messages: currentSession.messages,
      tokenStats,
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentSession.name || 'trajectory'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 复制 JSON 到剪贴板
  const handleCopyJSON = () => {
    const data = {
      session: {
        id: currentSession.id,
        name: currentSession.name,
        createdAt: currentSession.createdAt,
        updatedAt: currentSession.updatedAt,
        model: currentSession.model,
      },
      messages: currentSession.messages,
      tokenStats,
    }
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  }

  return (
    <div className="trajectory-overlay" onClick={onClose}>
      <div className="trajectory-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="trajectory-header">
          <h2 className="trajectory-title">轨迹视图</h2>
          <div className="trajectory-meta">
            <span>{currentSession.name}</span>
            <span className="meta-separator">•</span>
            <span>{currentSession.messages.length} 条消息</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* 标签页 */}
        <div className="trajectory-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="tab-count">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="trajectory-content">
          {/* 消息轨迹 */}
          {activeTab === 'messages' && (
            <div className="messages-trajectory">
              {currentSession.messages.map((message, index) => (
                <div 
                  key={message.id} 
                  className={`trajectory-item ${message.role}`}
                  onClick={() => toggleMessageExpand(message.id)}
                >
                  <div className="item-header">
                    <div className="item-role">
                      {message.role === 'user' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                          <path d="M2 17l10 5 10-5"/>
                          <path d="M2 12l10 5 10-5"/>
                        </svg>
                      )}
                      <span>{message.role === 'user' ? '用户' : '助手'}</span>
                    </div>
                    <div className="item-meta">
                      <span className="item-index">#{index + 1}</span>
                      <span className="item-time">
                        {new Date(message.timestamp).toLocaleTimeString(settings.locale)}
                      </span>
                      {message.usage && (
                        <span className="item-tokens">{message.usage.totalTokens} tokens</span>
                      )}
                      <svg 
                        className={`expand-icon ${expandedMessages.has(message.id) ? 'expanded' : ''}`}
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                  
                  {expandedMessages.has(message.id) && (
                    <div className="item-content">
                      <pre className="message-text">{message.content}</pre>
                      {message.toolCalls && message.toolCalls.length > 0 && (
                        <div className="tool-calls-inline">
                          <span className="tool-calls-label">工具调用:</span>
                          {message.toolCalls.map(tc => (
                            <span key={tc.id} className="tool-call-badge">{tc.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 工具调用轨迹 */}
          {activeTab === 'tools' && (
            <div className="tools-trajectory">
              {allToolCalls.length === 0 ? (
                <div className="empty-trajectory">暂无工具调用</div>
              ) : (
                allToolCalls.map(toolCall => (
                  <div key={toolCall.id} className="tool-trajectory-item">
                    <div className="tool-header">
                      <span className="tool-name">{toolCall.name}</span>
                      <span className="tool-id">{toolCall.id}</span>
                    </div>
                    <div className="tool-body">
                      <div className="tool-section">
                        <span className="section-label">参数:</span>
                        <pre className="section-content">{toolCall.arguments}</pre>
                      </div>
                      {toolCall.result && (
                        <div className="tool-section">
                          <span className="section-label">结果:</span>
                          <pre className="section-content">{toolCall.result}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Token 统计 */}
          {activeTab === 'tokens' && (
            <div className="tokens-trajectory">
              <div className="token-stats-grid">
                <div className="token-stat-card">
                  <span className="stat-label">提示词 Tokens</span>
                  <span className="stat-value">{tokenStats.prompt}</span>
                </div>
                <div className="token-stat-card">
                  <span className="stat-label">回复 Tokens</span>
                  <span className="stat-value">{tokenStats.completion}</span>
                </div>
                <div className="token-stat-card highlight">
                  <span className="stat-label">总 Tokens</span>
                  <span className="stat-value">{tokenStats.total}</span>
                </div>
              </div>
              
              <div className="token-usage-list">
                <h4>每条消息 Token 使用量</h4>
                {currentSession.messages.map((msg, idx) => (
                  <div key={msg.id} className="token-usage-item">
                    <span className="usage-index">#{idx + 1}</span>
                    <span className="usage-role">{msg.role === 'user' ? '用户' : '助手'}</span>
                    <div className="usage-bar-container">
                      <div 
                        className="usage-bar" 
                        style={{ 
                          width: `${msg.usage ? (msg.usage.totalTokens / tokenStats.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="usage-tokens">{msg.usage?.totalTokens || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JSON 导出 */}
          {activeTab === 'json' && (
            <div className="json-trajectory">
              <div className="json-actions">
                <button className="json-action-btn" onClick={handleCopyJSON}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  复制 JSON
                </button>
                <button className="json-action-btn" onClick={handleExportJSON}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  下载 JSON
                </button>
              </div>
              <pre className="json-preview">
                {JSON.stringify({
                  session: {
                    id: currentSession.id,
                    name: currentSession.name,
                    model: currentSession.model,
                  },
                  messages: currentSession.messages.map(m => ({
                    role: m.role,
                    content: m.content,
                    timestamp: m.timestamp,
                    usage: m.usage,
                  })),
                  tokenStats,
                }, null, 2)}
              </pre>
            </div>
          )}

          {/* 时间线视图 */}
          {activeTab === 'timeline' && (
            <TrajectoryTimeline 
              messages={currentSession.messages}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}
