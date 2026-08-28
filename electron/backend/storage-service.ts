/**
 * 会话持久化服务
 * 使用 Electron 主进程 fs 进行本地文件存储
 * 支持导出/导入 JSON 文件
 */

import type { Session, Message } from '../store'

export interface ExportData {
  version: 1
  exportedAt: string
  sessions: Session[]
  messages: Record<string, Message[]>
}

const STORAGE_DIR = 'deepseekharness-data'
const SESSIONS_FILE = 'sessions.json'
const MESSAGES_DIR = 'messages'
const SETTINGS_FILE = 'settings.json'

/**
 * 获取存储目录路径
 */
function getStorageDir(): string {
  const home = window.electron?.process?.env?.HOME || 
               window.electron?.process?.env?.USERPROFILE || 
               '~'
  return `${home}/${STORAGE_DIR}`
}

/**
 * 确保目录存在
 */
async function ensureDir(dir: string): Promise<void> {
  try {
    await window.deepSeek?.fs?.mkdir(dir, { recursive: true })
  } catch (error) {
    // 目录已存在时忽略
  }
}

/**
 * 会话持久化服务
 */
export class StorageService {
  /**
   * 保存会话列表
   */
  async saveSessions(sessions: Session[]): Promise<void> {
    const dir = getStorageDir()
    await ensureDir(dir)
    const filePath = `${dir}/${SESSIONS_FILE}`
    const data = JSON.stringify(sessions, null, 2)
    await window.deepSeek?.fs?.writeFile(filePath, data)
  }

  /**
   * 加载会话列表
   */
  async loadSessions(): Promise<Session[]> {
    try {
      const dir = getStorageDir()
      const filePath = `${dir}/${SESSIONS_FILE}`
      const data = await window.deepSeek?.fs?.readFile(filePath)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load sessions:', error)
      return []
    }
  }

  /**
   * 保存消息
   */
  async saveMessages(sessionId: string, messages: Message[]): Promise<void> {
    const dir = `${getStorageDir()}/${MESSAGES_DIR}`
    await ensureDir(dir)
    const filePath = `${dir}/${sessionId}.json`
    const data = JSON.stringify(messages, null, 2)
    await window.deepSeek?.fs?.writeFile(filePath, data)
  }

  /**
   * 加载消息
   */
  async loadMessages(sessionId: string): Promise<Message[]> {
    try {
      const dir = `${getStorageDir()}/${MESSAGES_DIR}`
      const filePath = `${dir}/${sessionId}.json`
      const data = await window.deepSeek?.fs?.readFile(filePath)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load messages:', error)
      return []
    }
  }

  /**
   * 保存设置
   */
  async saveSettings(settings: Record<string, unknown>): Promise<void> {
    const dir = getStorageDir()
    await ensureDir(dir)
    const filePath = `${dir}/${SETTINGS_FILE}`
    const data = JSON.stringify(settings, null, 2)
    await window.deepSeek?.fs?.writeFile(filePath, data)
  }

  /**
   * 加载设置
   */
  async loadSettings(): Promise<Record<string, unknown> | null> {
    try {
      const dir = getStorageDir()
      const filePath = `${dir}/${SETTINGS_FILE}`
      const data = await window.deepSeek?.fs?.readFile(filePath)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to load settings:', error)
      return null
    }
  }

  /**
   * 删除会话
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      const dir = `${getStorageDir()}/${MESSAGES_DIR}`
      const filePath = `${dir}/${sessionId}.json`
      await window.deepSeek?.fs?.unlink(filePath)
    } catch (error) {
      // 文件不存在时忽略
    }
  }

  /**
   * 导出会话到文件
   */
  async exportSessions(
    sessionIds: string[],
    sessions: Session[],
    messageStore: Record<string, Message[]>
  ): Promise<string> {
    const exportData: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: sessions.filter(s => sessionIds.includes(s.id)),
      messages: {}
    }

    for (const id of sessionIds) {
      if (messageStore[id]) {
        exportData.messages[id] = messageStore[id]
      }
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * 导入会话
   */
  async importSessions(data: string): Promise<{
    sessions: Session[]
    messages: Record<string, Message[]>
  }> {
    const parsed = JSON.parse(data) as ExportData

    if (parsed.version !== 1) {
      throw new Error('Unsupported export version')
    }

    return {
      sessions: parsed.sessions.map(s => ({
        ...s,
        createdAt: new Date(s.createdAt).getTime(),
        updatedAt: new Date(s.updatedAt).getTime(),
      })),
      messages: parsed.messages,
    }
  }

  /**
   * 使用 Electron dialog 保存文件
   */
  async exportToFile(data: string): Promise<boolean> {
    if (window.deepSeek?.dialog) {
      const result = await window.deepSeek.dialog.save({
        title: '导出会话',
        defaultPath: `deepseekharm-export-${Date.now()}.json`,
        filters: [
          { name: 'JSON', extensions: ['json'] },
          { name: 'All', extensions: ['*'] },
        ],
      })

      if (!result.canceled && result.filePath) {
        await window.deepSeek.fs.writeFile(result.filePath, data)
        return true
      }
      return false
    }

    // 降级方案：使用下载
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deepseekharm-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    return true
  }

  /**
   * 使用 Electron dialog 打开文件
   */
  async importFromFile(): Promise<string | null> {
    if (window.deepSeek?.dialog) {
      const result = await window.deepSeek.dialog.open({
        title: '导入会话',
        filters: [
          { name: 'JSON', extensions: ['json'] },
          { name: 'All', extensions: ['*'] },
        ],
        properties: ['openFile'],
      })

      if (!result.canceled && result.filePaths?.length > 0) {
        return await window.deepSeek.fs.readFile(result.filePaths[0])
      }
      return null
    }

    // 降级方案：使用 file input
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (file) {
          const text = await file.text()
          resolve(text)
        } else {
          resolve(null)
        }
      }
      input.click()
    })
  }
}

// 单例
export const storageService = new StorageService()
