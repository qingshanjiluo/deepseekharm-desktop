import React, { useState, useRef, useEffect, useCallback } from 'react'
import './Tooltip.css'

interface TooltipProps {
  children: React.ReactElement
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
  maxWidth?: number
}

export function Tooltip({ 
  children, 
  content, 
  side = 'top', 
  delay = 300,
  disabled = false,
  maxWidth = 250,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number>()

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return
    
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    let top = 0
    let left = 0

    switch (side) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - 8
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2
        break
      case 'bottom':
        top = triggerRect.bottom + scrollY + 8
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2
        break
      case 'left':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.left + scrollX - tooltipRect.width - 8
        break
      case 'right':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.right + scrollX + 8
        break
    }

    // 视口边界检测
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    if (left < 8) left = 8
    if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8
    }
    if (top < 8) top = triggerRect.bottom + scrollY + 8
    if (top + tooltipRect.height > viewportHeight + scrollY - 8) {
      top = triggerRect.top + scrollY - tooltipRect.height - 8
    }

    setPosition({ top, left })
  }, [side])

  const showTooltip = useCallback(() => {
    if (disabled || !content) return
    timeoutRef.current = window.setTimeout(() => {
      setVisible(true)
    }, delay)
  }, [disabled, content, delay])

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setVisible(false)
  }, [])

  useEffect(() => {
    if (visible) {
      updatePosition()
    }
  }, [visible, updatePosition])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!content) return children

  return (
    <div 
      ref={triggerRef}
      className="tooltip-trigger"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          className={`tooltip-content ${side}`}
          role="tooltip"
          style={{ 
            top: position.top, 
            left: position.left,
            maxWidth,
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
