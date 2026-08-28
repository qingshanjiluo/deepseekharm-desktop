import React, { useState } from 'react'
import './ProviderEditor.css'

export interface LLMProvider {
  id: string
  name: string
  apiKey: string
  baseUrl: string
  models: string[]
  enabled: boolean
}

interface ProviderEditorProps {
  providers: LLMProvider[]
  onChange: (providers: LLMProvider[]) => void
}

export function ProviderEditor({ providers, onChange }: ProviderEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newProvider, setNewProvider] = useState<Partial<LLMProvider>>({
    name: '',
    apiKey: '',
    baseUrl: '',
    models: [],
    enabled: true,
  })

  const handleAdd = () => {
    if (newProvider.name && newProvider.apiKey) {
      const provider: LLMProvider = {
        id: Math.random().toString(36).substring(2),
        name: newProvider.name,
        apiKey: newProvider.apiKey,
        baseUrl: newProvider.baseUrl || '',
        models: newProvider.models || [],
        enabled: true,
      }
      onChange([...providers, provider])
      setNewProvider({ name: '', apiKey: '', baseUrl: '', models: [], enabled: true })
      setShowAdd(false)
    }
  }

  const handleDelete = (id: string) => {
    onChange(providers.filter(p => p.id !== id))
  }

  const handleToggle = (id: string) => {
    onChange(providers.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  }

  return (
    <div className="provider-editor">
      <div className="editor-header">
        <span className="editor-title">自定义 Provider</span>
        <button className="add-btn" onClick={() => setShowAdd(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          添加 Provider
        </button>
      </div>

      <div className="provider-list">
        {providers.map(provider => (
          <div key={provider.id} className={`provider-card ${editingId === provider.id ? 'editing' : ''}`}>
            <div className="provider-header">
              <div className="provider-info">
                <span className="provider-name">{provider.name}</span>
                <span className="provider-url">{provider.baseUrl || '默认'}</span>
              </div>
              <div className="provider-actions">
                <button 
                  className={`toggle-btn ${provider.enabled ? 'on' : ''}`}
                  onClick={() => handleToggle(provider.id)}
                >
                  {provider.enabled ? '启用' : '禁用'}
                </button>
                <button className="edit-btn" onClick={() => setEditingId(editingId === provider.id ? null : provider.id)}>
                  编辑
                </button>
                <button className="delete-btn" onClick={() => handleDelete(provider.id)}>删除</button>
              </div>
            </div>
            {editingId === provider.id && (
              <div className="provider-edit">
                <div className="edit-field">
                  <label>名称</label>
                  <input value={provider.name} readOnly />
                </div>
                <div className="edit-field">
                  <label>API Key</label>
                  <input type="password" value={provider.apiKey} readOnly />
                </div>
                <div className="edit-field">
                  <label>Base URL</label>
                  <input value={provider.baseUrl} readOnly />
                </div>
                <div className="edit-field">
                  <label>模型（逗号分隔）</label>
                  <input value={provider.models.join(', ')} readOnly />
                </div>
              </div>
            )}
          </div>
        ))}

        {showAdd && (
          <div className="provider-card adding">
            <div className="provider-edit">
              <div className="edit-field">
                <label>名称</label>
                <input 
                  value={newProvider.name} 
                  onChange={e => setNewProvider(p => ({ ...p, name: e.target.value }))}
                  placeholder="例如: OpenAI"
                />
              </div>
              <div className="edit-field">
                <label>API Key</label>
                <input 
                  type="password"
                  value={newProvider.apiKey} 
                  onChange={e => setNewProvider(p => ({ ...p, apiKey: e.target.value }))}
                  placeholder="sk-..."
                />
              </div>
              <div className="edit-field">
                <label>Base URL</label>
                <input 
                  value={newProvider.baseUrl} 
                  onChange={e => setNewProvider(p => ({ ...p, baseUrl: e.target.value }))}
                  placeholder="https://api.openai.com/v1"
                />
              </div>
              <div className="edit-field">
                <label>模型（逗号分隔）</label>
                <input 
                  value={newProvider.models?.join(', ')} 
                  onChange={e => setNewProvider(p => ({ ...p, models: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  placeholder="gpt-4o, gpt-4o-mini"
                />
              </div>
              <div className="edit-actions">
                <button className="cancel-btn" onClick={() => setShowAdd(false)}>取消</button>
                <button className="save-btn" onClick={handleAdd}>保存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
