import React, { useState } from 'react'
import { Message } from '../../store'
import { MarkdownText } from './MarkdownText'
import './MessageItem.css'

interface MessageItemProps {
  message: Message
  isStreaming?: boolean
  onCopy?: (content: string) => void
  onRetry?: () => void
  onEdit?: (content: string) => void
}

export function MessageItem({ 
  message, 
  isStreaming = false,
  onCopy,
  onRetry,
  onEdit,
}: MessageItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)

  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  // 复制消息
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    onCopy?.(message.content)
    setTimeout(() => setCopied(false), 2000)
  }

  // 开始编辑
  const handleStartEdit = () => {
    setEditContent(message.content)
    setIsEditing(true)
  }

  // 完成编辑
  const handleFinishEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(editContent)
    }
    setIsEditing(false)
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(message.content)
  }

  return (
    <div 
      className={`message-item ${message.role}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 头像 */}
      <div className={`message-avatar ${message.role}`}>
        {isUser ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        )}
      </div>

      {/* 消息内容 */}
      <div className="message-body">
        <div className="message-header">
          <span className="message-role">
            {isUser ? '你' : 'DeepSeek'}
          </span>
          <span className="message-time">
            {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div className="message-content">
          {isEditing ? (
            <div className="edit-container">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="edit-textarea"
                autoFocus
              />
              <div className="edit-actions">
                <button className="edit-btn cancel" onClick={handleCancelEdit}>
                  取消
                </button>
                <button className="edit-btn save" onClick={handleFinishEdit}>
                  保存
                </button>
              </div>
            </div>
          ) : (
            <>
              {isUser ? (
                <div className="user-message">{message.content}</div>
              ) : (
                <MarkdownText content={message.content} />
              )}
              {isStreaming && isAssistant && (
                <span className="cursor-blink">|</span>
              )}
            </>
          )}
        </div>

        {/* Token 统计 */}
        {message.usage && (
          <div className="message-usage">
            <span className="usage-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              {message.usage.totalTokens.toLocaleString()} tokens
            </span>
          </div>
        )}

        {/* 工具调用展示 */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="tool-calls">
            {message.toolCalls.map(tool => (
              <div key={tool.id} className="tool-call-item">
                <span className="tool-name">{tool.name}</span>
                {tool.result && (
                  <span className="tool-result">
                    {tool.result.substring(0, 100)}
                    {tool.result.length > 100 ? '...' : ''}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      {showActions && !isEditing && !isStreaming && (
        <div className="message-actions">
          <button 
            className="action-btn"
            onClick={handleCopy}
            title={copied ? '已复制' : '复制'}
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
          </button>
          {isUser && (
            <button 
              className="action-btn"
              onClick={handleStartEdit}
              title="编辑"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          {isAssistant && (
            <button 
              className="action-btn"
              onClick={onRetry}
              title="重试"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
