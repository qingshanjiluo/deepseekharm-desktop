import { useState, useEffect, useCallback } from 'react'

/**
 * 检查窗口是否最大化
 */
export const useMaximized = () => {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    const checkMaximized = async () => {
      if (window.deepSeek?.window) {
        const maximized = await window.deepSeek.window.isMaximized()
        setIsMaximized(maximized)
      }
    }
    
    checkMaximized()
  }, [])

  const toggleMaximize = useCallback(async () => {
    if (window.deepSeek?.window) {
      await window.deepSeek.window.maximize()
      const maximized = await window.deepSeek.window.isMaximized()
      setIsMaximized(maximized)
    }
  }, [])

  return { isMaximized, toggleMaximize }
}

/**
 * 检查网络状态
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * 本地存储Hook
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

/**
 * 防抖Hook
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 键盘快捷键Hook
 */
export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        const ctrlMatch = modifiers.ctrl ? event.ctrlKey || event.metaKey : true
        const shiftMatch = modifiers.shift ? event.shiftKey : true
        const altMatch = modifiers.alt ? event.altKey : true

        if (ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault()
          callback()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, callback, modifiers])
}

/**
 * 窗口大小Hook
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
