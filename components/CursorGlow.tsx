'use client'

import { useEffect, useRef } from 'react'

/**
 * A single large gaussian-blurred glow that follows the cursor with
 * lerped easing (inertial trailing). Sits on the background layer,
 * never blocks pointer events. Degrades on touch / reduced-motion.
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
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
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

  return <div ref={ref} aria-hidden className="cursor-glow fixed top-0 left-0 -z-10 pointer-events-none" />
}
