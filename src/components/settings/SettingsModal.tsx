import React, { useState } from 'react'
import { useAppStore } from '../../store'
import { useTranslation, localeNames, Locale } from '../../i18n'
import { storageService } from '../../services/storage-service'
import './SettingsModal.css'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

type SettingsTab = 'general' | 'models' | 'appearance' | 'shortcuts' | 'data'

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useAppStore()
  const { t, locale, setLocale } = useTranslation()
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  if (!isOpen) return null

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'general',
      label: t.settings.general,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
    },
    {
      id: 'models',
      label: t.settings.models,
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
      label: t.settings.appearance,
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
      label: t.settings.shortcuts,
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
    {
      id: 'data',
      label: '数据管理',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="settings-header">
          <h2 className="settings-title">{t.settings.title}</h2>
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
              <GeneralSettings 
                settings={settings} 
                onUpdate={updateSettings}
                t={t}
                locale={locale}
                setLocale={setLocale}
              />
            )}
            {activeTab === 'models' && (
              <ModelSettings settings={settings} onUpdate={updateSettings} t={t} />
            )}
            {activeTab === 'appearance' && (
              <AppearanceSettings settings={settings} onUpdate={updateSettings} t={t} />
            )}
            {activeTab === 'shortcuts' && (
              <ShortcutSettings t={t} />
            )}
            {activeTab === 'data' && (
              <DataSettings t={t} />
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
  onUpdate,
  t,
  locale,
  setLocale
}: { 
  settings: any
  onUpdate: (updates: any) => void
  t: any
  locale: Locale
  setLocale: (locale: Locale) => void
}) {
  return (
    <div className="settings-section">
      <h3 className="section-title">{t.settings.general}</h3>
      
      {/* 语言设置 */}
      <div className="setting-item vertical">
        <div className="setting-label">
          <span className="label-text">{t.settings.language}</span>
          <span className="label-desc">{t.settings.languageDesc}</span>
        </div>
        <div className="locale-options">
          {(['zh-CN', 'en-US', 'ja-JP'] as Locale[]).map((loc) => (
            <button
              key={loc}
              className={`locale-btn ${locale === loc ? 'active' : ''}`}
              onClick={() => setLocale(loc)}
            >
              {localeNames[loc]}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span className="label-text">{t.settings.enterToSend}</span>
          <span className="label-desc">{t.settings.enterToSendDesc}</span>
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
          <span className="label-text">{t.settings.showTokenCount}</span>
          <span className="label-desc">{t.settings.showTokenCountDesc}</span>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.showTokenCount}
            onChange={(e) => onUpdate({ showTokenCount: e.target.checked })}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span className="label-text">{t.settings.compactMode}</span>
          <span className="label-desc">{t.settings.compactModeDesc}</span>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.compactMode}
            onChange={(e) => onUpdate({ compactMode: e.target.checked })}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span className="label-text">{t.settings.autoSave}</span>
          <span className="label-desc">{t.settings.autoSaveDesc}</span>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={(e) => onUpdate({ autoSave: e.target.checked })}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span className="label-text">{t.settings.sandboxMode}</span>
          <span className="label-desc">{t.settings.sandboxModeDesc}</span>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.sandboxMode}
            onChange={(e) => onUpdate({ sandboxMode: e.target.checked })}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  )
}

