import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 自定义API类型定义
interface DeepSeekAPI {
  // 窗口控制
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
    isMaximized: () => Promise<boolean>
  }

  // LLM相关
  llm: {
    stream: (options: StreamOptions) => AsyncIterable<StreamChunk>
    listModels: () => Promise<ModelInfo[]>
    setProvider: (provider: string) => Promise<void>
    getConfig: () => Promise<LlmConfig>
    updateConfig: (config: Partial<LlmConfig>) => Promise<void>
  }

  // 工具相关
  tools: {
    execute: (name: string, args: Record<string, unknown>) => Promise<ToolResult>
    list: () => Promise<ToolInfo[]>
  }

  // 会话管理
  sessions: {
    create: (name?: string) => Promise<SessionInfo>
    load: (id: string) => Promise<SessionData>
    save: (session: SessionData) => Promise<void>
    delete: (id: string) => Promise<void>
    list: () => Promise<SessionInfo[]>
  }

  // 文件系统
  fs: {
    readFile: (path: string) => Promise<string>
    writeFile: (path: string, content: string) => Promise<void>
    readDir: (path: string) => Promise<DirEntry[]>
    pickDirectory: () => Promise<string | null>
    pickFile: (options?: FileDialogOptions) => Promise<string | null>
    exists: (path: string) => Promise<boolean>
    stat: (path: string) => Promise<FileStat>
  }

  // 系统信息
  system: {
    getPlatform: () => Promise<string>
    getVersion: () => Promise<string>
    getHomeDir: () => Promise<string>
    getTempDir: () => Promise<string>
  }

  // 事件监听
  on: {
    updateAvailable: (callback: (info: UpdateInfo) => void) => () => void
    updateDownloaded: (callback: (info: UpdateInfo) => void) => () => void
    updateProgress: (callback: (progress: UpdateProgress) => void) => () => void
    notification: (callback: (data: NotificationData) => void) => () => void
  }
}

// 事件监听封装
function onEvent(channel: string, callback: (...args: unknown[]) => void): () => void {
  const handler = (_event: IpcRendererEvent, ...args: unknown[]): void => callback(...args)
  ipcRenderer.on(channel, handler)
  return () => {
    ipcRenderer.removeListener(channel, handler)
  }
}

// 暴露API到渲染进程
const deepSeekAPI: DeepSeekAPI = {
  // 窗口控制
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  },

  // LLM相关
  llm: {
    stream: (options: StreamOptions) => {
      const rpcId = crypto.randomUUID()
      ipcRenderer.send('llm:stream-start', { rpcId, options })

      return {
        [Symbol.asyncIterator]: () => {
          const chunks: StreamChunk[] = []
          let resolve: ((value: IteratorResult<StreamChunk>) => void) | null = null
          let done = false

          const unsubscribe = onEvent('llm:stream-chunk', (data: { rpcId: string; chunk?: StreamChunk; done?: boolean }) => {
            if (data.rpcId === rpcId) {
              if (data.done) {
                done = true
                unsubscribe()
              } else if (data.chunk) {
                chunks.push(data.chunk)
              }
              if (resolve) {
                const r = resolve
                resolve = null
                r({ value: chunks.shift()!, done: done && chunks.length === 0 })
              }
            }
          })

          return {
            next: () => {
              if (chunks.length > 0) {
                return Promise.resolve({ value: chunks.shift()!, done: false })
              }
              if (done) {
                return Promise.resolve({ value: undefined as unknown as StreamChunk, done: true })
              }
              return new Promise<IteratorResult<StreamChunk>>((r) => {
                resolve = r
              })
            },
            return: () => {
              unsubscribe()
              ipcRenderer.send('llm:stream-cancel', { rpcId })
              return Promise.resolve({ value: undefined as unknown as StreamChunk, done: true })
            },
          }
        },
      }
    },
    listModels: () => ipcRenderer.invoke('llm:listModels'),
    setProvider: (provider: string) => ipcRenderer.invoke('llm:setProvider', provider),
    getConfig: () => ipcRenderer.invoke('llm:getConfig'),
    updateConfig: (config: Partial<LlmConfig>) => ipcRenderer.invoke('llm:updateConfig', config),
  },

  // 工具相关
  tools: {
    execute: (name: string, args: Record<string, unknown>) => ipcRenderer.invoke('tools:execute', name, args),
    list: () => ipcRenderer.invoke('tools:list'),
  },

  // 会话管理
  sessions: {
    create: (name?: string) => ipcRenderer.invoke('sessions:create', name),
    load: (id: string) => ipcRenderer.invoke('sessions:load', id),
    save: (session: SessionData) => ipcRenderer.invoke('sessions:save', session),
    delete: (id: string) => ipcRenderer.invoke('sessions:delete', id),
    list: () => ipcRenderer.invoke('sessions:list'),
  },

  // 文件系统
  fs: {
    readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path),
    writeFile: (path: string, content: string) => ipcRenderer.invoke('fs:writeFile', path, content),
    readDir: (path: string) => ipcRenderer.invoke('fs:readDir', path),
    mkdir: (path: string, options?: { recursive?: boolean }) => ipcRenderer.invoke('fs:mkdir', path, options),
    unlink: (path: string) => ipcRenderer.invoke('fs:unlink', path),
    pickDirectory: () => ipcRenderer.invoke('fs:pickDirectory'),
    pickFile: (options?: FileDialogOptions) => ipcRenderer.invoke('fs:pickFile', options),
    exists: (path: string) => ipcRenderer.invoke('fs:exists', path),
    stat: (path: string) => ipcRenderer.invoke('fs:stat', path),
  },

  // 对话框
  dialog: {
    save: (options?: SaveDialogOptions) => ipcRenderer.invoke('dialog:save', options),
    open: (options?: OpenDialogOptions) => ipcRenderer.invoke('dialog:open', options),
  },

  // MCP
  mcp: {
    connect: (serverId: string) => ipcRenderer.invoke('mcp:connect', serverId),
    disconnect: (serverId: string) => ipcRenderer.invoke('mcp:disconnect', serverId),
    executeTool: (serverId: string, toolName: string, args: Record<string, unknown>) => 
      ipcRenderer.invoke('mcp:executeTool', serverId, toolName, args),
  },

  // 系统信息
  system: {
    getPlatform: () => ipcRenderer.invoke('system:getPlatform'),
    getVersion: () => ipcRenderer.invoke('system:getVersion'),
    getHomeDir: () => ipcRenderer.invoke('system:getHomeDir'),
    getTempDir: () => ipcRenderer.invoke('system:getTempDir'),
  },

  // 事件监听
  on: {
    updateAvailable: (callback: (info: UpdateInfo) => void) => onEvent('event:update-available', callback as (...args: unknown[]) => void),
    updateDownloaded: (callback: (info: UpdateInfo) => void) => onEvent('event:update-downloaded', callback as (...args: unknown[]) => void),
    updateProgress: (callback: (progress: UpdateProgress) => void) => onEvent('event:update-progress', callback as (...args: unknown[]) => void),
    notification: (callback: (data: NotificationData) => void) => onEvent('event:notification', callback as (...args: unknown[]) => void),
  },
}

