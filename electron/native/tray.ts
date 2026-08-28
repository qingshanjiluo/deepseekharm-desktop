import { Tray, Menu, nativeImage, app, BrowserWindow } from 'electron'
import { join } from 'path'

/**
 * 系统托盘管理器
 * 负责创建和管理系统托盘图标
 */
export class TrayManager {
  private tray: Tray | null = null
  private mainWindow: BrowserWindow | null = null

  initialize(mainWindow: BrowserWindow): void {
    this.mainWindow = mainWindow

    // 创建托盘图标
    const iconPath = join(__dirname, '../../resources/tray-icon.png')
    let icon: nativeImage

    try {
      icon = nativeImage.createFromPath(iconPath)
      if (icon.isEmpty()) {
        // 如果图标为空，创建一个简单的占位图标
        icon = this.createPlaceholderIcon()
      }
    } catch {
      icon = this.createPlaceholderIcon()
    }

    this.tray = new Tray(icon)
    this.tray.setToolTip('DeepSeek Harness')

    // 创建右键菜单
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示主窗口',
        click: () => {
          this.mainWindow?.show()
          this.mainWindow?.focus()
        },
      },
      { type: 'separator' },
      {
        label: '新建会话',
        click: () => {
          this.mainWindow?.webContents.send('menu:new-session')
        },
      },
      {
        label: '打开设置',
        click: () => {
          this.mainWindow?.webContents.send('menu:open-settings')
        },
      },
      { type: 'separator' },
      {
        label: '检查更新',
        click: () => {
          this.mainWindow?.webContents.send('menu:check-update')
        },
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => {
          global.appQuitting = true
          app.quit()
        },
      },
    ])

    this.tray.setContextMenu(contextMenu)

    // 双击托盘图标显示主窗口
    this.tray.on('double-click', () => {
      this.mainWindow?.show()
      this.mainWindow?.focus()
    })

    console.log('Tray initialized')
  }

  private createPlaceholderIcon(): nativeImage {
    // 创建一个简单的16x16图标
    const size = 16
    const image = nativeImage.createEmpty()
    
    // 在实际应用中，这里应该加载真实的图标文件
    // 目前返回一个空图标
    return image
  }

  updateBadge(text: string): void {
    if (process.platform === 'darwin') {
      app.dock.setBadge(text)
    }
  }

  destroy(): void {
    if (this.tray && !this.tray.isDestroyed()) {
      this.tray.destroy()
    }
    this.tray = null
  }
}
