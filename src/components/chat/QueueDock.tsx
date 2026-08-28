import React from 'react'
import './QueueDock.css'

export interface QueueItem {
  id: string
  content: string
  timestamp: number
  status: 'queued' | 'processing'
}

interface QueueDockProps {
  items: QueueItem[]
  onCancel: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function QueueDock({ items, onCancel, onReorder }: QueueDockProps) {
  if (items.length === 0) return null

  return (
    <div className="queue-dock">
      <div className="queue-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
        <span>消息队列 ({items.length})</span>
      </div>
      <div className="queue-list">
        {items.map((item, index) => (
          <div key={item.id} className={`queue-item ${item.status}`}>
            <span className="queue-index">{index + 1}</span>
            <span className="queue-content">
              {item.content.length > 60 ? item.content.substring(0, 60) + '...' : item.content}
            </span>
            {item.status === 'queued' && (
              <button className="queue-cancel" onClick={() => onCancel(item.id)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