// 模型设置
function ModelSettings({ 
  settings, 
  onUpdate,
  t
}: { 
  settings: any
  onUpdate: (updates: any) => void
  t: any
}) {
  const [apiKey, setApiKey] = useState(settings.apiKey || '')
  const [apiEndpoint, setApiEndpoint] = useState(settings.apiEndpoint || '')

  return (
    <div className="settings-section">
      <h3 className="section-title">{t.settings.models}</h3>
      
      <div className="setting-item vertical">
        <div className="setting-label">
          <span className="label-text">{t.settings.apiKey}</span>
          <span className="label-desc">{t.settings.apiKeyDesc}</span>
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
            {t.common.save}
          </button>
        </div>
      </div>

      <div className="setting-item vertical">
        <div className="setting-label">
          <span className="label-text">{t.settings.apiEndpoint}</span>
          <span className="label-desc">{t.settings.apiEndpointDesc}</span>
        </div>
        <div className="api-key-input">
          <input
            type="text"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            placeholder="https://api.deepseek.com"
            className="text-input"
          />
          <button 
            className="save-btn"
            onClick={() => onUpdate({ apiEndpoint })}
          >
            {t.common.save}
          </button>
        </div>
      </div>

      <div className="setting-item vertical">
        <div className="setting-label">
          <span className="label-text">{t.settings.defaultModel}</span>
          <span className="label-desc">{t.settings.defaultModelDesc}</span>
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
          <span className="label-text">{t.settings.defaultModel.replace('默认', '')}</span>
          <span className="label-desc">{t.settings.apiEndpointDesc}</span>
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
  onUpdate,
  t
}: { 
  settings: any
  onUpdate: (updates: any) => void
  t: any
}) {
  return (
    <div className="settings-section">
      <h3 className="section-title">{t.settings.appearance}</h3>
      
      <div className="setting-item vertical">
        <div className="setting-label">
          <span className="label-text">{t.settings.theme}</span>
          <span className="label-desc">{t.settings.themeDesc}</span>
        </div>
        <div className="theme-options">
          {(['dark', 'light', 'system'] as const).map((theme) => (
            <button
              key={theme}
              className={`theme-btn ${settings.theme === theme ? 'active' : ''}`}
              onClick={() => onUpdate({ theme })}
            >
              {theme === 'dark' && t.settings.darkTheme}
              {theme === 'light' && t.settings.lightTheme}
              {theme === 'system' && t.settings.systemTheme}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span className="label-text">{t.settings.fontSize}</span>
          <span className="label-desc">{settings.fontSize}px</span>
        </div>
        <input
          type="range"
          min="12"
          max="18"
          value={settings.fontSize}
          onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
          className="range-input"
        />
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
function ShortcutSettings({ t }: { t: any }) {
  const shortcuts = [
    { name: t.settings.sendMessage, keys: 'Enter' },
    { name: '换行', keys: 'Shift + Enter' },
    { name: t.settings.newChat, keys: 'Ctrl + N' },
    { name: t.settings.search, keys: 'Ctrl + F' },
    { name: t.settings.toggleSidebar, keys: 'Ctrl + B' },
    { name: t.settings.toggleDetails, keys: 'Ctrl + .' },
    { name: t.settings.focusInput, keys: 'Ctrl + /' },
    { name: t.settings.stopGeneration, keys: 'Ctrl + Shift + S' },
    { name: '复制最后响应', keys: 'Ctrl + Shift + C' },
  ]

  return (
    <div className="settings-section">
      <h3 className="section-title">{t.settings.keyboardShortcuts}</h3>
      
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

// 数据管理设置
function DataSettings({ t }: { t: ReturnType<typeof useTranslation>['t'] }) {
  const { sessions, deleteSession } = useAppStore()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  const handleExportAll = async () => {
    setIsExporting(true)
    setStatus('idle')
    try {
      const sessionIds = sessions.map(s => s.id)
      // Build messages map from sessions
      const messageMap: Record<string, any[]> = {}
      for (const session of sessions) {
        messageMap[session.id] = session.messages
      }
      const data = await storageService.exportSessions(sessionIds, sessions, messageMap)
      const success = await storageService.exportToFile(data)
      if (success) {
        setStatus('success')
        setStatusMsg(`已导出 ${sessions.length} 个会话`)
      }
    } catch (error) {
      setStatus('error')
      setStatusMsg('导出失败: ' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    setIsImporting(true)
    setStatus('idle')
    try {
      const data = await storageService.importFromFile()
      if (!data) {
        setIsImporting(false)
        return
      }
      
      const result = await storageService.importSessions(data)
      
      // 合并导入的数据
      const { createSession, updateSession } = useAppStore.getState()
      
      for (const session of result.sessions) {
        const existing = sessions.find(s => s.id === session.id)
        if (!existing) {
          const newSession = createSession(session.name)
          updateSession(newSession.id, {
            model: session.model,
            messages: session.messages,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
          })
        }
      }
      
      setStatus('success')
      setStatusMsg(`已导入 ${result.sessions.length} 个会话`)
    } catch (error) {
      setStatus('error')
      setStatusMsg('导入失败: ' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="settings-section">
      <h3 className="section-title">数据管理</h3>
      
      <div className="data-section">
        <div className="data-info">
          <p>当前共有 <strong>{sessions.length}</strong> 个会话</p>
          <p className="data-hint">导出会话数据可用于备份或迁移到其他设备</p>
        </div>

        <div className="data-actions">
          <button 
            className="btn-export"
            onClick={handleExportAll}
            disabled={isExporting || sessions.length === 0}
          >
            {isExporting ? '导出中...' : '导出所有会话'}
          </button>

          <button 
            className="btn-import"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting ? '导入中...' : '导入会话'}
          </button>
        </div>

        {status !== 'idle' && (
          <div className={`data-status ${status}`}>
            {status === 'success' ? '✓ ' : '✗ '}{statusMsg}
          </div>
        )}
      </div>
    </div>
  )
}
