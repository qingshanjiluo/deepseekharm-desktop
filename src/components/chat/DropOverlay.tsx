import React from 'react'
import './DropOverlay.css'

interface DropOverlayProps {
  isDragging: boolean
  fileCount?: number
}

export function DropOverlay({ isDragging, fileCount = 0 }: DropOverlayProps) {
  if (!isDragging) return null

  return (
    <div className="drop-overlay">
      <div className="drop-content">
        <div className="drop-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <h3 className="drop-title">释放以添加附件</h3>
        <p className="drop-hint">
          {fileCount > 0 
            ? `已选择 ${fileCount} 个文件` 
            : '支持代码、图片、文档等文件'}
        </p>
        <div className="drop-formats">
          <span className="format-badge">代码</span>
          <span className="format-badge">图片</span>
          <span className="format-badge">文档</span>
          <span className="format-badge">文本</span>
        </div>
      </div>
    </div>
  )
}
