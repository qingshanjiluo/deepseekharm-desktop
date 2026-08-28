import React, { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../../store'
import { useTranslation } from '../../i18n'
import './Sidebar.css'

interface SidebarProps {
  onOpenSettings?: () => void
}

export function Sidebar({ onOpenSettings }: SidebarProps) {
  const { 
    sessions, 
    currentSessionId, 
    settings,
    createSession, 
    deleteSession,
    setCurrentSession,
    updateSettings 
  } = useAppStore()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [hoveredSession, setHoveredSession] = useState<string | null>(null)
  const [settled, setSettled] = useState(settings.sidebarCollapsed)
  const columnRef = useRef<HTMLDivElement>(null)

  // 折叠/展开动画延迟
  useEffect(() => {
    if (!settings.sidebarCollapsed) {
      setSettled(false)
      return
    }
    const timer = setTimeout(() => setSettled(true), 150)
    return () => clearTimeout(timer)
  }, [settings.sidebarCollapsed])

  const wide = !settings.sidebarCollapsed || !settled

  // 过滤会话
  const filteredSessions = sessions.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 按日期分组会话
  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const date = new Date(session.updatedAt)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    let group: string
    if (diffDays === 0) group = '今天'
    else if (diffDays === 1) group = '昨天'
    else if (diffDays < 7) group = '本周'
    else if (diffDays < 30) group = '本月'
    else group = '更早'
    
    if (!groups[group]) groups[group] = []
    groups[group].push(session)
    return groups
  }, {} as Record<string, typeof sessions>)

  // 创建新会话
  const handleCreateSession = () => {
    createSession()
  }

  // 删除会话
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(t.common.confirm + '?')) {
      deleteSession(id)
    }
  }

  // 开始编辑
  const handleStartEdit = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(id)
    setEditName(name)
  }

  // 完成编辑
  const handleFinishEdit = () => {
    if (editingId && editName.trim()) {
      const { updateSession } = useAppStore.getState()
      updateSession(editingId, { name: editName.trim() })
    }
    setEditingId(null)
    setEditName('')
  }

  // 切换侧边栏折叠
  const toggleSidebar = () => {
    updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed })
  }

  return (
    <div 
      ref={columnRef}
      className={`sidebar ${settings.sidebarCollapsed ? 'collapsed' : ''} ${!wide && 'rail-in'}`}
      style={wide ? { width: settings.sidebarCollapsed ? 240 : settings.sidebarWidth } : undefined}
    >
      {/* 品牌区域 */}
      <div className="sidebar-brand">
        {wide && (
          <button className="brand-btn" onClick={handleCreateSession}>
            <span className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="brand-name">DeepSeek Harness</span>
          </button>
        )}
        <button className="toggle-btn" onClick={toggleSidebar} title={settings.sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}>
          {!wide && (
            <span className="rail-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
          <svg width={wide ? 16 : 18} height={wide ? 16 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {settings.sidebarCollapsed ? (
              <>
                <path d="M15 18l-6-6 6-6"/>
              </>
            ) : (
              <>
                <path d="M9 18l6-6-6-6"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* 新建会话按钮 */}
      <div className="new-session-area">
        <button className="new-session-btn" onClick={handleCreateSession}>
          <svg width={wide ? 14 : 18} height={wide ? 14 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {wide && <span className="new-session-label">{t.sidebar.newSession}</span>}
        </button>
      </div>

      {/* 会话列表区域 */}
      <div className="session-region">
        {/* 搜索框 */}
        {wide && (
          <div className="sidebar-search">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder={t.sidebar.searchSessions}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        {/* 会话列表 */}
        <div className="session-list">
          {filteredSessions.length === 0 ? (
            <div className="empty-sessions">
              {searchQuery ? t.common.search + '...' : t.sidebar.noSessions}
            </div>
          ) : (
            Object.entries(groupedSessions).map(([group, sessions]) => (
              <div key={group} className="session-group">
                {wide && <div className="group-label">{group}</div>}
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
                    onClick={() => setCurrentSession(session.id)}
                    onMouseEnter={() => setHoveredSession(session.id)}
                    onMouseLeave={() => setHoveredSession(null)}
                  >
                    <div className="session-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    {wide && (
                      <div className="session-info">
                        {editingId === session.id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={handleFinishEdit}
                            onKeyDown={(e) => e.key === 'Enter' && handleFinishEdit()}
                            className="session-name-input"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="session-name">{session.name}</span>
                        )}
                        <span className="session-time">
                          {new Date(session.updatedAt).toLocaleDateString(settings.locale, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                    {(hoveredSession === session.id || session.id === currentSessionId) && (
                      <div className="session-actions">
                        <button
                          className="session-action-btn"
                          onClick={(e) => handleStartEdit(session.id, session.name, e)}
                          title={t.sidebar.renameSession}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          className="session-action-btn delete"
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          title={t.sidebar.deleteSession}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 底部区域 */}
      <div className="sidebar-foot">
        <button 
          className="footer-btn"
          title={t.settings.title}
          onClick={onOpenSettings}
        >
          <svg width={wide ? 16 : 18} height={wide ? 16 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          {wide && <span className="footer-label">{t.settings.title}</span>}
        </button>
      </div>
    </div>
  )
}
