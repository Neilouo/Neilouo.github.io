'use client'

import { useEffect, useRef, useState } from 'react'

export function useCountUp (target: number, duration = 1200, start = false): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!start) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }

    const startTime = performance.now()
    const animate = (now: number): void => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => { cancelAnimationFrame(rafRef.current) }
  }, [target, duration, start])

  return value
}
