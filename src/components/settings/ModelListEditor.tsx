import React, { useState } from 'react'
import './ModelListEditor.css'

export interface ModelItem {
  id: string
  name: string
  displayName: string
  maxTokens: number
  enabled: boolean
}

interface ModelListEditorProps {
  models: ModelItem[]
  onChange: (models: ModelItem[]) => void
  onReset: () => void
}

export function ModelListEditor({ models, onChange, onReset }: ModelListEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    
    const newModels = [...models]
    const [dragged] = newModels.splice(dragIndex, 1)
    newModels.splice(index, 0, dragged)
    onChange(newModels)
    setDragIndex(index)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  const handleToggle = (id: string) => {
    onChange(models.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m))
  }

  const handleDelete = (id: string) => {
    onChange(models.filter(m => m.id !== id))
  }

  return (
    <div className="model-list-editor">
      <div className="editor-header">
        <span className="editor-title">模型列表</span>
        <button className="reset-btn" onClick={onReset}>重置为默认</button>
      </div>
      <div className="model-list">
        {models.map((model, index) => (
          <div
            key={model.id}
            className={`model-item ${dragIndex === index ? 'dragging' : ''} ${!model.enabled ? 'disabled' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="drag-handle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/>
                <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>
                <circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>
              </svg>
            </div>
            <div className="model-info">
              <span className="model-name">{model.displayName || model.name}</span>
              <span className="model-tokens">{model.maxTokens.toLocaleString()} tokens</span>
            </div>
            <div className="model-actions">
              <button 
                className={`toggle-btn ${model.enabled ? 'on' : ''}`}
                onClick={() => handleToggle(model.id)}
              >
                {model.enabled ? '启用' : '禁用'}
              </button>
              <button className="delete-btn" onClick={() => handleDelete(model.id)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
