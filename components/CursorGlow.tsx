'use client'

import { useEffect, useRef } from 'react'

/**
 * A single large gaussian-blurred glow ball that follows the cursor with
 * inertial easing. Sits on the background layer (behind content), never
 * blocks pointer events. Degrades on touch / reduced-motion.
 */
export default function CursorGlow (): JSX.Element | null {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el == null) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduce || !fine) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty
    let raf = 0

    const onMove = (e: MouseEvent): void => {
      tx = e.clientX
      ty = e.clientY
    }

    const loop = (): void => {
      cx += (tx - cx) * 0.1
      cy += (ty - cy) * 0.1
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} aria-hidden className="cursor-glow" />
}
