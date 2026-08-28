import electron from 'electron'
const { Tray, Menu, nativeImage, app, BrowserWindow } = electron
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
    const size = 16
    // 创建一个 16x16 的绿色圆形托盘图标
    const data = Buffer.alloc(size * size * 4)
    const center = size / 2
    const radius = 6

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center
        const dy = y - center
        const dist = Math.sqrt(dx * dx + dy * dy)
        const idx = (y * size + x) * 4
        if (dist <= radius) {
          data[idx] = 34      // R
          data[idx + 1] = 197 // G
          data[idx + 2] = 94  // B
          data[idx + 3] = 255 // A
        } else if (dist <= radius + 1) {
          // 抗锯齿边缘
          const alpha = Math.max(0, 255 - (dist - radius) * 255)
          data[idx] = 34
          data[idx + 1] = 197
          data[idx + 2] = 94
          data[idx + 3] = alpha
        } else {
          data[idx + 3] = 0
        }
      }
    }

    return nativeImage.createFromBuffer(data, { width: size, height: size })
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
