import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 会话类型
export interface Session {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  model: string
  messages: Message[]
}

// 消息类型
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  // 工具调用相关
  toolCalls?: ToolCall[]
  // 推理过程（Think/Reasoning）
  reasoning?: string
  // Token 统计
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// 工具调用
export interface ToolCall {
  id: string
  name: string
  arguments: string
  result?: string
}

// 设置
export interface Settings {
  // 模型设置
  provider: string
  model: string
  apiKey: string
  apiEndpoint: string
  // 界面设置
  sidebarWidth: number
  detailsWidth: number
  sidebarCollapsed: boolean
  detailsCollapsed: boolean
  theme: 'dark' | 'light' | 'system'
  locale: 'zh-CN' | 'en-US' | 'ja-JP'
  fontSize: number
  // 行为设置
  enterToSend: boolean
  streamingEnabled: boolean
  showTokenCount: boolean
  compactMode: boolean
  autoSave: boolean
  sandboxMode: boolean
}

// Store 状态
interface AppState {
  // 会话
  sessions: Session[]
  currentSessionId: string | null
  // 设置
  settings: Settings
  // UI 状态
  isStreaming: boolean
  currentModel: string
  
  // 会话操作
  createSession: (name?: string) => Session
  deleteSession: (id: string) => void
  updateSession: (id: string, updates: Partial<Session>) => void
  setCurrentSession: (id: string) => void
  getCurrentSession: () => Session | null
  
  // 消息操作
  addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => Message
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void
  deleteMessage: (sessionId: string, messageId: string) => void
  
  // 设置操作
  updateSettings: (updates: Partial<Settings>) => void
  
  // UI 操作
  setStreaming: (streaming: boolean) => void
  setModel: (model: string) => void
}

// 生成唯一 ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36)

// 默认设置
const defaultSettings: Settings = {
  provider: 'deepseek',
  model: 'deepseek-chat',
  apiKey: '',
  apiEndpoint: '',
  sidebarWidth: 260,
  detailsWidth: 300,
  sidebarCollapsed: false,
  detailsCollapsed: true,
  theme: 'dark',
  locale: 'zh-CN',
  fontSize: 14,
  enterToSend: true,
  streamingEnabled: true,
  showTokenCount: true,
  compactMode: false,
  autoSave: true,
  sandboxMode: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      sessions: [],
      currentSessionId: null,
      settings: defaultSettings,
      isStreaming: false,
      currentModel: 'deepseek-chat',
      
      // 会话操作
      createSession: (name?: string) => {
        const session: Session = {
          id: generateId(),
          name: name || `新会话 ${new Date().toLocaleString('zh-CN')}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model: get().currentModel,
          messages: [],
        }
        set(state => ({
          sessions: [session, ...state.sessions],
          currentSessionId: session.id,
        }))
        return session
      },
      
      deleteSession: (id: string) => {
        set(state => {
          const sessions = state.sessions.filter(s => s.id !== id)
          const currentSessionId = state.currentSessionId === id
            ? (sessions[0]?.id || null)
            : state.currentSessionId
          return { sessions, currentSessionId }
        })
      },
      
      updateSession: (id: string, updates: Partial<Session>) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
          ),
        }))
      },
      
      setCurrentSession: (id: string) => {
        set({ currentSessionId: id })
      },
      
      getCurrentSession: () => {
        const { sessions, currentSessionId } = get()
        return sessions.find(s => s.id === currentSessionId) || null
      },
      
      // 消息操作
      addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: Date.now(),
        }
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, newMessage], updatedAt: Date.now() }
              : s
          ),
        }))
        return newMessage
      },
      
      updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.map(m =>
                    m.id === messageId ? { ...m, ...updates } : m
                  ),
                  updatedAt: Date.now(),
                }
              : s
          ),
        }))
      },
      
      deleteMessage: (sessionId: string, messageId: string) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.filter(m => m.id !== messageId),
                  updatedAt: Date.now(),
                }
              : s
          ),
        }))
      },
      
      // 设置操作
      updateSettings: (updates: Partial<Settings>) => {
        set(state => ({
          settings: { ...state.settings, ...updates },
        }))
      },
      
      // UI 操作
      setStreaming: (streaming: boolean) => {
        set({ isStreaming: streaming })
      },
      
      setModel: (model: string) => {
        set({ currentModel: model })
      },
    }),
    {
      name: 'deepseek-harness-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
        settings: state.settings,
      }),
    }
  )
)
