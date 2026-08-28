import { create } from 'zustand'

// 会话消息类型
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

// 会话类型
interface Session {
  id: string
  name: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

// 应用状态类型
interface AppState {
  // 当前会话
  currentSession: Session | null
  sessions: Session[]
  
  // LLM状态
  isStreaming: boolean
  currentModel: string
  
  // UI状态
  sidebarOpen: boolean
  theme: 'dark' | 'light'
  
  // 操作
  setCurrentSession: (session: Session | null) => void
  addMessage: (message: Message) => void
  setStreaming: (streaming: boolean) => void
  setCurrentModel: (model: string) => void
  toggleSidebar: () => void
  setTheme: (theme: 'dark' | 'light') => void
  createSession: (name?: string) => void
  deleteSession: (id: string) => void
}

// 生成唯一ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 创建默认会话
const createDefaultSession = (name?: string): Session => ({
  id: generateId(),
  name: name || `会话 ${new Date().toLocaleString('zh-CN')}`,
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now()
})

// 创建状态管理
export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  currentSession: null,
  sessions: [],
  isStreaming: false,
  currentModel: 'deepseek-chat',
  sidebarOpen: true,
  theme: 'dark',
  
  // 操作
  setCurrentSession: (session) => set({ currentSession: session }),
  
  addMessage: (message) => {
    const { currentSession } = get()
    if (!currentSession) return
    
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, message],
      updatedAt: Date.now()
    }
    
    set({ currentSession: updatedSession })
  },
  
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  
  setCurrentModel: (model) => set({ currentModel: model }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setTheme: (theme) => set({ theme }),
  
  createSession: (name) => {
    const newSession = createDefaultSession(name)
    set((state) => ({
      sessions: [...state.sessions, newSession],
      currentSession: newSession
    }))
  },
  
  deleteSession: (id) => {
    set((state) => {
      const filteredSessions = state.sessions.filter(s => s.id !== id)
      const currentSession = state.currentSession?.id === id 
        ? (filteredSessions[0] || null)
        : state.currentSession
      
      return {
        sessions: filteredSessions,
        currentSession
      }
    })
  }
}))

export default useAppStore
