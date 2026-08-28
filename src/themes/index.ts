export type Theme = 'dark' | 'light' | 'system'

export interface ThemeColors {
  // 背景色
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  bgHover: string
  bgActive: string
  
  // 文本色
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textInverse: string
  
  // 边框色
  borderPrimary: string
  borderSecondary: string
  borderFocus: string
  
  // 主色调
  accentPrimary: string
  accentSecondary: string
  accentHover: string
  
  // 状态色
  success: string
  warning: string
  error: string
  info: string
  
  // 阴影
  shadowSm: string
  shadowMd: string
  shadowLg: string
}

export const darkTheme: ThemeColors = {
  // 背景色
  bgPrimary: '#0f172a',
  bgSecondary: '#1e293b',
  bgTertiary: '#334155',
  bgHover: 'rgba(255, 255, 255, 0.04)',
  bgActive: 'rgba(99, 102, 241, 0.15)',
  
  // 文本色
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',
  textInverse: '#0f172a',
  
  // 边框色
  borderPrimary: 'rgba(255, 255, 255, 0.08)',
  borderSecondary: 'rgba(255, 255, 255, 0.06)',
  borderFocus: 'rgba(99, 102, 241, 0.5)',
  
  // 主色调
  accentPrimary: '#6366f1',
  accentSecondary: '#818cf8',
  accentHover: '#5558e6',
  
  // 状态色
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // 阴影
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 10px 25px rgba(0, 0, 0, 0.5)',
}

export const lightTheme: ThemeColors = {
  // 背景色
  bgPrimary: '#ffffff',
  bgSecondary: '#f8fafc',
  bgTertiary: '#f1f5f9',
  bgHover: 'rgba(0, 0, 0, 0.02)',
  bgActive: 'rgba(99, 102, 241, 0.1)',
  
  // 文本色
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textTertiary: '#94a3b8',
  textInverse: '#ffffff',
  
  // 边框色
  borderPrimary: 'rgba(0, 0, 0, 0.1)',
  borderSecondary: 'rgba(0, 0, 0, 0.06)',
  borderFocus: 'rgba(99, 102, 241, 0.5)',
  
  // 主色调
  accentPrimary: '#6366f1',
  accentSecondary: '#818cf8',
  accentHover: '#5558e6',
  
  // 状态色
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // 阴影
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 25px rgba(0, 0, 0, 0.15)',
}

export function getSystemTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'dark'
}

export function getThemeColors(theme: Theme): ThemeColors {
  if (theme === 'system') {
    return getSystemTheme() === 'dark' ? darkTheme : lightTheme
  }
  return theme === 'dark' ? darkTheme : lightTheme
}

export function applyTheme(theme: Theme): void {
  const colors = getThemeColors(theme)
  const root = document.documentElement
  
  // 应用 CSS 变量
  Object.entries(colors).forEach(([key, value]) => {
    // 将 camelCase 转换为 kebab-case
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--${cssVar}`, value)
  })
  
  // 设置 data-theme 属性
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme
  root.setAttribute('data-theme', effectiveTheme)
}

// 监听系统主题变化
export function watchSystemTheme(callback: (theme: 'dark' | 'light') => void): () => void {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches ? 'dark' : 'light')
    }
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }
  return () => {}
}
