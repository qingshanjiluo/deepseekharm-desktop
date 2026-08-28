import React, { useState, useCallback, useEffect } from 'react'
import { useAppStore } from '../../store'
import { Sidebar } from './Sidebar'
import { DetailsPanel } from './DetailsPanel'
import './AppFrame.css'

export function AppFrame({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useAppStore()
  const [isResizing, setIsResizing] = useState(false)
  const [resizeTarget, setResizeTarget] = useState<'sidebar' | 'details' | null>(null)

  // 处理面板拖拽调整
  const handleMouseDown = useCallback((target: 'sidebar' | 'details') => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    setResizeTarget(target)
  }, [])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (resizeTarget === 'sidebar') {
        const newWidth = Math.min(Math.max(e.clientX, 200), 400)
        updateSettings({ sidebarWidth: newWidth })
      } else if (resizeTarget === 'details') {
        const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 200), 500)
        updateSettings({ detailsWidth: newWidth })
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeTarget(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, resizeTarget, updateSettings])

  return (
    <div className="app-frame">
      {/* 侧边栏 */}
      <div 
        className={`sidebar-panel ${settings.sidebarCollapsed ? 'collapsed' : ''}`}
        style={{ width: settings.sidebarCollapsed ? 0 : settings.sidebarWidth }}
      >
        <Sidebar />
      </div>

      {/* 侧边栏拖拽手柄 */}
      {!settings.sidebarCollapsed && (
        <div 
          className="resize-handle sidebar-handle"
          onMouseDown={handleMouseDown('sidebar')}
        />
      )}

      {/* 主内容区 */}
      <div className="main-panel">
        {children}
      </div>

      {/* 详情面板拖拽手柄 */}
      {!settings.detailsCollapsed && (
        <div 
          className="resize-handle details-handle"
          onMouseDown={handleMouseDown('details')}
        />
      )}

      {/* 详情面板 */}
      <div 
        className={`details-panel ${settings.detailsCollapsed ? 'collapsed' : ''}`}
        style={{ width: settings.detailsCollapsed ? 0 : settings.detailsWidth }}
      >
        <DetailsPanel />
      </div>
    </div>
  )
}
