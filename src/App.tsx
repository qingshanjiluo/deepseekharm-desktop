import { useState, useEffect } from 'react'
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
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentModel, setCurrentModel] = useState('deepseek-chat')
  const [models, setModels] = useState<any[]>([])
  const [platform, setPlatform] = useState('')

  useEffect(() => {
    // 获取系统信息
    if (window.deepSeek) {
      window.deepSeek.system.getPlatform().then(setPlatform)
      window.deepSeek.llm.listModels().then(setModels)
    }
  }, [])

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming) return

    const userMessage = { role: 'user', content: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsStreaming(true)

    // 添加助手消息占位符
    const assistantMessage = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMessage])

    try {
      if (window.deepSeek) {
        const stream = window.deepSeek.llm.stream({
          provider: 'deepseek',
          model: currentModel,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        })

        let content = ''
        for await (const chunk of stream) {
          if (chunk.type === 'text-delta' && chunk.delta) {
            content += chunk.delta
            setMessages(prev => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content,
              }
              return newMessages
            })
          }
        }
      } else {
        // 模拟响应
        await new Promise(resolve => setTimeout(resolve, 1000))
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: '这是一个模拟响应。请在Electron环境中运行以获得完整功能。',
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error('Stream error:', error)
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: `错误: ${error instanceof Error ? error.message : '未知错误'}`,
        }
        return newMessages
      })
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>DeepSeek Harness</h1>
          <span className="version">v1.0.0</span>
        </div>
        <div className="sidebar-content">
          <div className="section">
            <h3>会话</h3>
            <button className="new-session-btn">新建会话</button>
          </div>
          <div className="section">
            <h3>模型</h3>
            <select 
              value={currentModel} 
              onChange={(e) => setCurrentModel(e.target.value)}
              className="model-select"
            >
              <option value="deepseek-chat">DeepSeek Chat</option>
              <option value="deepseek-coder">DeepSeek Coder</option>
              <option value="deepseek-reasoner">DeepSeek Reasoner</option>
            </select>
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="system-info">
            <span>平台: {platform || '未知'}</span>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <h2>欢迎使用 DeepSeek Harness</h2>
              <p>开始一个新的对话</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role}`}
              >
                <div className="message-avatar">
                  {message.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className="message-content">
                  {message.content}
                  {isStreaming && index === messages.length - 1 && message.role === 'assistant' && (
                    <span className="cursor">|</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
              disabled={isStreaming}
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isStreaming}
              className="send-button"
            >
              {isStreaming ? '发送中...' : '发送'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
