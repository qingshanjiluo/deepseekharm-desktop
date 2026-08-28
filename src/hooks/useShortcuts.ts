// 快捷键定义
export interface Shortcut {
  id: string
  name: string
  description: string
  keys: string[]
  category: 'general' | 'chat' | 'navigation' | 'edit'
  action: () => void
}

// 默认快捷键配置
export const defaultShortcuts: Omit<Shortcut, 'action'>[] = [
  // 通用
  {
    id: 'new-session',
    name: '新建会话',
    description: '创建一个新的对话会话',
    keys: ['Ctrl', 'N'],
    category: 'general',
  },
  {
    id: 'save',
    name: '保存',
    description: '保存当前会话',
    keys: ['Ctrl', 'S'],
    category: 'general',
  },
  {
    id: 'settings',
    name: '设置',
    description: '打开设置面板',
    keys: ['Ctrl', ','],
    category: 'general',
  },
  {
    id: 'toggle-sidebar',
    name: '切换侧边栏',
    description: '显示或隐藏侧边栏',
    keys: ['Ctrl', 'B'],
    category: 'general',
  },
  
  // 聊天
  {
    id: 'send-message',
    name: '发送消息',
    description: '发送当前输入的消息',
    keys: ['Enter'],
    category: 'chat',
  },
  {
    id: 'new-line',
    name: '换行',
    description: '在输入框中换行',
    keys: ['Shift', 'Enter'],
    category: 'chat',
  },
  {
    id: 'clear-chat',
    name: '清空对话',
    description: '清空当前会话的所有消息',
    keys: ['Ctrl', 'Shift', 'D'],
    category: 'chat',
  },
  {
    id: 'export-chat',
    name: '导出对话',
    description: '导出当前会话为 Markdown 文件',
    keys: ['Ctrl', 'Shift', 'E'],
    category: 'chat',
  },
  
  // 导航
  {
    id: 'previous-session',
    name: '上一个会话',
    description: '切换到上一个会话',
    keys: ['Ctrl', 'Up'],
    category: 'navigation',
  },
  {
    id: 'next-session',
    name: '下一个会话',
    description: '切换到下一个会话',
    keys: ['Ctrl', 'Down'],
    category: 'navigation',
  },
  {
    id: 'search',
    name: '搜索',
    description: '打开搜索面板',
    keys: ['Ctrl', 'F'],
    category: 'navigation',
  },
  
  // 编辑
  {
    id: 'copy',
    name: '复制',
    description: '复制选中的消息',
    keys: ['Ctrl', 'C'],
    category: 'edit',
  },
  {
    id: 'paste',
    name: '粘贴',
    description: '粘贴剪贴板内容',
    keys: ['Ctrl', 'V'],
    category: 'edit',
  },
  {
    id: 'select-all',
    name: '全选',
    description: '选择所有消息',
    keys: ['Ctrl', 'A'],
    category: 'edit',
  },
]

// 解析快捷键字符串
export function parseKeys(keys: string[]): string {
  return keys.join(' + ')
}

// 检查快捷键是否匹配
export function matchShortcut(event: KeyboardEvent, keys: string[]): boolean {
  const keyMap: Record<string, string> = {
    'Ctrl': 'Control',
    'Alt': 'Alt',
    'Shift': 'Shift',
    'Meta': 'Meta',
  }
  
  const requiredKeys = keys.map(k => keyMap[k] || k.toLowerCase())
  const pressedKeys: string[] = []
  
  if (event.ctrlKey) pressedKeys.push('Control')
  if (event.altKey) pressedKeys.push('Alt')
  if (event.shiftKey) pressedKeys.push('Shift')
  if (event.metaKey) pressedKeys.push('Meta')
  
  const eventKey = event.key.toLowerCase()
  if (!['control', 'alt', 'shift', 'meta'].includes(eventKey)) {
    pressedKeys.push(eventKey)
  }
  
  // 检查是否所有必需的键都被按下
  return requiredKeys.every(key => pressedKeys.includes(key))
}

// 格式化快捷键显示
export function formatShortcut(keys: string[]): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  
  return keys.map(key => {
    switch (key) {
      case 'Ctrl':
        return isMac ? '⌘' : 'Ctrl'
      case 'Alt':
        return isMac ? '⌥' : 'Alt'
      case 'Shift':
        return isMac ? '⇧' : 'Shift'
      case 'Meta':
        return isMac ? '⌘' : 'Win'
      default:
        return key.charAt(0).toUpperCase() + key.slice(1)
    }
  }).join(isMac ? '' : ' + ')
}
