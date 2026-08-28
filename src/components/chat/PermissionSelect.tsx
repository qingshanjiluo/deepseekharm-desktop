import React from 'react'
import './PermissionSelect.css'

export interface PermissionRequest {
  id: string
  type: 'file_read' | 'file_write' | 'network' | 'command'
  target: string
  description?: string
  status: 'pending' | 'granted' | 'denied'
}

interface PermissionSelectProps {
  request: PermissionRequest
  onGrant: (id: string, always?: boolean) => void
  onDeny: (id: string) => void
}

const PERMISSION_ICONS: Record<string, React.ReactNode> = {
  file_read: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  file_write: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  network: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  command: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 17 10 11 4 5"/>
      <line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  ),
}

const PERMISSION_LABELS: Record<string, string> = {
  file_read: '读取文件',
  file_write: '写入文件',
  network: '网络请求',
  command: '执行命令',
}

export function PermissionSelect({ request, onGrant, onDeny }: PermissionSelectProps) {
  if (request.status !== 'pending') {
    return (
      <div className={`permission-select resolved ${request.status}`}>
        <span className="permission-status-icon">
          {request.status === 'granted' ? '✓' : '✗'}
        </span>
        <span className="permission-resolved-text">
          {PERMISSION_LABELS[request.type]} {request.target} — {request.status === 'granted' ? '已允许' : '已拒绝'}
        </span>
      </div>
    )
  }

  return (
    <div className="permission-select pending">
      <div className="permission-icon">
        {PERMISSION_ICONS[request.type]}
      </div>
      <div className="permission-info">
        <span className="permission-type">{PERMISSION_LABELS[request.type]}</span>
        <span className="permission-target">{request.target}</span>
        {request.description && (
          <span className="permission-desc">{request.description}</span>
        )}
      </div>
      <div className="permission-actions">
        <button className="perm-btn deny" onClick={() => onDeny(request.id)}>拒绝</button>
        <button className="perm-btn grant" onClick={() => onGrant(request.id)}>允许</button>
        <button className="perm-btn always" onClick={() => onGrant(request.id, true)}>始终</button>
      </div>
    </div>
  )
}
