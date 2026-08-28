import electron from 'electron'
const { session, app } = electron

/**
 * 安全管理器
 * 负责配置应用的安全策略
 */
export class SecurityManager {
  configure(): void {
    // 禁用Node集成（双重保险）
    app.commandLine.appendSwitch('--disable-node-integration')
    
    // 启用沙箱
    app.commandLine.appendSwitch('--enable-sandbox')
    
    // 配置内容安全策略
    this.configureCSP()
    
    // 配置权限请求处理
    this.configurePermissions()
    
    // 配置窗口创建处理
    this.configureWindowCreation()
    
    console.log('Security manager configured')
  }

  private configureCSP(): void {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self' data:; " +
            "connect-src 'self' https: wss:; " +
            "frame-src 'none'; " +
            "object-src 'none'; " +
            "base-uri 'self'; " +
            "form-action 'self';"
          ],
          'X-Content-Type-Options': ['nosniff'],
          'X-Frame-Options': ['DENY'],
          'X-XSS-Protection': ['1; mode=block'],
          'Referrer-Policy': ['strict-origin-when-cross-origin'],
        }
      })
    })
  }

  private configurePermissions(): void {
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      // 允许的权限列表
      const allowedPermissions = [
        'notifications',
        'clipboard-read',
        'clipboard-sanitized-write',
      ]

      // 检查是否是主窗口
      const isMainWindow = webContents === this.getMainWindowContents()
      
      if (isMainWindow && allowedPermissions.includes(permission)) {
        callback(true)
      } else {
        console.warn(`Permission denied: ${permission}`)
        callback(false)
      }
    })

    // 设置权限检查处理器
    session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
      const isMainWindow = webContents === this.getMainWindowContents()
      return isMainWindow
    })
  }

  private configureWindowCreation(): void {
    app.on('web-contents-created', (event, contents) => {
      // 禁止创建新窗口
      contents.setWindowOpenHandler(() => {
        return { action: 'deny' }
      })

      // 监听导航事件
      contents.on('will-navigate', (event, url) => {
        // 只允许在同一个origin内导航
        const currentURL = contents.getURL()
        const currentOrigin = new URL(currentURL).origin
        const targetOrigin = new URL(url).origin

        if (currentOrigin !== targetOrigin) {
          event.preventDefault()
          console.warn(`Navigation blocked: ${url}`)
        }
      })

      // 监听will-redirect事件
      contents.on('will-redirect', (event, url) => {
        const currentURL = contents.getURL()
        const currentOrigin = new URL(currentURL).origin
        const targetOrigin = new URL(url).origin

        if (currentOrigin !== targetOrigin) {
          event.preventDefault()
          console.warn(`Redirect blocked: ${url}`)
        }
      })
    })
  }

  private getMainWindowContents(): Electron.WebContents | null {
    // 获取主窗口的webContents
    const { BrowserWindow } = require('electron')
    const windows = BrowserWindow.getAllWindows()
    const mainWindow = windows.find((w: BrowserWindow) => !w.isDestroyed())
    return mainWindow?.webContents || null
  }
}
