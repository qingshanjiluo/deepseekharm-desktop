import React, { useState, useMemo } from 'react'
import { useAppStore } from '../../store'
import './ContextMeter.css'

// 模型最大上下文窗口（按模型名匹配）
const MODEL_MAX_TOKENS: Record<string, number> = {
  'deepseek-chat': 65536,
  'deepseek-reasoner': 65536,
  'gpt-4o': 128000,
  'gpt-4o-mini': 128000,
  'gpt-4-turbo': 128000,
  'claude-3-5-sonnet': 200000,
  'claude-3-opus': 200000,
  'claude-3-haiku': 200000,
}

function getModelMaxTokens(model: string): number {
  for (const [key, max] of Object.entries(MODEL_MAX_TOKENS)) {
    if (model.toLowerCase().includes(key)) return max
  }
  return 65536 // 默认
}

export function ContextMeter() {
  const { currentSessionId, settings } = useAppStore()
  const currentSession = useAppStore(state =>
    state.sessions.find(s => s.id === state.currentSessionId)
  )
  const [expanded, setExpanded] = useState(false)

  const stats = useMemo(() => {
    if (!currentSession) return null

    let inputTokens = 0
    let outputTokens = 0
    let systemTokens = 500 // 估算系统提示词

    currentSession.messages.forEach(msg => {
      if (msg.usage) {
        inputTokens += msg.usage.promptTokens
        outputTokens += msg.usage.completionTokens
      }
    })

    const used = inputTokens + outputTokens + systemTokens
    const max = getModelMaxTokens(settings.model)
    const percentage = Math.min((used / max) * 100, 100)

    return { inputTokens, outputTokens, systemTokens, used, max, percentage }
  }, [currentSession?.messages, settings.model])

  if (!stats || stats.used === 0) return null

  const getColor = (pct: number) => {
    if (pct < 60) return 'var(--color-success, #10b981)'
    if (pct < 80) return 'var(--color-warning, #f59e0b)'
    return 'var(--color-error, #ef4444)'
  }

  return (
    <div className="context-meter" onClick={() => setExpanded(!expanded)}>
      <div className="meter-bar">
        <div 
          className="meter-fill"
          style={{ 
            width: `${stats.percentage}%`,
            background: getColor(stats.percentage)
          }}
        />
      </div>
      <span className="meter-label">
        {stats.used.toLocaleString()} / {stats.max.toLocaleString()}
      </span>
      {expanded && (
        <div className="meter-details">
          <div className="meter-detail-row">
            <span className="detail-label">系统提示词</span>
            <span className="detail-value">{stats.systemTokens.toLocaleString()}</span>
          </div>
          <div className="meter-detail-row">
            <span className="detail-label">输入 Tokens</span>
            <span className="detail-value">{stats.inputTokens.toLocaleString()}</span>
          </div>
          <div className="meter-detail-row">
            <span className="detail-label">输出 Tokens</span>
            <span className="detail-value">{stats.outputTokens.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
