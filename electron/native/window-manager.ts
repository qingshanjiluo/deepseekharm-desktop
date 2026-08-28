import { BrowserWindow, screen } from 'electron'
import { join } from 'path'

/**
 * 窗口管理器
 * 负责创建和管理应用窗口
 */
export class WindowManager {
  private mainWindow: BrowserWindow | null = null
  private aboutWindow: BrowserWindow | null = null

  createMainWindow(): BrowserWindow {
    // 获取主屏幕尺寸
    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    this.mainWindow = new BrowserWindow({
      width: Math.min(1400, width),
      height: Math.min(900, height),
      minWidth: 800,
      minHeight: 600,
      title: 'DeepSeek Harness',
      icon: join(__dirname, '../../resources/icon.ico'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        preload: join(__dirname, '../preload.js'),
      },
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#1e1e1e',
        symbolColor: '#ffffff',
        height: 36,
      },
      backgroundColor: '#1e1e1e',
      show: false,
    })

    // 加载应用
    if (process.env.ELECTRON_RENDERER_URL) {
      this.mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    // 窗口准备好后显示
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
    })

    // 窗口关闭时隐藏到托盘
    this.mainWindow.on('close', (event) => {
      if (!global.appQuitting) {
        event.preventDefault()
        this.mainWindow?.hide()
      }
    })

    // 窗口最大化/取消最大化时通知渲染进程
    this.mainWindow.on('maximize', () => {
      this.mainWindow?.webContents.send('window:maximized-changed', true)
    })

    this.mainWindow.on('unmaximize', () => {
      this.mainWindow?.webContents.send('window:maximized-changed', false)
    })

    return this.mainWindow
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }

  createAboutWindow(): BrowserWindow {
    if (this.aboutWindow) {
      this.aboutWindow.focus()
      return this.aboutWindow
    }

    this.aboutWindow = new BrowserWindow({
      width: 400,
      height: 300,
      parent: this.mainWindow!,
      modal: true,
      resizable: false,
      title: '关于 DeepSeek Harness',
      icon: join(__dirname, '../../resources/icon.ico'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        preload: join(__dirname, '../preload.js'),
      },
      backgroundColor: '#1e1e1e',
    })

    this.aboutWindow.on('closed', () => {
      this.aboutWindow = null
    })

    return this.aboutWindow
  }

  createSettingsWindow(): BrowserWindow {
    const settingsWindow = new BrowserWindow({
      width: 600,
      height: 500,
      parent: this.mainWindow!,
      modal: true,
      resizable: false,
      title: '设置',
      icon: join(__dirname, '../../resources/icon.ico'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        preload: join(__dirname, '../preload.js'),
      },
      backgroundColor: '#1e1e1e',
    })

    return settingsWindow
  }

  destroyAll(): void {
    if (this.aboutWindow && !this.aboutWindow.isDestroyed()) {
      this.aboutWindow.close()
    }
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.close()
    }
  }
}
