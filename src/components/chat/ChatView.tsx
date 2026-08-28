import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useAppStore, Message } from '../../store'
import { MessageItem } from './MessageItem'
import { AttachmentButton } from './AttachmentButton'
import { SlashCommandMenu } from './SlashCommandMenu'
import type { SlashCommand } from './SlashCommandMenu'
import { SettingsModal } from '../settings/SettingsModal'
import { ModelSelector } from '../model/ModelSelector'
import { TrajectoryView } from '../trajectory/TrajectoryView'
import { KnowledgePanel } from '../knowledge/KnowledgePanel'
import { knowledgeService } from '../../services/knowledge-service'
import { useTranslation } from '../../i18n'
import { usePointerScrollbar } from '../../hooks'
import './ChatView.css'

interface Attachment {
  id: string
  name: string
  type: 'file' | 'image' | 'code'
  size: number
  content?: string
  path?: string
}

// Turn 统计接口
interface TurnStats {
  turnNumber: number
  startTime: number
  endTime?: number
  tokenUsage: number
  model: string
}

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
  const { t } = useTranslation()
  
  const currentSession = useAppStore(state =>
    state.sessions.find(s => s.id === state.currentSessionId)
  )
  
  const [inputValue, setInputValue] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashQuery, setSlashQuery] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showTrajectory, setShowTrajectory] = useState(false)
  const [showKnowledge, setShowKnowledge] = useState(false)
  const [activeTurn, setActiveTurn] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesListRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 计算 Turn 统计
  const turnStats = useMemo(() => {
    if (!currentSession) return []
    const stats: TurnStats[] = []
    let turnNumber = 0
    let currentTurnStart = 0
    let currentTokenUsage = 0

    currentSession.messages.forEach((msg, idx) => {
      if (msg.role === 'user') {
        turnNumber++
        currentTurnStart = msg.timestamp
        currentTokenUsage = 0
      }
      if (msg.usage) {
        currentTokenUsage += msg.usage.totalTokens
      }
      if (msg.role === 'assistant' && idx === currentSession.messages.length - 1) {
        stats.push({
          turnNumber,
          startTime: currentTurnStart,
          endTime: msg.timestamp,
          tokenUsage: currentTokenUsage,
          model: currentSession.model,
        })
      }
    })
    return stats
  }, [currentSession?.messages, currentSession?.model])

  // 计算总 Token 使用量
  const totalTokenUsage = useMemo(() => {
    if (!currentSession) return 0
    return currentSession.messages.reduce((sum, msg) => {
      return sum + (msg.usage?.totalTokens || 0)
    }, 0)
  }, [currentSession?.messages])

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

  // 监听滚动事件以更新活动 Turn
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesListRef.current || !currentSession) return
      
      const container = messagesListRef.current
      const scrollTop = container.scrollTop
      const containerHeight = container.clientHeight
      const scrollCenter = scrollTop + containerHeight / 2

      // 找到滚动中心位置的消息
      const messageElements = container.querySelectorAll('[data-message-index]')
      let currentIdx = 0

      messageElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const elementCenter = rect.top + rect.height / 2 - containerRect.top + scrollTop
        
        if (elementCenter <= scrollCenter) {
          currentIdx = parseInt(el.getAttribute('data-message-index') || '0')
        }
      })

      // 计算当前 Turn
      const messages = currentSession.messages
      let currentTurn = 1
      for (let i = 0; i <= currentIdx && i < messages.length; i++) {
        if (messages[i].role === 'user' && i > 0) {
          currentTurn++
        }
      }
      setActiveTurn(currentTurn)
    }

    const container = messagesListRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [currentSession?.messages])

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInputValue(value)

    // 检测斜杠命令
    if (value.startsWith('/')) {
      setShowSlashMenu(true)
      setSlashQuery(value.slice(1))
    } else {
      setShowSlashMenu(false)
      setSlashQuery('')
    }
  }

  // 选择斜杠命令
  const handleSlashCommandSelect = (command: SlashCommand) => {
    setShowSlashMenu(false)
    setSlashQuery('')
    
    switch (command.id) {
      case 'clear':
        if (currentSessionId) {
          updateSession(currentSessionId, { messages: [] })
        }
        break
      case 'export':
        handleExport()
        break
      case 'model':
        // TODO: 显示模型选择器
        break
      case 'settings':
        setShowSettings(true)
        break
      default:
        // 其他命令作为普通文本发送
        setInputValue(`/${command.name} `)
    }
  }

  // 导出会话
  const handleExport = () => {
    if (!currentSession) return
    
    const content = currentSession.messages
      .map((msg) => {
        const role = msg.role === 'user' ? `**${t.sidebar.untitledSession}**` : '**DeepSeek**'
        return `### ${role}\n\n${msg.content}`
      })
      .join('\n\n---\n\n')
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentSession.name || t.sidebar.untitledSession}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

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
    setAttachments([])

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
        let reasoningContent = ''
        
        for await (const chunk of stream) {
          if (chunk.type === 'text-delta' && chunk.delta) {
            fullContent += chunk.delta
            updateMessage(sessionId, assistantMsg.id, { content: fullContent })
          }
          
          // 处理推理内容（DeepSeek Reasoner）
          if (chunk.type === 'reasoning-delta' && chunk.delta) {
            reasoningContent += chunk.delta
            updateMessage(sessionId, assistantMsg.id, { reasoning: reasoningContent })
          }
          
          // 处理使用量统计
          if (chunk.type === 'usage' && chunk.usage) {
            updateMessage(sessionId, assistantMsg.id, {
              usage: {
                promptTokens: chunk.usage.inputTokens,
                completionTokens: chunk.usage.outputTokens,
                totalTokens: chunk.usage.inputTokens + chunk.usage.outputTokens,
              }
            })
          }
          
          // 处理完成
          if (chunk.type === 'finish') {
            if (chunk.finishReason === 'abort') {
              updateMessage(sessionId, assistantMsg.id, {
                content: fullContent || '（已停止生成）',
              })
            }
          }
        }

        // 如果没有收到 usage，使用估算值
        if (!fullContent.includes('tokens')) {
          updateMessage(sessionId, assistantMsg.id, {
            usage: {
              promptTokens: Math.floor(content.length * 1.5),
              completionTokens: Math.floor(fullContent.length * 1.5),
              totalTokens: Math.floor((content.length + fullContent.length) * 1.5),
            }
          })
        }
      } else {
        // 模拟响应（开发环境）
        await new Promise(resolve => setTimeout(resolve, 500))
        updateMessage(sessionId, assistantMsg.id, {
          content: '这是一个模拟响应。请在 Electron 环境中运行以获得完整功能。\n\n要使用真实 API，请在设置中配置您的 API Key。',
        })
      }
    } catch (error) {
      console.error('Stream error:', error)
      updateMessage(sessionId, assistantMsg.id, {
        content: `错误: ${error instanceof Error ? error.message : '未知错误'}\n\n请检查您的 API Key 配置是否正确。`,
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
    navigator.clipboard.writeText(content)
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

  // 添加附件
  const handleAddAttachments = async (files: File[]) => {
    for (const file of files) {
      const newAttachment: Attachment = {
        id: Math.random().toString(36).substring(2),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        size: file.size,
      }
      
      // 读取文件内容
      if (file.type.includes('json') || file.type.includes('javascript') || 
          file.type.includes('typescript') || file.type.includes('text')) {
        const content = await file.text()
        newAttachment.content = content
        newAttachment.type = 'code'
      }
      
      setAttachments(prev => [...prev, newAttachment])
    }
  }

  // 移除附件
  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  // 切换面板
  const toggleSidebar = () => {
    useAppStore.getState().updateSettings({ 
      sidebarCollapsed: !settings.sidebarCollapsed 
    })
  }

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
          <h2 className="session-title">{currentSession?.name || t.sidebar.untitledSession}</h2>
          <ModelSelector compact />
        </div>
        <div className="header-actions">
          <button 
            className="header-btn"
            onClick={() => setShowTrajectory(true)}
            title="轨迹视图"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </button>
          <button 
            className="header-btn"
            onClick={() => setShowKnowledge(true)}
            title="知识库"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </button>
          <button 
            className="header-btn"
            onClick={() => setShowSettings(true)}
            title={t.settings.title}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <button 
            className="header-btn"
            onClick={() => useAppStore.getState().updateSettings({ 
              detailsCollapsed: !settings.detailsCollapsed 
            })}
            title={t.settings.toggleDetails}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="15" y1="3" x2="15" y2="21"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Turn 导航条 */}
      {currentSession && currentSession.messages.length > 0 && (
        <div className="turn-navigator">
          <div className="turn-stats">
            <span className="stat-item">
              <IconFile size={12} />
              {currentSession.messages.filter(m => m.role === 'user').length} {t.chat.turns}
            </span>
            <span className="stat-item">
              <IconZap size={12} />
              {totalTokenUsage.toLocaleString()} tokens
            </span>
          </div>
          <div className="turn-list">
            {turnStats.map((stat) => {
              const duration = stat.endTime 
                ? Math.round((stat.endTime - stat.startTime) / 1000)
                : null
              return (
                <button
                  key={stat.turnNumber}
                  className={`turn-item ${activeTurn === stat.turnNumber ? 'active' : ''}`}
                  onClick={() => {
                    const turnIndex = currentSession.messages.findIndex(
                      (msg, idx) => {
                        let turn = 0
                        for (let i = 0; i <= idx; i++) {
                          if (currentSession.messages[i].role === 'user' && i > 0) turn++
                        }
                        return turn === stat.turnNumber
                      }
                    )
                    if (turnIndex >= 0) {
                      const element = messagesListRef.current?.querySelector(
                        `[data-message-index="${turnIndex}"]`
                      )
                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                  }}
                  title={stat.model}
                >
                  <span className="turn-number">{stat.turnNumber}</span>
                  {duration !== null && (
                    <span className="turn-duration">{duration}s</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 消息列表 */}
      <div className="messages-container pointer-scrollbar" ref={messagesListRef}>
        {!currentSession || currentSession.messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3>{t.chat.startConversation}</h3>
            <p>{t.chat.inputPlaceholder}</p>
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
            {currentSession.messages.map((message, index) => (
              <div key={message.id} data-message-index={index}>
                <MessageItem
                  message={message}
                  isStreaming={isStreaming && message.id === currentSession.messages[currentSession.messages.length - 1]?.id}
                  onCopy={handleCopy}
                  onRetry={handleRetry}
                  onEdit={(content) => handleEdit(message.id, content)}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 滚动到底部按钮 */}
      <div className="scroll-to-bottom">
        <button className="scroll-btn" onClick={scrollToBottom}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {/* 输入区域 */}
      <div className="input-area">
        {/* 斜杠命令菜单 */}
        <SlashCommandMenu
          isOpen={showSlashMenu}
          query={slashQuery}
          onSelect={handleSlashCommandSelect}
          onClose={() => {
            setShowSlashMenu(false)
            setSlashQuery('')
          }}
        />

        <div className="input-container">
          {/* 附件列表 */}
          {attachments.length > 0 && (
            <AttachmentButton
              attachments={attachments}
              onAdd={handleAddAttachments}
              onRemove={handleRemoveAttachment}
            />
          )}

          <div className="input-row">
            {/* 附件按钮 */}
            <button 
              className="attach-trigger"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.multiple = true
                input.onchange = (e) => {
                  const files = Array.from((e.target as HTMLInputElement).files || [])
                  handleAddAttachments(files)
                }
                input.click()
              }}
              title={t.chat.attachments}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>

            {/* 输入框 */}
            <div className="input-wrapper">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t.chat.inputPlaceholder}
                disabled={isStreaming}
                rows={1}
                className="message-input"
              />
            </div>

            {/* 发送/停止按钮 */}
            {isStreaming ? (
              <button
                onClick={() => {
                  // 取消流式响应
                  setStreaming(false)
                }}
                className="send-btn stop-btn"
                title="停止生成"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="send-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <div className="input-hint">
          <span>DeepSeek Harness v1.0.0</span>
          <span className="hint-separator">•</span>
          <span>{settings.model}</span>
          {totalTokenUsage > 0 && (
            <>
              <span className="hint-separator">•</span>
              <span>{totalTokenUsage.toLocaleString()} tokens</span>
            </>
          )}
        </div>
      </div>

      {/* 轨迹视图弹窗 */}
      <TrajectoryView 
        isOpen={showTrajectory} 
        onClose={() => setShowTrajectory(false)} 
      />

      {/* 设置弹窗 */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* 知识库面板 */}
      <KnowledgePanel 
        isOpen={showKnowledge} 
        onClose={() => setShowKnowledge(false)}
        onInsertContext={(context) => {
          setInputValue(prev => prev + '\n\n' + context)
        }}
      />
    </div>
  )
}
