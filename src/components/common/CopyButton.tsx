import React, { useState } from 'react'
import { useCopyFeedback } from '../../hooks/useCopyFeedback'
import './CopyButton.css'

interface CopyButtonProps {
  text: string
  className?: string
  label?: string
}

export function CopyButton({ text, className = '', label = '复制' }: CopyButtonProps) {
  const { copied, copy } = useCopyFeedback()

  return (
    <button
      className={`copy-button ${copied ? 'copied' : ''} ${className}`}
      onClick={() => copy(text)}
      title={copied ? '已复制' : label}
      aria-label={copied ? '已复制' : label}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      )}
      {label && <span className="copy-label">{copied ? '已复制' : label}</span>}
    </button>
  )
}
