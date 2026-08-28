import React, { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../../store'
import { useTranslation } from '../../i18n'
import { usePointerScrollbar } from '../../hooks'
import { FishLogoGlow } from '../icons/BrandIcons'
import { IconSearch, IconPlus, IconSettings, IconChevronLeft, IconChevronRight, IconEdit, IconTrash, IconFile } from '../icons'
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
  const sessionListRef = usePointerScrollbar()

  useEffect(() => {
    if (!settings.sidebarCollapsed) {
      setSettled(false)
      return
    }
    const timer = setTimeout(() => setSettled(true), 150)
    return () => clearTimeout(timer)
  }, [settings.sidebarCollapsed])

  const wide = !settings.sidebarCollapsed || !settled

  const filteredSessions = sessions.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const date = new Date(session.updatedAt)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    let group: string
    if (diffDays === 0) group = t.time.today
    else if (diffDays === 1) group = t.time.yesterday
    else if (diffDays < 7) group = t.time.thisWeek
    else if (diffDays < 30) group = t.time.thisMonth
    else group = t.time.older
    
    if (!groups[group]) groups[group] = []
    groups[group].push(session)
    return groups
  }, {} as Record<string, typeof sessions>)

  const handleCreateSession = () => {
    createSession()
  }

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(t.common.confirm + '?')) {
      deleteSession(id)
    }
  }

  const handleStartEdit = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(id)
    setEditName(name)
  }

  const handleFinishEdit = () => {
    if (editingId && editName.trim()) {
      const { updateSession } = useAppStore.getState()
      updateSession(editingId, { name: editName.trim() })
    }
    setEditingId(null)
    setEditName('')
  }

  const toggleSidebar = () => {
    updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed })
  }

  return (
    <div 
      ref={columnRef}
      className={`sidebar ${settings.sidebarCollapsed ? 'collapsed' : ''} ${!wide && 'rail-in'}`}
      style={wide ? { width: settings.sidebarCollapsed ? 240 : settings.sidebarWidth } : undefined}
    >
      <div className="sidebar-brand">
        {wide && (
          <button className="brand-btn" onClick={handleCreateSession}>
            <span className="brand-icon">
              <FishLogoGlow size={24} />
            </span>
            <span className="brand-name">DeepSeek Harness</span>
          </button>
        )}
        <button className="toggle-btn" onClick={toggleSidebar} title={settings.sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}>
          {!wide && (
            <span className="rail-mark">
              <FishLogoGlow size={20} />
            </span>
          )}
          {settings.sidebarCollapsed ? (
            <IconChevronRight size={wide ? 16 : 18} />
          ) : (
            <IconChevronLeft size={wide ? 16 : 18} />
          )}
        </button>
      </div>

      <div className="new-session-area">
        <button className="new-session-btn" onClick={handleCreateSession}>
          <IconPlus size={wide ? 14 : 18} />
          {wide && <span className="new-session-label">{t.sidebar.newSession}</span>}
        </button>
      </div>

      <div className="session-region">
        {wide && (
          <div className="sidebar-search">
            <IconSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder={t.sidebar.searchSessions}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        <div className="session-list pointer-scrollbar" ref={sessionListRef}>
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
                      <IconFile size={16} />
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
                          <IconEdit size={14} />
                        </button>
                        <button
                          className="session-action-btn delete"
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          title={t.sidebar.deleteSession}
                        >
                          <IconTrash size={14} />
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

      <div className="sidebar-foot">
        <button 
          className="footer-btn"
          title={t.settings.title}
          onClick={onOpenSettings}
        >
          <IconSettings size={wide ? 16 : 18} />
          {wide && <span className="footer-label">{t.settings.title}</span>}
        </button>
      </div>
    </div>
  )
}
