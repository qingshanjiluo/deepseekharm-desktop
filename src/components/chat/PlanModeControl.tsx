import React from 'react'
import { useAppStore } from '../../store'
import './PlanModeControl.css'

export function PlanModeControl() {
  const { settings, updateSettings } = useAppStore()
  const planMode = settings.planMode || false

  return (
    <button 
      className={`plan-mode-control ${planMode ? 'active' : ''}`}
      onClick={() => updateSettings({ planMode: !planMode } as any)}
      title={planMode ? '计划模式已开启 - 工具调用将先展示计划' : '计划模式已关闭'}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
      <span>{planMode ? '计划模式' : '执行模式'}</span>
    </button>
  )
}
