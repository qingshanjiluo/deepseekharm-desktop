import { useRef, useEffect, useCallback } from 'react'

/**
 * Pointer-affordance scrollbar hook
 * Shows scrollbar only when pointer is over the element, with linger time
 */
export function usePointerScrollbar(lingerMs = 2000) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lingerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showScrollbar = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    el.classList.add('scrollbar-visible')
    if (lingerTimerRef.current) {
      clearTimeout(lingerTimerRef.current)
      lingerTimerRef.current = null
    }
  }, [])

  const startLinger = useCallback(() => {
    if (lingerTimerRef.current) clearTimeout(lingerTimerRef.current)
    lingerTimerRef.current = setTimeout(() => {
      const el = containerRef.current
      if (el) el.classList.remove('scrollbar-visible')
      lingerTimerRef.current = null
    }, lingerMs)
  }, [lingerMs])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onPointerEnter = () => showScrollbar()
    const onPointerLeave = () => startLinger()
    const onScroll = () => {
      showScrollbar()
      startLinger()
    }

    el.addEventListener('pointerenter', onPointerEnter)
    el.addEventListener('pointerleave', onPointerLeave)
    el.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      el.removeEventListener('pointerenter', onPointerEnter)
      el.removeEventListener('pointerleave', onPointerLeave)
      el.removeEventListener('scroll', onScroll)
      if (lingerTimerRef.current) clearTimeout(lingerTimerRef.current)
    }
  }, [showScrollbar, startLinger])

  return containerRef
}
