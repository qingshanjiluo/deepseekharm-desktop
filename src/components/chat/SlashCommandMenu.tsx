import React, { useState, useEffect, useRef } from 'react'
import './SlashCommandMenu.css'

interface SlashCommand {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'common' | 'tools' | 'code' | 'system'
}

interface SlashCommandMenuProps {
  isOpen: boolean
  query: string
  onSelect: (command: SlashCommand) => void
  onClose: () => void
}

const commands: SlashCommand[] = [
  {
    id: 'clear',
    name: '清空对话',
    description: '清空当前会话的所有消息',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
    ),
    category: 'common',
  },
  {
    id: 'export',
    name: '导出会话',
    description: '将对话导出为 Markdown 文件',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    category: 'common',
  },
  {
    id: 'model',
    name: '切换模型',
    description: '切换当前使用的 AI 模型',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    category: 'system',
  },
  {
    id: 'code',
    name: '代码模式',
    description: '以代码格式回复',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    category: 'code',
  },
  {
    id: 'explain',
    name: '解释代码',
    description: '解释选中的代码片段',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    category: 'code',
  },
  {
    id: 'review',
    name: '代码审查',
    description: '审查代码质量和潜在问题',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    category: 'code',
  },
  {
    id: 'test',
    name: '生成测试',
    description: '为代码生成单元测试',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    category: 'tools',
  },
  {
    id: 'search',
    name: '搜索文件',
    description: '在项目中搜索文件',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    category: 'tools',
  },
  {
    id: 'edit',
    name: '编辑文件',
    description: '编辑指定文件内容',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    category: 'tools',
  },
  {
    id: 'run',
    name: '运行命令',
    description: '执行终端命令',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 17 10 11 4 5"/>
        <line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
    category: 'tools',
  },
]

export function SlashCommandMenu({ isOpen, query, onSelect, onClose }: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  // 过滤命令
  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase())
  )

  // 重置选中索引
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onSelect, onClose])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen || filteredCommands.length === 0) return null

  // 按类别分组
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = []
    }
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, SlashCommand[]>)

  const categoryLabels: Record<string, string> = {
    common: '通用',
    tools: '工具',
    code: '代码',
    system: '系统',
  }

  let globalIndex = 0

  return (
    <div ref={menuRef} className="slash-command-menu">
      <div className="menu-header">
        <span>斜杠命令</span>
        <span className="hint">↑↓ 导航 · Enter 选择 · Esc 关闭</span>
      </div>
      <div className="menu-content">
        {Object.entries(groupedCommands).map(([category, cmds]) => (
          <div key={category} className="command-group">
            <div className="group-label">{categoryLabels[category]}</div>
            {cmds.map((cmd) => {
              const index = globalIndex++
              return (
                <div
                  key={cmd.id}
                  className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => onSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="command-icon">{cmd.icon}</div>
                  <div className="command-info">
                    <span className="command-name">/{cmd.name}</span>
                    <span className="command-desc">{cmd.description}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export { commands }
export type { SlashCommand }
