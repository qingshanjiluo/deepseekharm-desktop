import React, { useState } from 'react'
import { Message } from '../../store'
import './TrajectoryTimeline.css'

interface TrajectoryEvent {
  id: string
  type: 'message' | 'tool_call' | 'tool_result' | 'thinking' | 'system'
  timestamp: number
  content: string
  details?: any
}

interface TrajectoryTimelineProps {
  messages: Message[]
  onClose: () => void
}

export function TrajectoryTimeline({ messages, onClose }: TrajectoryTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'message' | 'tool' | 'system'>('all')

  // 将消息转换为轨迹事件
  const events: TrajectoryEvent[] = []
  messages.forEach(msg => {
    events.push({
      id: msg.id,
      type: 'message',
      timestamp: msg.timestamp,
      content: msg.content.substring(0, 200),
      details: msg,
    })
    if (msg.toolCalls) {
      msg.toolCalls.forEach(tc => {
        events.push({
          id: tc.id,
          type: 'tool_call',
          timestamp: msg.timestamp,
          content: tc.name,
          details: tc,
        })
      })
    }
  })

  const filteredEvents = events.filter(e => {
    if (filter === 'all') return true
    if (filter === 'tool') return e.type === 'tool_call' || e.type === 'tool_result'
    if (filter === 'message') return e.type === 'message'
    if (filter === 'system') return e.type === 'system' || e.type === 'thinking'
    return true
  })

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'message':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )
      case 'tool_call':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        )
      case 'thinking':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        )
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        )
    }
  }

  return (
    <div className="trajectory-overlay" onClick={onClose}>
      <div className="trajectory-modal" onClick={e => e.stopPropagation()}>
        <div className="trajectory-header">
          <h3>对话轨迹</h3>
          <button className="close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="trajectory-filters">
          {(['all', 'message', 'tool', 'system'] as const).map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '全部' : f === 'message' ? '消息' : f === 'tool' ? '工具' : '系统'}
            </button>
          ))}
        </div>

        <div className="trajectory-body">
          <div className="timeline-track">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className={`timeline-event ${event.type} ${selectedEvent === event.id ? 'selected' : ''}`}
                onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
              >
                <div className="event-line">
                  <div className="event-dot">{getEventIcon(event.type)}</div>
                  {index < filteredEvents.length - 1 && <div className="event-connector" />}
                </div>
                <div className="event-content">
                  <div className="event-meta">
                    <span className="event-type">{event.type === 'tool_call' ? event.content : event.type}</span>
                    <span className="event-time">
                      {new Date(event.timestamp).toLocaleTimeString('zh-CN')}
                    </span>
                  </div>
                  {selectedEvent === event.id && (
                    <div className="event-detail">
                      <pre>{JSON.stringify(event.details, null, 2).substring(0, 500)}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trajectory-footer">
          <span className="event-count">{filteredEvents.length} 个事件</span>
        </div>
      </div>
    </div>
  )
}
