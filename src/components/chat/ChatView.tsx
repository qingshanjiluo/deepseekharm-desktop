import React, { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../../store'
import { MessageItem } from './MessageItem'
import './ChatView.css'

export function ChatView() {
  const {
    currentSessionId,
    isStreaming,
    settings,
    addMessage,
    updateMessage,
    setStreaming,
    createSession,
    updateSession,
  } = useAppStore()
  
  const currentSession = useAppStore(state =>
    state.sessions.find(s => s.id === state.currentSessionId)
  )
  
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession?.messages])

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [inputValue])

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming) return

    // 如果没有会话，先创建一个
    let sessionId = currentSessionId
    if (!sessionId) {
      const session = createSession()
      sessionId = session.id
    }

    const content = inputValue.trim()
    setInputValue('')

    // 添加用户消息
    addMessage(sessionId, { role: 'user', content })

    // 添加助手消息占位符
    const assistantMsg = addMessage(sessionId, { role: 'assistant', content: '' })

    // 开始流式响应
    setStreaming(true)

    try {
      if (window.deepSeek) {
        const session = useAppStore.getState().sessions.find(s => s.id === sessionId)
        const messages = session?.messages || []
        
        const stream = window.deepSeek.llm.stream({
          provider: settings.provider,
          model: settings.model,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        })

        let fullContent = ''
        for await (const chunk of stream) {
          if (chunk.type === 'text-delta' && chunk.delta) {
            fullContent += chunk.delta
            updateMessage(sessionId, assistantMsg.id, { content: fullContent })
          }
        }

        // 更新 Token 统计
        updateMessage(sessionId, assistantMsg.id, {
          usage: {
            promptTokens: Math.floor(content.length * 1.5),
            completionTokens: Math.floor(fullContent.length * 1.5),
            totalTokens: Math.floor((content.length + fullContent.length) * 1.5),
          }
        })
      } else {
        // 模拟响应
        await new Promise(resolve => setTimeout(resolve, 500))
        updateMessage(sessionId, assistantMsg.id, {
          content: '这是一个模拟响应。请在 Electron 环境中运行以获得完整功能。',
        })
      }
    } catch (error) {
      console.error('Stream error:', error)
      updateMessage(sessionId, assistantMsg.id, {
        content: `错误: ${error instanceof Error ? error.message : '未知错误'}`,
      })
    } finally {
      setStreaming(false)
    }
  }

  // 按键处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && settings.enterToSend) {
      e.preventDefault()
      handleSend()
    }
  }

  // 复制消息
  const handleCopy = (content: string) => {
    console.log('Copied:', content)
  }

  // 重试消息
  const handleRetry = () => {
    if (!currentSession || currentSession.messages.length < 2) return
    // 删除最后两条消息（用户和助手）
    const messages = currentSession.messages
    const lastUserIdx = messages.length - 2
    if (lastUserIdx >= 0) {
      // 重新发送最后的用户消息
      const lastUserMsg = messages[lastUserIdx]
      setInputValue(lastUserMsg.content)
    }
  }

  // 编辑消息
  const handleEdit = (messageId: string, content: string) => {
    if (currentSessionId) {
      updateMessage(currentSessionId, messageId, { content })
    }
  }

  // 切换面板
  const toggleSidebar = () => {
    useAppStore.getState().updateSettings({ 
      sidebarCollapsed: !settings.sidebarCollapsed 
    })
  }

  return (
    <div className="chat-view">
      {/* 头部 */}
      <div className="chat-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="header-info">
          <h2 className="session-title">{currentSession?.name || '新会话'}</h2>
          <span className="model-badge">{settings.model}</span>
        </div>
        <div className="header-actions">
          <button 
            className="header-btn"
            onClick={() => useAppStore.getState().updateSettings({ 
              detailsCollapsed: !settings.detailsCollapsed 
            })}
            title="切换详情面板"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="15" y1="3" x2="15" y2="21"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="messages-container">
        {!currentSession || currentSession.messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3>开始新的对话</h3>
            <p>输入消息开始与 DeepSeek 交流</p>
            <div className="suggestions">
              <button 
                className="suggestion-btn"
                onClick={() => setInputValue('帮我写一个 Python 爬虫程序')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
                写一个 Python 爬虫
              </button>
              <button 
                className="suggestion-btn"
                onClick={() => setInputValue('解释一下 JavaScript 的闭包是什么')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                解释 JavaScript 闭包
              </button>
              <button 
                className="suggestion-btn"
                onClick={() => setInputValue('帮我优化这段代码的性能')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                优化代码性能
              </button>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {currentSession.messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isStreaming={isStreaming && message.id === currentSession.messages[currentSession.messages.length - 1]?.id}
                onCopy={handleCopy}
                onRetry={handleRetry}
                onEdit={(content) => handleEdit(message.id, content)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="input-area">
        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
              disabled={isStreaming}
              rows={1}
              className="message-input"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming}
            className="send-btn"
          >
            {isStreaming ? (
              <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
        <div className="input-hint">
          <span>DeepSeek Harness v1.0.0</span>
          <span className="hint-separator">•</span>
          <span>{settings.model}</span>
        </div>
      </div>
    </div>
  )
}
