import { ipcMain, BrowserWindow, dialog, app, shell } from 'electron'
import { join } from 'path'
import { readFile, writeFile, readdir, stat, access, mkdir } from 'fs/promises'
import { homedir, tmpdir } from 'os'
import { CordisRuntime } from './cordis-runtime'

/**
 * IPC处理器
 * 负责处理渲染进程和主进程之间的通信
 */
export class IPCHandler {
  private mainWindow: BrowserWindow
  private runtime: CordisRuntime

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.runtime = new CordisRuntime()
  }

  async register(): Promise<void> {
    // 初始化运行时
    await this.runtime.initialize()

    // 窗口控制
    ipcMain.handle('window:minimize', () => {
      this.mainWindow.minimize()
    })

    ipcMain.handle('window:maximize', () => {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize()
      } else {
        this.mainWindow.maximize()
      }
    })

    ipcMain.handle('window:close', () => {
      this.mainWindow.close()
    })

    ipcMain.handle('window:isMaximized', () => {
      return this.mainWindow.isMaximized()
    })

    // LLM相关
    ipcMain.handle('llm:listModels', () => {
      const llmService = this.runtime.getService<{ listModels: () => unknown[] }>('llm')
      return llmService.listModels()
    })

    ipcMain.handle('llm:setProvider', (_event, provider: string) => {
      const llmService = this.runtime.getService<{ setProvider: (p: string) => void }>('llm')
      llmService.setProvider(provider)
    })

    ipcMain.handle('llm:getConfig', () => {
      const llmService = this.runtime.getService<{ getConfig: () => unknown }>('llm')
      return llmService.getConfig()
    })

    ipcMain.handle('llm:updateConfig', (_event, config: Record<string, unknown>) => {
      const llmService = this.runtime.getService<{ updateConfig: (c: Record<string, unknown>) => void }>('llm')
      llmService.updateConfig(config)
    })

    // LLM流式响应
    ipcMain.on('llm:stream-start', async (_event, data: { rpcId: string; options: Record<string, unknown> }) => {
      const { rpcId, options } = data
      const llmService = this.runtime.getService<{ stream: (o: Record<string, unknown>) => AsyncIterable<Record<string, unknown>> }>('llm')

      try {
        const stream = llmService.stream(options)
        
        for await (const chunk of stream) {
          if (!this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('llm:stream-chunk', { rpcId, chunk })
          }
        }
        
        if (!this.mainWindow.isDestroyed()) {
          this.mainWindow.webContents.send('llm:stream-chunk', { rpcId, done: true })
        }
      } catch (error) {
        console.error('Stream error:', error)
        if (!this.mainWindow.isDestroyed()) {
          this.mainWindow.webContents.send('llm:stream-chunk', {
            rpcId,
            done: true,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    })

    ipcMain.on('llm:stream-cancel', (_event, data: { rpcId: string }) => {
      console.log('Stream cancelled:', data.rpcId)
      // TODO: 实现实际的取消逻辑
    })

    // 工具相关
    ipcMain.handle('tools:execute', async (_event, name: string, args: Record<string, unknown>) => {
      const toolsService = this.runtime.getService<{ execute: (n: string, a: Record<string, unknown>) => Promise<unknown> }>('tools')
      return toolsService.execute(name, args)
    })

    ipcMain.handle('tools:list', () => {
      const toolsService = this.runtime.getService<{ list: () => unknown[] }>('tools')
      return toolsService.list()
    })

    // 会话管理
    ipcMain.handle('sessions:create', async (_event, name?: string) => {
      const sessionsService = this.runtime.getService<{ create: (n?: string) => Promise<unknown> }>('sessions')
      return sessionsService.create(name)
    })

    ipcMain.handle('sessions:load', async (_event, id: string) => {
      const sessionsService = this.runtime.getService<{ load: (id: string) => Promise<unknown> }>('sessions')
      return sessionsService.load(id)
    })

    ipcMain.handle('sessions:save', async (_event, session: Record<string, unknown>) => {
      const sessionsService = this.runtime.getService<{ save: (s: Record<string, unknown>) => Promise<void> }>('sessions')
      return sessionsService.save(session)
    })

    ipcMain.handle('sessions:delete', async (_event, id: string) => {
      const sessionsService = this.runtime.getService<{ delete: (id: string) => Promise<void> }>('sessions')
      return sessionsService.delete(id)
    })

    ipcMain.handle('sessions:list', async () => {
      const sessionsService = this.runtime.getService<{ list: () => Promise<unknown[]> }>('sessions')
      return sessionsService.list()
    })

    // 文件系统操作
    ipcMain.handle('fs:readFile', async (_event, filePath: string) => {
      return readFile(filePath, 'utf-8')
    })

    ipcMain.handle('fs:writeFile', async (_event, filePath: string, content: string) => {
      await writeFile(filePath, content, 'utf-8')
    })

    ipcMain.handle('fs:readDir', async (_event, dirPath: string) => {
      const entries = await readdir(dirPath, { withFileTypes: true })
      return entries.map(entry => ({
        name: entry.name,
        path: join(dirPath, entry.name),
        isDirectory: entry.isDirectory(),
      }))
    })

    ipcMain.handle('fs:pickDirectory', async () => {
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openDirectory'],
      })
      return result.canceled ? null : result.filePaths[0]
    })

    ipcMain.handle('fs:pickFile', async (_event, options?: { title?: string; defaultPath?: string; filters?: Array<{ name: string; extensions: string[] }> }) => {
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openFile'],
        title: options?.title,
        defaultPath: options?.defaultPath,
        filters: options?.filters,
      })
      return result.canceled ? null : result.filePaths[0]
    })

    ipcMain.handle('fs:exists', async (_event, filePath: string) => {
      try {
        await access(filePath)
        return true
      } catch {
        return false
      }
    })

    ipcMain.handle('fs:stat', async (_event, filePath: string) => {
      const fileStat = await stat(filePath)
      return {
        size: fileStat.size,
        isFile: fileStat.isFile(),
        isDirectory: fileStat.isDirectory(),
        createdAt: fileStat.birthtime,
        modifiedAt: fileStat.mtime,
      }
    })

    // 系统信息
    ipcMain.handle('system:getPlatform', () => {
      return process.platform
    })

    ipcMain.handle('system:getVersion', () => {
      return app.getVersion()
    })

    ipcMain.handle('system:getHomeDir', () => {
      return homedir()
    })

    ipcMain.handle('system:getTempDir', () => {
      return tmpdir()
    })

    // 外部链接
    ipcMain.handle('shell:openExternal', async (_event, url: string) => {
      await shell.openExternal(url)
    })

    ipcMain.handle('shell:showItemInFolder', async (_event, fullPath: string) => {
      shell.showItemInFolder(fullPath)
    })

    console.log('IPC handlers registered')
  }

  dispose(): void {
    this.runtime.dispose()
    ipcMain.removeAllListeners()
  }
}
