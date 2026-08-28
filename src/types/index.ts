// 消息类型
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  metadata?: Record<string, unknown>
}

// 会话类型
export interface Session {
  id: string
  name: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  model?: string
  systemPrompt?: string
}

// LLM配置
export interface LLMConfig {
  provider: 'deepseek' | 'openai' | 'anthropic'
  model: string
  temperature?: number
  maxTokens?: number
  apiKey?: string
  baseUrl?: string
}

// 工具类型
export interface Tool {
  name: string
  description: string
  parameters: Record<string, unknown>
  execute: (params: Record<string, unknown>) => Promise<unknown>
}

// 工具执行结果
export interface ToolResult {
  success: boolean
  output?: string
  error?: string
}

// 文件信息
export interface FileInfo {
  name: string
  path: string
  size: number
  isDirectory: boolean
  createdAt: number
  updatedAt: number
}

// 应用配置
export interface AppConfig {
  theme: 'dark' | 'light'
  language: string
  autoSave: boolean
  autoUpdate: boolean
}

// 窗口状态
export interface WindowState {
  width: number
  height: number
  x?: number
  y?: number
  isMaximized: boolean
  isMinimized: boolean
}

// 更新信息
export interface UpdateInfo {
  version: string
  releaseDate: string
  releaseNotes?: string
}

// 更新进度
export interface UpdateProgress {
  percent: number
  transferred: number
  total: number
}

// 通知类型
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: number
  read: boolean
}

// API响应类型
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// LLM流式响应事件
export interface LLMStreamEvent {
  type: 'start' | 'delta' | 'end' | 'error'
  content?: string
  error?: string
  metadata?: Record<string, unknown>
}

// IPC事件类型
export type IPCEvent = 
  | 'update-available'
  | 'update-downloaded'
  | 'update-progress'
  | 'notification'

// IPC事件处理函数
export type IPCEventHandler<T = unknown> = (data: T) => void

// 组件Props类型
export interface ComponentProps {
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

// 按钮变体
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

// 按钮大小
export type ButtonSize = 'small' | 'medium' | 'large'

// 主题颜色
export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  error: string
  warning: string
  success: string
}
