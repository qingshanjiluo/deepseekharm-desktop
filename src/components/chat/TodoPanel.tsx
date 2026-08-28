import React, { useState } from 'react'
import './TodoPanel.css'

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

interface TodoPanelProps {
  items: TodoItem[]
  onToggle: (id: string) => void
  onAdd: (text: string) => void
  onRemove: (id: string) => void
}

export function TodoPanel({ items, onToggle, onAdd, onRemove }: TodoPanelProps) {
  const [newTodo, setNewTodo] = useState('')
  const completedCount = items.filter(i => i.completed).length

  const handleAdd = () => {
    if (newTodo.trim()) {
      onAdd(newTodo.trim())
      setNewTodo('')
    }
  }

  return (
    <div className="todo-panel">
      <div className="todo-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        <span>任务列表</span>
        <span className="todo-count">{completedCount}/{items.length}</span>
      </div>
      
      <div className="todo-input-row">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="添加任务..."
          className="todo-input"
        />
        <button className="todo-add-btn" onClick={handleAdd} disabled={!newTodo.trim()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <div className="todo-list">
        {items.length === 0 ? (
          <div className="todo-empty">暂无任务</div>
        ) : (
          items.map(item => (
            <div key={item.id} className={`todo-item ${item.completed ? 'completed' : ''}`}>
              <button 
                className="todo-checkbox"
                onClick={() => onToggle(item.id)}
              >
                {item.completed ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  </svg>
                )}
              </button>
              <span className="todo-text">{item.text}</span>
              <button className="todo-remove" onClick={() => onRemove(item.id)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
