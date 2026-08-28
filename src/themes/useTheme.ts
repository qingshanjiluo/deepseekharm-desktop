import { useState, useEffect, useCallback } from 'react'
import { Theme, ThemeColors, getThemeColors, applyTheme, watchSystemTheme } from './index'
import { useAppStore } from '../store'

export function useTheme() {
  const { settings, updateSettings } = useAppStore()
  const [colors, setColors] = useState<ThemeColors>(() => getThemeColors(settings.theme))

  // 应用主题
  useEffect(() => {
    applyTheme(settings.theme)
    setColors(getThemeColors(settings.theme))
  }, [settings.theme])

  // 监听系统主题变化
  useEffect(() => {
    if (settings.theme === 'system') {
      return watchSystemTheme(() => {
        setColors(getThemeColors('system'))
      })
    }
  }, [settings.theme])

  const setTheme = useCallback((theme: Theme) => {
    updateSettings({ theme })
  }, [updateSettings])

  return {
    theme: settings.theme,
    colors,
    setTheme,
    isDark: (settings.theme === 'system' ? 
      window.matchMedia('(prefers-color-scheme: dark)').matches : 
      settings.theme === 'dark'
    ),
  }
}
