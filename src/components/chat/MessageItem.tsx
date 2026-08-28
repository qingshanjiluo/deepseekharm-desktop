import React, { useState } from 'react'
import { Message } from '../../store'
import { MarkdownText } from './MarkdownText'
import { ReasoningRow } from './ReasoningRow'
import { ToolCallTree } from './ToolCallTree'
import { ApprovalCommand } from './ApprovalCommand'
import { PermissionSelect } from './PermissionSelect'
import { ToolDetails } from './ToolDetails'
import { useTranslation } from '../../i18n'
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
  const { t } = useTranslation()
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null)
  const [selectedToolDetails, setSelectedToolDetails] = useState<any>(null)

  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    onCopy?.(message.content)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartEdit = () => {
    setEditContent(message.content)
    setIsEditing(true)
  }

  const handleFinishEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(editContent)
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(message.content)
  }

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(feedback === type ? null : type)
  }

  const handleApprove = () => {
    console.log('Tool approved')
  }

  const handleDeny = () => {
    console.log('Tool denied')
  }

  const handleShowToolDetails = (toolCall: any) => {
    setSelectedToolDetails(toolCall)
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
            {isUser ? t.chat.you : 'DeepSeek'}
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
                  {t.common.cancel}
                </button>
                <button className="edit-btn save" onClick={handleFinishEdit}>
                  {t.common.save}
                </button>
              </div>
            </div>
          ) : (
            <>
              {isUser ? (
                <div className="user-message">{message.content}</div>
              ) : (
                <>
                  {message.reasoning && (
                    <ReasoningRow text={message.reasoning} running={isStreaming} />
                  )}
                  <MarkdownText content={message.content} />
                </>
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
          <ToolCallTree 
            toolCalls={message.toolCalls} 
            onShowDetails={handleShowToolDetails}
          />
        )}

        {/* 权限选择 */}
        <PermissionSelect 
          onAllow={handleApprove}
          onDeny={handleDeny}
          toolName="bash"
        />
      </div>

      {/* 操作按钮 */}
      {showActions && !isEditing && !isStreaming && (
        <div className="message-actions">
          <button 
            className="action-btn"
            onClick={handleCopy}
            title={copied ? t.common.success : t.common.copy}
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
              title={t.common.edit}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          {isAssistant && (
            <>
              <button 
                className={`action-btn ${feedback === 'positive' ? 'active' : ''}`}
                onClick={() => handleFeedback('positive')}
                title={t.common.confirm}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={feedback === 'positive' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
              </button>
              <button 
                className={`action-btn ${feedback === 'negative' ? 'active negative' : ''}`}
                onClick={() => handleFeedback('negative')}
                title={t.common.cancel}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={feedback === 'negative' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                </svg>
              </button>
              <button 
                className="action-btn"
                onClick={onRetry}
                title={t.chat.regenerate}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
              <button 
                className="action-btn"
                title={t.common.info}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* 工具详情弹窗 */}
      {selectedToolDetails && (
        <ToolDetails 
          toolCall={selectedToolDetails}
          onClose={() => setSelectedToolDetails(null)}
        />
      )}
    </div>
  )
}
