/**
 * MCP (Model Context Protocol) 服务器管理
 * 支持配置、连接、工具列表、权限控制
 */

export interface McpServer {
  id: string
  name: string
  description: string
  transport: 'stdio' | 'sse' | 'streamable-http'
  command?: string
  args?: string[]
  env?: Record<string, string>
  url?: string
  enabled: boolean
  autoStart: boolean
  lastConnected?: number
  status: 'disconnected' | 'connecting' | 'connected' | 'error'
  error?: string
}

export interface McpTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  serverId: string
}

export interface McpResource {
  uri: string
  name: string
  description?: string
  mimeType?: string
  serverId: string
}

export interface McpPrompt {
  name: string
  description?: string
  arguments?: Array<{
    name: string
    description?: string
    required?: boolean
  }>
  serverId: string
}

/**
 * MCP 服务器管理服务
 */
export class McpService {
  private servers: Map<string, McpServer> = new Map()
  private tools: Map<string, McpTool> = new Map()
  private resources: Map<string, McpResource> = new Map()
  private prompts: Map<string, McpPrompt> = new Map()
  private storageKey = 'deepseek-mcp-servers'

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey)
      if (data) {
        const parsed = JSON.parse(data)
        parsed.forEach((server: McpServer) => {
          this.servers.set(server.id, { ...server, status: 'disconnected' })
        })
      }
    } catch (error) {
      console.error('Failed to load MCP servers:', error)
    }
  }

  private saveToStorage(): void {
    try {
      const servers = Array.from(this.servers.values()).map(s => ({
        ...s,
        status: 'disconnected' as const,
        error: undefined,
      }))
      localStorage.setItem(this.storageKey, JSON.stringify(servers))
    } catch (error) {
      console.error('Failed to save MCP servers:', error)
    }
  }

  /**
   * 添加服务器
   */
  addServer(server: Omit<McpServer, 'id' | 'status'>): McpServer {
    const newServer: McpServer = {
      ...server,
      id: `mcp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: 'disconnected',
    }

    this.servers.set(newServer.id, newServer)
    this.saveToStorage()
    return newServer
  }

  /**
   * 更新服务器
   */
  updateServer(id: string, updates: Partial<McpServer>): void {
    const server = this.servers.get(id)
    if (server) {
      this.servers.set(id, { ...server, ...updates })
      this.saveToStorage()
    }
  }

  /**
   * 删除服务器
   */
  removeServer(id: string): void {
    this.servers.delete(id)
    // 删除关联的工具、资源、提示
    this.tools.forEach((tool, key) => {
      if (tool.serverId === id) this.tools.delete(key)
    })
    this.resources.forEach((resource, key) => {
      if (resource.serverId === id) this.resources.delete(key)
    })
    this.prompts.forEach((prompt, key) => {
      if (prompt.serverId === id) this.prompts.delete(key)
    })
    this.saveToStorage()
  }

  /**
   * 获取所有服务器
   */
  getServers(): McpServer[] {
    return Array.from(this.servers.values())
  }

  /**
   * 获取服务器
   */
  getServer(id: string): McpServer | undefined {
    return this.servers.get(id)
  }

  /**
   * 连接到服务器
   * 注意：实际连接需要 Electron 主进程通过 child_process 或 HTTP 实现
   * 这里提供接口定义，实际实现在 IPC handler 中
   */
  async connectServer(id: string): Promise<void> {
    const server = this.servers.get(id)
    if (!server) throw new Error('Server not found')

    this.updateServer(id, { status: 'connecting', error: undefined })

    try {
      // 通过 IPC 通知主进程连接
      if (window.deepSeek?.mcp?.connect) {
        await window.deepSeek.mcp.connect(id)
      }
      
      this.updateServer(id, { 
        status: 'connected', 
        lastConnected: Date.now() 
      })
    } catch (error) {
      this.updateServer(id, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Connection failed' 
      })
      throw error
    }
  }

  /**
   * 断开服务器连接
   */
  async disconnectServer(id: string): Promise<void> {
    try {
      if (window.deepSeek?.mcp?.disconnect) {
        await window.deepSeek.mcp.disconnect(id)
      }
    } finally {
      this.updateServer(id, { status: 'disconnected' })
    }
  }

  /**
   * 获取所有工具
   */
  getTools(): McpTool[] {
    return Array.from(this.tools.values())
  }

  /**
   * 获取指定服务器的工具
   */
  getServerTools(serverId: string): McpTool[] {
    return Array.from(this.tools.values()).filter(t => t.serverId === serverId)
  }

  /**
   * 执行工具
   */
  async executeTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const tool = this.tools.get(name)
    if (!tool) throw new Error(`Tool '${name}' not found`)

    if (window.deepSeek?.mcp?.executeTool) {
      return await window.deepSeek.mcp.executeTool(tool.serverId, name, args)
    }

    throw new Error('MCP not available in this environment')
  }

  /**
   * 获取所有资源
   */
  getResources(): McpResource[] {
    return Array.from(this.resources.values())
  }

  /**
   * 获取所有提示
   */
  getPrompts(): McpPrompt[] {
    return Array.from(this.prompts.values())
  }

  /**
   * 导出配置
   */
  export(): string {
    return JSON.stringify({
      servers: Array.from(this.servers.values()),
      exportedAt: Date.now(),
    }, null, 2)
  }

  /**
   * 导入配置
   */
  import(data: string): void {
    try {
      const parsed = JSON.parse(data)
      if (parsed.servers) {
        parsed.servers.forEach((server: McpServer) => {
          this.servers.set(server.id, { ...server, status: 'disconnected' })
        })
        this.saveToStorage()
      }
    } catch (error) {
      console.error('Failed to import MCP config:', error)
      throw error
    }
  }

  /**
   * 更新工具列表（从服务器同步）
   */
  updateTools(serverId: string, tools: McpTool[]): void {
    // 删除旧工具
    this.tools.forEach((tool, key) => {
      if (tool.serverId === serverId) this.tools.delete(key)
    })
    // 添加新工具
    tools.forEach(tool => {
      this.tools.set(`${tool.serverId}:${tool.name}`, tool)
    })
  }
}

// 单例
export const mcpService = new McpService()
