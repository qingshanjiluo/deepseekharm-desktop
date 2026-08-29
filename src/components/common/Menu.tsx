import React, { useState, useRef, useEffect, useCallback } from 'react'
import './Menu.css'

export interface MenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  separator?: boolean
  submenu?: MenuItem[]
}

interface MenuProps {
  items: MenuItem[]
  isOpen: boolean
  onClose: () => void
  onSelect: (id: string) => void
  anchorRef?: React.RefObject<HTMLElement>
  align?: 'start' | 'end'
  side?: 'top' | 'bottom'
}

export function Menu({ 
  items, 
  isOpen, 
  onClose, 
  onSelect,
  anchorRef,
  align = 'start',
  side = 'bottom',
}: MenuProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    if (!anchorRef?.current || !menuRef.current) return
    
    const anchorRect = anchorRef.current.getBoundingClientRect()
    const menuRect = menuRef.current.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    let top = side === 'bottom' 
      ? anchorRect.bottom + scrollY + 4
      : anchorRect.top + scrollY - menuRect.height - 4

    let left = align === 'end'
      ? anchorRect.right + scrollX - menuRect.width
      : anchorRect.left + scrollX

    // 视口边界检测
    if (left + menuRect.width > window.innerWidth - 8) {
      left = window.innerWidth - menuRect.width - 8
    }
    if (left < 8) left = 8

    setPosition({ top, left })
  }, [anchorRef, align, side])

  useEffect(() => {
    if (isOpen) {
      updatePosition()
    }
  }, [isOpen, updatePosition])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="menu-dropdown"
      role="menu"
      style={{ top: position.top, left: position.left }}
    >
      {items.map((item) => {
        if (item.separator) {
          return <div key={item.id} className="menu-separator" role="separator" />
        }

        return (
          <div
            key={item.id}
            className={`menu-item ${item.danger ? 'danger' : ''} ${item.disabled ? 'disabled' : ''}`}
            role="menuitem"
            tabIndex={item.disabled ? -1 : 0}
            onClick={() => {
              if (!item.disabled) {
                onSelect(item.id)
                onClose()
              }
            }}
            onMouseEnter={() => item.submenu && setActiveSubmenu(item.id)}
            onMouseLeave={() => item.submenu && setActiveSubmenu(null)}
          >
            {item.icon && <span className="menu-item-icon">{item.icon}</span>}
            <span className="menu-item-label">{item.label}</span>
            {item.shortcut && <span className="menu-item-shortcut">{item.shortcut}</span>}
            {item.submenu && (
              <svg className="menu-item-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            )}
            {item.submenu && activeSubmenu === item.id && (
              <div className="menu-submenu">
                {item.submenu.map(subItem => (
                  <div
                    key={subItem.id}
                    className={`menu-item ${subItem.danger ? 'danger' : ''} ${subItem.disabled ? 'disabled' : ''}`}
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!subItem.disabled) {
                        onSelect(subItem.id)
                        onClose()
                      }
                    }}
                  >
                    {subItem.icon && <span className="menu-item-icon">{subItem.icon}</span>}
                    <span className="menu-item-label">{subItem.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
