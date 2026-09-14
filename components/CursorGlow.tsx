'use client'

import { useRef } from 'react'
import { usePointerTracking } from '../hooks/usePointerTracking'

export default function CursorGlow (): JSX.Element | null {
  const ref = useRef<HTMLDivElement>(null)

  usePointerTracking(({ x, y }) => {
    if (ref.current != null) {
      ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }
  }, 0.1)

  return <div ref={ref} aria-hidden className="cursor-glow" />
}
