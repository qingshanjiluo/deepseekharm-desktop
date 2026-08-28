import { app, BrowserWindow, session } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { join } from 'path'
import { IPCHandler } from './backend/ipc-handler'
import { WindowManager } from './native/window-manager'
import { TrayManager } from './native/tray'
import { AutoUpdater } from './native/auto-updater'
import { SecurityManager } from './security'

// 全局变量控制退出行为
declare global {
  var appQuitting: boolean
}
global.appQuitting = false

class DeepSeekHarnessDesktop {
  private windowManager: WindowManager
  private trayManager: TrayManager
  private autoUpdater: AutoUpdater
  private securityManager: SecurityManager
  private ipcHandler: IPCHandler | null = null

  constructor() {
    this.windowManager = new WindowManager()
    this.trayManager = new TrayManager()
    this.autoUpdater = new AutoUpdater()
    this.securityManager = new SecurityManager()
  }

  async initialize(): Promise<void> {
    // 等待应用准备就绪
    await app.whenReady()

    // 设置应用用户模型ID (Windows任务栏图标)
    electronApp.setAppUserModelId('com.deepseek.harness.desktop')

    // 配置安全策略
    this.securityManager.configure()

    // 默认打开或关闭开发者工具
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // 创建主窗口
    const mainWindow = this.windowManager.createMainWindow()

    // 初始化IPC处理器
    this.ipcHandler = new IPCHandler(mainWindow)
    this.ipcHandler.register()

    // 初始化托盘
    this.trayManager.initialize(mainWindow)

    // 初始化自动更新
    this.autoUpdater.initialize(mainWindow)

    // 配置CSP
    this.configureCSP()

    // macOS: 点击图标时重新创建窗口
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.windowManager.createMainWindow()
      }
    })

    // 所有窗口关闭时退出应用 (Windows/Linux)
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    // 应用退出前清理
    app.on('before-quit', () => {
      global.appQuitting = true
      this.trayManager.destroy()
    })

    console.log('DeepSeek Harness Desktop initialized')
  }

  private configureCSP(): void {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss:; frame-src 'none'; object-src 'none';"
          ]
        }
      })
    })
  }
}

// 启动应用
const app = new DeepSeekHarnessDesktop()
app.initialize().catch(console.error)
