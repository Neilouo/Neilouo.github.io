'use client'

import { useRef, type ReactNode } from 'react'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

/**
 * Wraps an element (e.g. a CTA button) so it gently drifts toward the cursor
 * on hover. Disabled under prefers-reduced-motion. Use on small, focal targets.
 */
export default function Magnetic ({ children, strength = 0.25, className = '' }: MagneticProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (el == null) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const onLeave = (): void => {
    const el = ref.current
    if (el == null) return
    el.style.transform = 'translate(0px, 0px)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`ambient-magnetic inline-block transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  )
}
