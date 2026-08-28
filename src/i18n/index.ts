import { Locale, TranslationKeys, getTranslation, localeNames as localeNamesMap } from './locales'

// 重新导出localeNames
export const localeNames = localeNamesMap

class I18n {
  private locale: Locale = 'zh-CN'
  private translations: TranslationKeys
  private listeners: Set<() => void> = new Set()

  constructor() {
    // 从 localStorage 读取保存的语言设置
    const savedLocale = localStorage.getItem('app-locale') as Locale
    if (savedLocale && ['zh-CN', 'en-US', 'ja-JP'].includes(savedLocale)) {
      this.locale = savedLocale
    } else {
      // 根据浏览器语言自动选择
      const browserLang = navigator.language
      if (browserLang.startsWith('zh')) {
        this.locale = 'zh-CN'
      } else if (browserLang.startsWith('ja')) {
        this.locale = 'ja-JP'
      } else {
        this.locale = 'en-US'
      }
    }
    this.translations = getTranslation(this.locale)
  }

  // 获取当前语言
  getLocale(): Locale {
    return this.locale
  }

  // 设置语言
  setLocale(locale: Locale): void {
    if (this.locale !== locale) {
      this.locale = locale
      this.translations = getTranslation(locale)
      localStorage.setItem('app-locale', locale)
      this.notifyListeners()
    }
  }

  // 获取翻译
  t(): TranslationKeys {
    return this.translations
  }

  // 获取嵌套的翻译键值
  // 例如: t.common.confirm
  get<N extends keyof TranslationKeys, K extends keyof TranslationKeys[N]>(
    namespace: N,
    key: K
  ): string {
    return this.translations[namespace][key] as string
  }

  // 监听语言变化
  onLocaleChange(callback: () => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback())
  }
}

export const i18n = new I18n()

// React Hook
import { useState, useEffect, useCallback } from 'react'

export function useTranslation() {
  const [, forceUpdate] = useState({})

  useEffect(() => {
    return i18n.onLocaleChange(() => {
      forceUpdate({})
    })
  }, [])

  const setLocale = useCallback((locale: Locale) => {
    i18n.setLocale(locale)
  }, [])

  return {
    t: i18n.t(),
    locale: i18n.getLocale(),
    setLocale,
  }
}

export type { Locale }
// localeNames 已经在文件开头导出了
