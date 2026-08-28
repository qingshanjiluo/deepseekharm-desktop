import { autoUpdater, UpdateInfo } from 'electron-updater'
import electron from 'electron'
const { BrowserWindow, dialog } = electron

/**
 * 自动更新管理器
 * 负责检查和应用应用更新
 */
export class AutoUpdater {
  private mainWindow: BrowserWindow | null = null
  private updateDownloaded = false

  initialize(mainWindow: BrowserWindow): void {
    this.mainWindow = mainWindow

    // 配置自动更新
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true

    // 监听更新事件
    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for update...')
    })

    autoUpdater.on('update-available', (info: UpdateInfo) => {
      console.log('Update available:', info.version)
      this.mainWindow?.webContents.send('event:update-available', info)
      
      dialog.showMessageBox(this.mainWindow!, {
        type: 'info',
        title: '发现新版本',
        message: `新版本 ${info.version} 已可用`,
        buttons: ['下载', '稍后'],
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.downloadUpdate()
        }
      })
    })

    autoUpdater.on('update-not-available', () => {
      console.log('No update available')
      dialog.showMessageBox(this.mainWindow!, {
        type: 'info',
        title: '检查更新',
        message: '当前已是最新版本',
        buttons: ['确定'],
      })
    })

    autoUpdater.on('download-progress', (progress) => {
      console.log(`Download progress: ${progress.percent}%`)
      this.mainWindow?.webContents.send('event:update-progress', progress)
    })

    autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
      console.log('Update downloaded:', info.version)
      this.updateDownloaded = true
      this.mainWindow?.webContents.send('event:update-downloaded', info)
      
      dialog.showMessageBox(this.mainWindow!, {
        type: 'info',
        title: '更新就绪',
        message: '更新已下载完成，是否立即重启安装？',
        buttons: ['立即重启', '稍后'],
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall()
        }
      })
    })

    autoUpdater.on('error', (error) => {
      console.error('Update error:', error)
      dialog.showMessageBox(this.mainWindow!, {
        type: 'error',
        title: '更新错误',
        message: `更新过程中出现错误: ${error.message}`,
        buttons: ['确定'],
      })
    })

    console.log('Auto-updater initialized')
  }

  async checkForUpdates(): Promise<UpdateInfo | null> {
    try {
      const result = await autoUpdater.checkForUpdates()
      return result?.updateInfo || null
    } catch (error) {
      console.error('Failed to check for updates:', error)
      return null
    }
  }

  downloadUpdate(): void {
    autoUpdater.downloadUpdate()
  }

  quitAndInstall(): void {
    autoUpdater.quitAndInstall()
  }

  isUpdateDownloaded(): boolean {
    return this.updateDownloaded
  }
}
