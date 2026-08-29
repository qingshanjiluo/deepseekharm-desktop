import { useState, useCallback } from 'react'

export function useCopyFeedback(duration: number = 1000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), duration)
      return true
    } catch {
      // 降级方案：execCommand
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopied(true)
        setTimeout(() => setCopied(false), duration)
        return true
      } catch {
        return false
      }
    }
  }, [duration])

  return { copied, copy }
}
