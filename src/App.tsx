import { useState, useEffect } from 'react'
import { AppFrame } from './components/layout/AppFrame'
import { ChatView } from './components/chat/ChatView'
import { useAppStore } from './store'
import { useKeyboardShortcuts } from './hooks'
import './App.css'

// 声明全局API类型
declare global {
  interface Window {
    deepSeek?: {
      window: {
        minimize: () => Promise<void>
        maximize: () => Promise<void>
        close: () => Promise<void>
        isMaximized: () => Promise<boolean>
      }
      llm: {
        stream: (options: any) => AsyncIterable<any>
        listModels: () => Promise<any[]>
        setProvider: (provider: string) => Promise<void>
        getConfig: () => Promise<any>
        updateConfig: (config: any) => Promise<void>
      }
      tools: {
        execute: (name: string, args: any) => Promise<any>
        list: () => Promise<any[]>
      }
      sessions: {
        create: (name?: string) => Promise<any>
        load: (id: string) => Promise<any>
        save: (session: any) => Promise<void>
        delete: (id: string) => Promise<void>
        list: () => Promise<any[]>
      }
      fs: {
        readFile: (path: string) => Promise<string>
        writeFile: (path: string, content: string) => Promise<void>
        readDir: (path: string) => Promise<any[]>
        pickDirectory: () => Promise<string | null>
        pickFile: (options?: any) => Promise<string | null>
        exists: (path: string) => Promise<boolean>
        stat: (path: string) => Promise<any>
      }
      system: {
        getPlatform: () => Promise<string>
        getVersion: () => Promise<string>
        getHomeDir: () => Promise<string>
        getTempDir: () => Promise<string>
      }
      on: {
        updateAvailable: (callback: (info: any) => void) => () => void
        updateDownloaded: (callback: (info: any) => void) => () => void
        updateProgress: (callback: (progress: any) => void) => () => void
        notification: (callback: (data: any) => void) => () => void
      }
    }
  }
}

function App() {
  const [platform, setPlatform] = useState('')
  const { settings } = useAppStore()
  
  // 初始化键盘快捷键
  useKeyboardShortcuts()

  useEffect(() => {
    // 获取系统信息
    if (window.deepSeek) {
      window.deepSeek.system.getPlatform().then(setPlatform)
    }
  }, [])

  // 窗口控制
  const handleMinimize = async () => {
    await window.deepSeek?.window.minimize()
  }

  const handleMaximize = async () => {
    await window.deepSeek?.window.maximize()
  }

  const handleClose = async () => {
    await window.deepSeek?.window.close()
  }

  return (
    <div className="app" data-theme={settings.theme}>
      {/* 自定义标题栏 (仅 Windows) */}
      {platform === 'win32' && (
        <div className="titlebar">
          <div className="titlebar-title">
            <svg className="titlebar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span>DeepSeek Harness</span>
          </div>
          <div className="titlebar-controls">
            <button className="titlebar-btn" onClick={handleMinimize}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button className="titlebar-btn maximize" onClick={handleMaximize}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              </svg>
            </button>
            <button className="titlebar-btn close" onClick={handleClose}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 主框架 */}
      <AppFrame>
        <ChatView />
      </AppFrame>
    </div>
  )
}

export default App
