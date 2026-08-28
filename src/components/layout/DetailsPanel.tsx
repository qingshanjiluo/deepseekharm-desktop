import React, { useState } from 'react'
import { useAppStore } from '../../store'
import './DetailsPanel.css'

export function DetailsPanel() {
  const { settings, updateSettings, isStreaming } = useAppStore()
  const currentSession = useAppStore(state => 
    state.sessions.find(s => s.id === state.currentSessionId)
  )
  const [activeTab, setActiveTab] = useState<'info' | 'tools' | 'context'>('info')

  // 计算 Token 统计
  const tokenStats = currentSession?.messages.reduce(
    (acc, msg) => ({
      prompt: acc.prompt + (msg.usage?.promptTokens || 0),
      completion: acc.completion + (msg.usage?.completionTokens || 0),
      total: acc.total + (msg.usage?.totalTokens || 0),
    }),
    { prompt: 0, completion: 0, total: 0 }
  ) || { prompt: 0, completion: 0, total: 0 }

  // 统计消息数
  const messageCount = currentSession?.messages.length || 0
  const userMessages = currentSession?.messages.filter(m => m.role === 'user').length || 0
  const assistantMessages = currentSession?.messages.filter(m => m.role === 'assistant').length || 0

  // 获取工具调用统计
  const toolCalls = currentSession?.messages.reduce(
    (acc, msg) => {
      if (msg.toolCalls) {
        msg.toolCalls.forEach(tool => {
          const existing = acc.find(t => t.name === tool.name)
          if (existing) {
            existing.count++
            existing.success += tool.result ? 1 : 0
          } else {
            acc.push({
              name: tool.name,
              count: 1,
              success: tool.result ? 1 : 0,
            })
          }
        })
      }
      return acc
    },
    [] as Array<{ name: string; count: number; success: number }>
  ) || []

  // 计算上下文大小
  const contextSize = currentSession?.messages.reduce(
    (acc, msg) => acc + msg.content.length,
    0
  ) || 0

  return (
    <div className="details-panel">
      {/* 头部 */}
      <div className="details-header">
        <h3 className="details-title">详情</h3>
        <button 
          className="close-btn"
          onClick={() => updateSettings({ detailsCollapsed: true })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* 标签页 */}
      <div className="details-tabs">
        <button 
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          信息
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          工具
        </button>
        <button 
          className={`tab-btn ${activeTab === 'context' ? 'active' : ''}`}
          onClick={() => setActiveTab('context')}
        >
          上下文
        </button>
      </div>

      <div className="details-content">
        {/* 信息标签 */}
        {activeTab === 'info' && (
          <>
            {/* 会话信息 */}
            <div className="details-section">
              <h4 className="section-title">会话信息</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">模型</span>
                  <span className="info-value">{currentSession?.model || '未选择'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">状态</span>
                  <span className={`info-value status ${isStreaming ? 'streaming' : ''}`}>
                    {isStreaming ? '生成中...' : '就绪'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">创建时间</span>
                  <span className="info-value">
                    {currentSession?.createdAt 
                      ? new Date(currentSession.createdAt).toLocaleString('zh-CN')
                      : '-'
                    }
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">最后更新</span>
                  <span className="info-value">
                    {currentSession?.updatedAt 
                      ? new Date(currentSession.updatedAt).toLocaleString('zh-CN')
                      : '-'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* 消息统计 */}
            <div className="details-section">
              <h4 className="section-title">消息统计</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{messageCount}</span>
                  <span className="stat-label">总消息</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{userMessages}</span>
                  <span className="stat-label">用户</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{assistantMessages}</span>
                  <span className="stat-label">助手</span>
                </div>
              </div>
            </div>

            {/* Token 统计 */}
            <div className="details-section">
              <h4 className="section-title">Token 使用</h4>
              <div className="token-stats">
                <div className="token-item">
                  <span className="token-label">输入</span>
                  <div className="token-bar">
                    <div 
                      className="token-bar-fill input"
                      style={{ width: `${tokenStats.total > 0 ? (tokenStats.prompt / tokenStats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="token-value">{tokenStats.prompt.toLocaleString()}</span>
                </div>
                <div className="token-item">
                  <span className="token-label">输出</span>
                  <div className="token-bar">
                    <div 
                      className="token-bar-fill output"
                      style={{ width: `${tokenStats.total > 0 ? (tokenStats.completion / tokenStats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="token-value">{tokenStats.completion.toLocaleString()}</span>
                </div>
                <div className="token-total">
                  <span className="token-label">总计</span>
                  <span className="token-value">{tokenStats.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="details-section">
              <h4 className="section-title">快捷操作</h4>
              <div className="quick-actions">
                <button className="action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  导出会话
                </button>
                <button className="action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                  复制全部
                </button>
                <button className="action-btn danger">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  清空对话
                </button>
              </div>
            </div>
          </>
        )}

        {/* 工具标签 */}
        {activeTab === 'tools' && (
          <div className="details-section">
            <h4 className="section-title">工具调用统计</h4>
            {toolCalls.length === 0 ? (
              <div className="empty-tools">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                <span>暂无工具调用</span>
              </div>
            ) : (
              <div className="tool-stats-list">
                {toolCalls.map(tool => (
                  <div key={tool.name} className="tool-stat-item">
                    <div className="tool-stat-info">
                      <span className="tool-stat-name">{tool.name}</span>
                      <span className="tool-stat-count">{tool.count} 次调用</span>
                    </div>
                    <div className="tool-stat-bar">
                      <div 
                        className="tool-stat-bar-fill"
                        style={{ width: `${(tool.success / tool.count) * 100}%` }}
                      />
                    </div>
                    <span className="tool-stat-success">
                      {tool.success}/{tool.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 上下文标签 */}
        {activeTab === 'context' && (
          <div className="details-section">
            <h4 className="section-title">上下文信息</h4>
            <div className="context-info">
              <div className="context-item">
                <span className="context-label">上下文大小</span>
                <span className="context-value">
                  {contextSize > 1024 
                    ? `${(contextSize / 1024).toFixed(1)} KB`
                    : `${contextSize} B`
                  }
                </span>
              </div>
              <div className="context-item">
                <span className="context-label">消息轮次</span>
                <span className="context-value">{userMessages} 轮</span>
              </div>
              <div className="context-item">
                <span className="context-label">平均消息长度</span>
                <span className="context-value">
                  {messageCount > 0 
                    ? `${Math.round(contextSize / messageCount)} 字符`
                    : '-'
                  }
                </span>
              </div>
              <div className="context-item">
                <span className="context-label">上下文窗口</span>
                <span className="context-value">
                  {currentSession?.model?.includes('claude') 
                    ? '200K tokens'
                    : currentSession?.model?.includes('gpt') 
                      ? '128K tokens'
                      : '64K tokens'
                  }
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
