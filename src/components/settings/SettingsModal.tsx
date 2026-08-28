import React, { useState } from 'react'
import { useAppStore } from '../../store'
import './SettingsModal.css'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

type SettingsTab = 'general' | 'models' | 'appearance' | 'shortcuts'

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useAppStore()
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  if (!isOpen) return null

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'general',
      label: '通用',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
    },
    {
      id: 'models',
      label: '模型',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
    },
    {
      id: 'appearance',
      label: '外观',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ),
    },
    {
      id: 'shortcuts',
      label: '快捷键',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
          <line x1="6" y1="8" x2="6" y2="8"/>
          <line x1="10" y1="8" x2="10" y2="8"/>
          <line x1="14" y1="8" x2="14" y2="8"/>
          <line x1="18" y1="8" x2="18" y2="8"/>
          <line x1="8" y1="12" x2="8" y2="12"/>
          <line x1="12" y1="12" x2="12" y2="12"/>
          <line x1="16" y1="12" x2="16" y2="12"/>
          <line x1="7" y1="16" x2="17" y2="16"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="settings-header">
          <h2 className="settings-title">设置</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="settings-body">
          {/* 侧边栏标签 */}
          <div className="settings-sidebar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 内容区 */}
          <div className="settings-content">
            {activeTab === 'general' && (
              <GeneralSettings settings={settings} onUpdate={updateSettings} />
            )}
            {activeTab === 'models' && (
              <ModelSettings settings={settings} onUpdate={updateSettings} />
            )}
            {activeTab === 'appearance' && (
              <AppearanceSettings settings={settings} onUpdate={updateSettings} />
            )}
            {activeTab === 'shortcuts' && (
              <ShortcutSettings />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 通用设置
function GeneralSettings({ 
  settings, 
  onUpdate 
}: { 
  settings: any
  onUpdate: (updates: any) => void 
}) {
  return (
    <div className="settings-section">
      <h3 className="section-title">通用设置</h3>
      
      <div className="setting-item">
        <div className="setting-label">
          <span className="label-text">Enter 发送消息</span>
          <span className="label-desc">按 Enter 键直接发送，Shift+Enter 换行</span>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.enterToSend}
            onChange={(e) => onUpdate({ enterToSend: e.target.checked })}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span className="label-text">流式响应</span>
          <span className="label-desc">启用实时流式输出</span>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.streamingEnabled}
            onChange={(e) => onUpdate({ streamingEnabled: e.target.checked })}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span className="label-text">自动保存会话</span>
          <span className="label-desc">关闭时自动保存对话记录</span>
        </div>
        <label className="toggle">
          <input type="checkbox" checked readOnly />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  )
}

// 模型设置
function ModelSettings({ 
  settings, 
  onUpdate 
}: { 
  settings: any
  onUpdate: (updates: any) => void 
}) {
  const [apiKey, setApiKey] = useState(settings.apiKey || '')

  return (
    <div className="settings-section">
      <h3 className="section-title">模型配置</h3>
      
      <div className="setting-item vertical">
        <div className="setting-label">
          <span className="label-text">API Key</span>
          <span className="label-desc">DeepSeek API 密钥</span>
        </div>
        <div className="api-key-input">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="text-input"
          />
          <button 
            className="save-btn"
            onClick={() => onUpdate({ apiKey })}
          >
            保存
          </button>
        </div>
      </div>

      <div className="setting-item vertical">
        <div className="setting-label">
          <span className="label-text">模型</span>
          <span className="label-desc">选择使用的 AI 模型</span>
        </div>
        <select
          value={settings.model}
          onChange={(e) => onUpdate({ model: e.target.value })}
          className="select-input"
        >
          <option value="deepseek-chat">DeepSeek Chat</option>
          <option value="deepseek-coder">DeepSeek Coder</option>
          <option value="deepseek-reasoner">DeepSeek Reasoner</option>
        </select>
      </div>

      <div className="setting-item vertical">
        <div className="setting-label">
          <span className="label-text">提供者</span>
          <span className="label-desc">API 服务提供者</span>
        </div>
        <select
          value={settings.provider}
          onChange={(e) => onUpdate({ provider: e.target.value })}
          className="select-input"
        >
          <option value="deepseek">DeepSeek 官方</option>
          <option value="openai">OpenAI 兼容</option>
          <option value="custom">自定义</option>
        </select>
      </div>
    </div>
  )
}

// 外观设置
function AppearanceSettings({ 
  settings, 
  onUpdate 
}: { 
  settings: any
  onUpdate: (updates: any) => void 
}) {
  return (
    <div className="settings-section">
      <h3 className="section-title">外观设置</h3>
      
      <div className="setting-item vertical">
        <div className="setting-label">
          <span className="label-text">主题</span>
          <span className="label-desc">选择应用主题</span>
        </div>
        <div className="theme-options">
          {(['dark', 'light', 'system'] as const).map((theme) => (
            <button
              key={theme}
              className={`theme-btn ${settings.theme === theme ? 'active' : ''}`}
              onClick={() => onUpdate({ theme })}
            >
              {theme === 'dark' && '深色'}
              {theme === 'light' && '浅色'}
              {theme === 'system' && '跟随系统'}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span className="label-text">侧边栏宽度</span>
          <span className="label-desc">{settings.sidebarWidth}px</span>
        </div>
        <input
          type="range"
          min="200"
          max="400"
          value={settings.sidebarWidth}
          onChange={(e) => onUpdate({ sidebarWidth: parseInt(e.target.value) })}
          className="range-input"
        />
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span className="label-text">详情面板宽度</span>
          <span className="label-desc">{settings.detailsWidth}px</span>
        </div>
        <input
          type="range"
          min="200"
          max="500"
          value={settings.detailsWidth}
          onChange={(e) => onUpdate({ detailsWidth: parseInt(e.target.value) })}
          className="range-input"
        />
      </div>
    </div>
  )
}

// 快捷键设置
function ShortcutSettings() {
  const shortcuts = [
    { name: '发送消息', keys: 'Enter' },
    { name: '换行', keys: 'Shift + Enter' },
    { name: '新建会话', keys: 'Ctrl + N' },
    { name: '搜索会话', keys: 'Ctrl + F' },
    { name: '切换侧边栏', keys: 'Ctrl + B' },
    { name: '打开设置', keys: 'Ctrl + ,' },
    { name: '复制最后响应', keys: 'Ctrl + Shift + C' },
  ]

  return (
    <div className="settings-section">
      <h3 className="section-title">快捷键</h3>
      
      <div className="shortcuts-list">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.name} className="shortcut-item">
            <span className="shortcut-name">{shortcut.name}</span>
            <kbd className="shortcut-keys">{shortcut.keys}</kbd>
          </div>
        ))}
      </div>
    </div>
  )
}