// 如果启用了远程模块，也暴露它
if (process.env.ELECTRON_RENDERER_REMOTE) {
  contextBridge.exposeInMainWorld('electronRemote', electronAPI)
}

// 暴露主API
contextBridge.exposeInMainWorld('deepSeek', deepSeekAPI)

// 导出类型
export type { DeepSeekAPI, StreamOptions, StreamChunk, ModelInfo, LlmConfig, ToolResult, ToolInfo, SessionInfo, SessionData, DirEntry, FileDialogOptions, FileStat, UpdateInfo, UpdateProgress, NotificationData, SaveDialogOptions, OpenDialogOptions }

// 类型定义
interface StreamOptions {
  provider: string
  model: string
  messages: Array<{ role: string; content: string }>
  system?: string
  tools?: Array<{ name: string; description: string; parameters: unknown }>
  temperature?: number
  maxTokens?: number
  signal?: AbortSignal
}

interface StreamChunk {
  type: 'text-delta' | 'reasoning-delta' | 'tool-call-delta' | 'block-end' | 'usage' | 'finish'
  delta?: string
  toolCall?: { id: string; name: string; arguments: string }
  usage?: { inputTokens: number; outputTokens: number }
  finishReason?: string
}

interface ModelInfo {
  id: string
  name: string
  provider: string
  maxTokens: number
}

interface LlmConfig {
  provider: string
  apiKey?: string
  baseUrl?: string
  model: string
}

interface ToolResult {
  success: boolean
  output?: unknown
  error?: string
}

interface ToolInfo {
  name: string
  description: string
  parameters: unknown
}

interface SessionInfo {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface SessionData {
  id: string
  name: string
  messages: Array<{ role: string; content: string; timestamp: string }>
  createdAt: string
  updatedAt: string
}

interface DirEntry {
  name: string
  path: string
  isDirectory: boolean
}

interface FileDialogOptions {
  title?: string
  defaultPath?: string
  filters?: Array<{ name: string; extensions: string[] }>
}

interface FileStat {
  size: number
  isFile: boolean
  isDirectory: boolean
  createdAt: Date
  modifiedAt: Date
}

interface UpdateInfo {
  version: string
  releaseDate: string
  releaseNotes?: string
}

interface UpdateProgress {
  percent: number
  bytesPerSecond: number
  total: number
  transferred: number
}

interface NotificationData {
  title: string
  body: string
  icon?: string
  onclick?: string
}

interface SaveDialogOptions {
  title?: string
  defaultPath?: string
  filters?: Array<{ name: string; extensions: string[] }>
}

interface OpenDialogOptions {
  title?: string
  defaultPath?: string
  filters?: Array<{ name: string; extensions: string[] }>
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections'>
}
