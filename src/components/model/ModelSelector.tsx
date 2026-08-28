import React, { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../../store'
import './ModelSelector.css'

interface Model {
  id: string
  name: string
  provider: string
  description: string
  maxTokens: number
  contextWindow: number
  tags: string[]
}

const models: Model[] = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek-V3',
    provider: 'deepseek',
    description: '通用对话模型，平衡性能与成本',
    maxTokens: 8192,
    contextWindow: 65536,
    tags: ['推荐', '快速'],
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek-R1',
    provider: 'deepseek',
    description: '推理模型，适合复杂逻辑任务',
    maxTokens: 8192,
    contextWindow: 65536,
    tags: ['推理', '强大'],
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'OpenAI 多模态模型',
    maxTokens: 16384,
    contextWindow: 128000,
    tags: ['多模态', '强大'],
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: '轻量级 GPT-4o，性价比高',
    maxTokens: 16384,
    contextWindow: 128000,
    tags: ['轻量', '快速'],
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: 'Anthropic 旗舰模型，擅长代码',
    maxTokens: 8192,
    contextWindow: 200000,
    tags: ['代码', '推荐'],
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: '轻量级 Claude，响应最快',
    maxTokens: 4096,
    contextWindow: 200000,
    tags: ['轻量', '快速'],
  },
]

const providerColors: Record<string, string> = {
  deepseek: '#4f8cff',
  openai: '#10a37f',
  anthropic: '#d4a574',
}

interface ModelSelectorProps {
  compact?: boolean
}

export function ModelSelector({ compact = false }: ModelSelectorProps) {
  const { settings, updateSettings } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  const currentModel = models.find(m => m.id === settings.model) || models[0]

  const filteredModels = models.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.provider.toLowerCase().includes(search.toLowerCase()) ||
    m.tags.some(t => t.includes(search))
  )

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectModel = (model: Model) => {
    updateSettings({
      model: model.id,
      provider: model.provider as any,
    })
    setIsOpen(false)
    setSearch('')
  }

  if (compact) {
    return (
      <div className="model-selector compact" ref={menuRef}>
        <button
          className="model-trigger compact"
          onClick={() => setIsOpen(!isOpen)}
          title="切换模型"
        >
          <span
            className="provider-dot"
            style={{ background: providerColors[currentModel.provider] }}
          />
          <span className="model-name">{currentModel.name}</span>
        </button>

        {isOpen && (
          <div className="model-dropdown">
            <div className="search-wrapper">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索模型..."
                className="model-search"
                autoFocus
              />
            </div>
            <div className="model-list">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  className={`model-option ${model.id === settings.model ? 'active' : ''}`}
                  onClick={() => handleSelectModel(model)}
                >
                  <span
                    className="provider-dot"
                    style={{ background: providerColors[model.provider] }}
                  />
                  <span className="option-name">{model.name}</span>
                  {model.tags[0] && (
                    <span className="option-tag">{model.tags[0]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="model-selector" ref={menuRef}>
      <button
        className="model-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="trigger-content">
          <span
            className="provider-dot large"
            style={{ background: providerColors[currentModel.provider] }}
          />
          <div className="trigger-info">
            <span className="trigger-name">{currentModel.name}</span>
            <span className="trigger-provider">{currentModel.provider}</span>
          </div>
        </div>
        <svg
          className={`chevron ${isOpen ? 'open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="model-dropdown">
          <div className="search-wrapper">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索模型..."
              className="model-search"
              autoFocus
            />
          </div>

          <div className="model-list">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className={`model-option ${model.id === settings.model ? 'active' : ''}`}
                onClick={() => handleSelectModel(model)}
              >
                <div className="option-left">
                  <span
                    className="provider-dot"
                    style={{ background: providerColors[model.provider] }}
                  />
                  <div className="option-info">
                    <span className="option-name">{model.name}</span>
                    <span className="option-desc">{model.description}</span>
                  </div>
                </div>
                <div className="option-right">
                  <span className="option-tags">
                    {model.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="option-tag">
                        {tag}
                      </span>
                    ))}
                  </span>
                  <span className="option-context">
                    {(model.contextWindow / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="model-footer">
            <button
              className="manage-btn"
              onClick={() => {
                setIsOpen(false)
                // TODO: 打开模型管理
              }}
            >
              管理模型...
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
