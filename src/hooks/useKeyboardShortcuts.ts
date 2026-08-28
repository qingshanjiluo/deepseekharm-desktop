import { useEffect, useCallback, useRef } from 'react'
import { matchShortcut } from './useShortcuts'
import { useAppStore } from '../store'

interface ShortcutBinding {
  id: string
  keys: string[]
  handler: (event: KeyboardEvent) => void
  category?: string
}

// 全局快捷键管理器
class ShortcutManager {
  private bindings: Map<string, ShortcutBinding> = new Map()
  private enabled: boolean = true

  register(binding: ShortcutBinding): () => void {
    this.bindings.set(binding.id, binding)
    return () => {
      this.bindings.delete(binding.id)
    }
  }

  handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.enabled) return

    // 忽略在输入框中的按键（除非有 Ctrl/Alt/Meta 修饰键）
    const target = event.target as HTMLElement
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
    const hasModifier = event.ctrlKey || event.altKey || event.metaKey

    if (isInput && !hasModifier) return

    for (const binding of this.bindings.values()) {
      if (matchShortcut(event, binding.keys)) {
        event.preventDefault()
        event.stopPropagation()
        binding.handler(event)
        return
      }
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }
}

// 全局单例
export const shortcutManager = new ShortcutManager()

// React Hook
export function useKeyboardShortcuts() {
  const {
    createSession,
    setCurrentSession,
    sessions,
    currentSessionId,
    updateSession,
    updateSettings,
    settings,
  } = useAppStore()

  // 注册全局事件监听
  useEffect(() => {
    document.addEventListener('keydown', shortcutManager.handleKeyDown)
    return () => {
      document.removeEventListener('keydown', shortcutManager.handleKeyDown)
    }
  }, [])

  // 注册快捷键
  const registerShortcut = useCallback(
    (id: string, keys: string[], handler: (event: KeyboardEvent) => void) => {
      return shortcutManager.register({ id, keys, handler })
    },
    []
  )

  // 通用快捷键
  useEffect(() => {
    // 新建会话
    const unsubNewSession = shortcutManager.register({
      id: 'global-new-session',
      keys: ['Ctrl', 'N'],
      handler: () => createSession(),
    })

    // 切换侧边栏
    const unsubToggleSidebar = shortcutManager.register({
      id: 'global-toggle-sidebar',
      keys: ['Ctrl', 'B'],
      handler: () => updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed }),
    })

    // 打开设置
    const unsubSettings = shortcutManager.register({
      id: 'global-settings',
      keys: ['Ctrl', ','],
      handler: () => {
        // 通过自定义事件触发设置弹窗
        window.dispatchEvent(new CustomEvent('open-settings'))
      },
    })

    // 清空对话
    const unsubClear = shortcutManager.register({
      id: 'global-clear-chat',
      keys: ['Ctrl', 'Shift', 'D'],
      handler: () => {
        if (currentSessionId) {
          updateSession(currentSessionId, { messages: [] })
        }
      },
    })

    // 导出对话
    const unsubExport = shortcutManager.register({
      id: 'global-export-chat',
      keys: ['Ctrl', 'Shift', 'E'],
      handler: () => {
        window.dispatchEvent(new CustomEvent('export-chat'))
      },
    })

    // 上一个会话
    const unsubPrevSession = shortcutManager.register({
      id: 'global-prev-session',
      keys: ['Ctrl', 'Up'],
      handler: () => {
        const currentIndex = sessions.findIndex(s => s.id === currentSessionId)
        if (currentIndex > 0) {
          setCurrentSession(sessions[currentIndex - 1].id)
        }
      },
    })

    // 下一个会话
    const unsubNextSession = shortcutManager.register({
      id: 'global-next-session',
      keys: ['Ctrl', 'Down'],
      handler: () => {
        const currentIndex = sessions.findIndex(s => s.id === currentSessionId)
        if (currentIndex < sessions.length - 1) {
          setCurrentSession(sessions[currentIndex + 1].id)
        }
      },
    })

    return () => {
      unsubNewSession()
      unsubToggleSidebar()
      unsubSettings()
      unsubClear()
      unsubExport()
      unsubPrevSession()
      unsubNextSession()
    }
  }, [
    createSession,
    setCurrentSession,
    sessions,
    currentSessionId,
    updateSession,
    updateSettings,
    settings.sidebarCollapsed,
  ])

  return {
    registerShortcut,
    setEnabled: shortcutManager.setEnabled.bind(shortcutManager),
  }
}
