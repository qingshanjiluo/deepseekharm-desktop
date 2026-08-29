import electron from 'electron'
const { BrowserWindow, dialog } = electron

/**
 * 自动更新管理器
 * 负责检查和应用应用更新
 * 注意: electron-updater 仅在 devDependencies 中，便携版不包含自动更新
 */
export class AutoUpdater {
  private mainWindow: BrowserWindow | null = null
  private updateDownloaded = false
  private updaterAvailable = false
  private autoUpdater: any = null

  async initialize(mainWindow: BrowserWindow): Promise<void> {
    this.mainWindow = mainWindow

    try {
      const electronUpdater = await import('electron-updater')
      this.autoUpdater = electronUpdater.autoUpdater
      this.updaterAvailable = true

      // 配置自动更新
      this.autoUpdater.autoDownload = false
      this.autoUpdater.autoInstallOnAppQuit = true

      // 监听更新事件
      this.autoUpdater.on('checking-for-update', () => {
        console.log('Checking for update...')
      })

      this.autoUpdater.on('update-available', (info: any) => {
        console.log('Update available:', info.version)
        this.mainWindow?.webContents.send('event:update-available', info)

        dialog.showMessageBox(this.mainWindow!, {
          type: 'info',
          title: '发现新版本',
          message: `新版本 ${info.version} 已可用`,
          buttons: ['下载', '稍后'],
        }).then(({ response }) => {
          if (response === 0) {
            this.autoUpdater.downloadUpdate()
          }
        })
      })

      this.autoUpdater.on('update-not-available', () => {
        console.log('No update available')
      })

      this.autoUpdater.on('download-progress', (progress: any) => {
        console.log(`Download progress: ${progress.percent}%`)
        this.mainWindow?.webContents.send('event:update-progress', progress)
      })

      this.autoUpdater.on('update-downloaded', (info: any) => {
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
            this.autoUpdater.quitAndInstall()
          }
        })
      })

      this.autoUpdater.on('error', (error: any) => {
        console.error('Update error:', error)
      })

      console.log('Auto-updater initialized')
    } catch (err) {
      console.warn('electron-updater not available (portable mode):', (err as Error).message)
      this.updaterAvailable = false
    }
  }

  async checkForUpdates(): Promise<any | null> {
    if (!this.updaterAvailable || !this.autoUpdater) return null
    try {
      const result = await this.autoUpdater.checkForUpdates()
      return result?.updateInfo || null
    } catch (error) {
      console.error('Failed to check for updates:', error)
      return null
    }
  }

  downloadUpdate(): void {
    this.autoUpdater?.downloadUpdate()
  }

  quitAndInstall(): void {
    this.autoUpdater?.quitAndInstall()
  }

  isUpdateDownloaded(): boolean {
    return this.updateDownloaded
  }
}
