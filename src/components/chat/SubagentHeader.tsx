import React from 'react'
import './SubagentHeader.css'

export interface SubagentInfo {
  id: string
  parentId?: string
  name: string
  status: 'running' | 'completed' | 'failed'
  model: string
}

interface SubagentHeaderProps {
  agents: SubagentInfo[]
  activeId?: string
  onSelect?: (id: string) => void
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'running':
      return <span className="status-dot running" />
    case 'completed':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )
    case 'failed':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      )
    default:
      return null
  }
}

export function SubagentHeader({ agents, activeId, onSelect }: SubagentHeaderProps) {
  if (agents.length === 0) return null

  return (
    <div className="subagent-header">
      <div className="subagent-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        <span>子代理 ({agents.length})</span>
      </div>
      <div className="subagent-list">
        {agents.map(agent => (
          <button
            key={agent.id}
            className={`subagent-item ${activeId === agent.id ? 'active' : ''} ${agent.status}`}
            onClick={() => onSelect?.(agent.id)}
          >
            {getStatusIcon(agent.status)}
            <span className="agent-name">{agent.name}</span>
            <span className="agent-model">{agent.model}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
