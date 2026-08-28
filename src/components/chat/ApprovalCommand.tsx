import React, { useState } from 'react'
import './ApprovalCommand.css'

export interface ApprovalRequest {
  id: string
  toolName: string
  toolInput: Record<string, unknown>
  timestamp: number
  status: 'pending' | 'approved' | 'denied' | 'always'
 危险程度?: 'low' | 'medium' | 'high'
}

interface ApprovalCommandProps {
  request: ApprovalRequest
  onApprove: (id: string, always?: boolean) => void
  onDeny: (id: string) => void
}

function getDangerLevel(name: string, input: Record<string, any>): 'low' | 'medium' | 'high' {
  const n = name.toLowerCase()
  if (n.includes('bash') || n.includes('exec') || n.includes('run') || n.includes('shell')) {
    return 'high'
  }
  if (n.includes('write') || n.includes('delete') || n.includes('remove')) {
    return 'medium'
  }
  if (input.command && typeof input.command === 'string') {
    const cmd = input.command.toLowerCase()
    if (cmd.includes('rm ') || cmd.includes('del ') || cmd.includes('sudo')) return 'high'
    if (cmd.includes('chmod') || cmd.includes('kill')) return 'medium'
  }
  return 'low'
}

export function ApprovalCommand({ request, onApprove, onDeny }: ApprovalCommandProps) {
  const [showDetails, setShowDetails] = useState(false)
  const dangerLevel = request.危险程度 || getDangerLevel(request.toolName, request.toolInput)

  if (request.status !== 'pending') {
    return (
      <div className={`approval-command resolved ${request.status}`}>
        <div className="approval-icon">
          {request.status === 'approved' || request.status === 'always' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          )}
        </div>
        <span className="approval-text">
          {request.toolName} — {request.status === 'approved' ? '已批准' : request.status === 'always' ? '始终批准' : '已拒绝'}
        </span>
      </div>
    )
  }

  return (
    <div className={`approval-command pending danger-${dangerLevel}`}>
      <div className="approval-header">
        <div className="approval-icon pending">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <span className="approval-tool-name">{request.toolName}</span>
        <span className={`danger-badge ${dangerLevel}`}>
          {dangerLevel === 'high' ? '高危' : dangerLevel === 'medium' ? '中危' : '低危'}
        </span>
      </div>

      <div className="approval-summary" onClick={() => setShowDetails(!showDetails)}>
        <span>需要您的批准才能执行此操作</span>
        <svg 
          className={`expand-icon ${showDetails ? 'expanded' : ''}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {showDetails && (
        <div className="approval-details">
          <pre className="approval-input">
            {JSON.stringify(request.toolInput, null, 2)}
          </pre>
        </div>
      )}

      <div className="approval-actions">
        <button className="approval-btn deny" onClick={() => onDeny(request.id)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          拒绝
        </button>
        <button className="approval-btn approve" onClick={() => onApprove(request.id)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          批准
        </button>
        <button className="approval-btn always" onClick={() => onApprove(request.id, true)}>
          始终批准
        </button>
      </div>
    </div>
  )
}
