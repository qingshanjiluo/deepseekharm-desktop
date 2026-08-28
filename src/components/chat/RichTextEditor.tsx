import React, { useState, useRef, useCallback } from 'react'
import './RichTextEditor.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  disabled?: boolean
}

interface MentionItem {
  id: string
  label: string
  type: 'file' | 'url' | 'model'
}

export function RichTextEditor({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = '输入消息...',
  disabled = false,
}: RichTextEditorProps) {
  const [showMentions, setShowMentions] = useState(false)
  const [mentionType, setMentionType] = useState<'file' | 'url' | 'model'>('file')
  const [mentions, setMentions] = useState<MentionItem[]>([])
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }, [onSubmit])

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // 检测 @ 触发
    const lastAtIndex = newValue.lastIndexOf('@')
    if (lastAtIndex !== -1 && lastAtIndex === newValue.length - 1) {
      setShowMentions(true)
      setMentionType('file')
    } else if (lastAtIndex !== -1) {
      const afterAt = newValue.substring(lastAtIndex + 1)
      if (!afterAt.includes(' ') && afterAt.length > 0) {
        setShowMentions(true)
        if (afterAt.startsWith('http')) {
          setMentionType('url')
        } else if (afterAt.startsWith('#')) {
          setMentionType('model')
        }
      } else {
        setShowMentions(false)
      }
    } else {
      setShowMentions(false)
    }
  }, [onChange])

  const insertMention = useCallback((item: MentionItem) => {
    const lastAtIndex = value.lastIndexOf('@')
    const newValue = value.substring(0, lastAtIndex) + `@${item.label} `
    onChange(newValue)
    setMentions(prev => [...prev, item])
    setShowMentions(false)
    textareaRef.current?.focus()
  }, [value, onChange])

  const removeMention = useCallback((id: string) => {
    setMentions(prev => prev.filter(m => m.id !== id))
  }, [])

  return (
    <div className="rich-editor">
      {/* 已插入的提及标签 */}
      {mentions.length > 0 && (
        <div className="mention-chips">
          {mentions.map(m => (
            <span key={m.id} className="mention-chip">
              <span className="chip-icon">
                {m.type === 'file' ? '📄' : m.type === 'url' ? '🔗' : '🤖'}
              </span>
              <span className="chip-label">{m.label}</span>
              <button className="chip-remove" onClick={() => removeMention(m.id)}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 输入区域 */}
      <div className="editor-container">
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
        />
        <div className="editor-hints">
          <span className="hint-text">@ 引用文件或链接</span>
          <span className="hint-text">Shift+Enter 换行</span>
        </div>
      </div>

      {/* @提及菜单 */}
      {showMentions && (
        <div className="mention-menu">
          <div className="mention-header">
            <button 
              className={`mention-tab ${mentionType === 'file' ? 'active' : ''}`}
              onClick={() => setMentionType('file')}
            >
              文件
            </button>
            <button 
              className={`mention-tab ${mentionType === 'url' ? 'active' : ''}`}
              onClick={() => setMentionType('url')}
            >
              链接
            </button>
            <button 
              className={`mention-tab ${mentionType === 'model' ? 'active' : ''}`}
              onClick={() => setMentionType('model')}
            >
              模型
            </button>
          </div>
          <div className="mention-list">
            {mentionType === 'file' && (
              <>
                <div className="mention-item" onClick={() => insertMention({ id: '1', label: 'main.ts', type: 'file' })}>
                  <span className="item-icon">📄</span>
                  <span className="item-label">main.ts</span>
                  <span className="item-path">src/main.ts</span>
                </div>
                <div className="mention-item" onClick={() => insertMention({ id: '2', label: 'App.tsx', type: 'file' })}>
                  <span className="item-icon">📄</span>
                  <span className="item-label">App.tsx</span>
                  <span className="item-path">src/App.tsx</span>
                </div>
              </>
            )}
            {mentionType === 'url' && (
              <div className="mention-item" onClick={() => insertMention({ id: '3', label: 'https://docs.example.com', type: 'url' })}>
                <span className="item-icon">🔗</span>
                <span className="item-label">添加 URL 链接</span>
              </div>
            )}
            {mentionType === 'model' && (
              <>
                <div className="mention-item" onClick={() => insertMention({ id: '4', label: 'DeepSeek Chat', type: 'model' })}>
                  <span className="item-icon">🤖</span>
                  <span className="item-label">DeepSeek Chat</span>
                </div>
                <div className="mention-item" onClick={() => insertMention({ id: '5', label: 'GPT-4o', type: 'model' })}>
                  <span className="item-icon">🤖</span>
                  <span className="item-label">GPT-4o</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
