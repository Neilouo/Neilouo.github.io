'use client'

import { useEffect, useRef } from 'react'

/**
 * Multi-layer custom cursor:
 *  - halo:   large gaussian-blurred light, slow inertial trailing (screen blend)
 *  - trail:  comet tail of N sparks, each chasing the previous (decreasing lerp)
 *  - ring:   crisp ring with medium lag, scales up on interactive hover
 *  - dot:    precise core pinned to the pointer, shrinks on press
 *  - ripple: expanding ring burst on click
 *
 * Native cursor is hidden only on fine-pointer devices without reduced-motion,
 * and only after JS adds `.cursor-custom` to <body> (graceful fallback).
 */
const TRAIL_COUNT = 16
const HOVER_SELECTOR = 'a, button, [role="button"], .cursor-pointer, input, textarea, select, summary, [data-cursor="hover"]'

export default function CursorGlow (): JSX.Element | null {
  const haloRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const fxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el0 = haloRef.current
    const el1 = ringRef.current
    const el2 = dotRef.current
    const fxl = fxRef.current
    if (el0 == null || el1 == null || el2 == null || fxl == null) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduce || !fine) return

    document.body.classList.add('cursor-custom')

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let haloX = tx
    let haloY = ty
    let ringX = tx
    let ringY = ty
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: tx, y: ty }))
    let raf = 0
    let hovering = false
    let pressing = false
    let visible = false

    const sparks: HTMLSpanElement[] = []
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const s = document.createElement('span')
      s.className = 'cursor-spark'
      s.style.opacity = '0'
      fxl.appendChild(s)
      sparks.push(s)
    }

    const show = (): void => {
      if (visible) return
      visible = true
      document.body.classList.add('cursor-visible')
    }

    const hide = (): void => {
      visible = false
      document.body.classList.remove('cursor-visible')
    }

    const onMove = (e: MouseEvent): void => {
      tx = e.clientX
      ty = e.clientY
      show()
      const t = e.target as HTMLElement | null
      hovering = !!(t?.closest(HOVER_SELECTOR))
    }

    const onDown = (e: MouseEvent): void => {
      pressing = true
      const r = document.createElement('span')
      r.className = 'cursor-ripple'
      r.style.left = `${e.clientX}px`
      r.style.top = `${e.clientY}px`
      fxl.appendChild(r)
      r.addEventListener('animationend', () => { r.remove() }, { once: true })
    }

    const onUp = (): void => { pressing = false }

    const loop = (): void => {
      haloX += (tx - haloX) * 0.085
      haloY += (ty - haloY) * 0.085
      ringX += (tx - ringX) * 0.28
      ringY += (ty - ringY) * 0.28

      el0.style.transform = `translate3d(${haloX}px, ${haloY}px, 0) translate(-50%, -50%)`

      const rs = hovering ? 1.8 : (pressing ? 0.7 : 1)
      el1.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${rs})`
      if (hovering) {
        el1.style.borderColor = 'rgba(251,146,60,0.95)'
        el1.style.backgroundColor = 'rgba(251,146,60,0.10)'
      } else {
        el1.style.borderColor = 'rgba(251,146,60,0.55)'
        el1.style.backgroundColor = 'transparent'
      }

      const ds = pressing ? 0.5 : (hovering ? 0.35 : 1)
      el2.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%) scale(${ds})`

      let px = tx
      let py = ty
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const p = trail[i]
        const k = 0.42 - i * 0.02
        p.x += (px - p.x) * k
        p.y += (py - p.y) * k
        px = p.x
        py = p.y
        const s = sparks[i]
        if (s != null) {
          const f = 1 - i / TRAIL_COUNT
          s.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${0.55 * f + 0.08})`
          s.style.opacity = String(f * 0.6)
        }
      }

      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown, { passive: true })
    window.addEventListener('mouseup', onUp, { passive: true })
    document.addEventListener('mouseleave', hide)
    document.addEventListener('mouseenter', show)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', hide)
      document.removeEventListener('mouseenter', show)
      cancelAnimationFrame(raf)
      sparks.forEach(s => s.remove())
      document.body.classList.remove('cursor-custom', 'cursor-visible')
    }
  }, [])

  return (
    <>
      <div ref={haloRef} aria-hidden className="cursor-halo" />
      <div ref={fxRef} aria-hidden className="cursor-fx" />
      <div ref={ringRef} aria-hidden className="cursor-ring" />
      <div ref={dotRef} aria-hidden className="cursor-dot" />
    </>
  )
}
