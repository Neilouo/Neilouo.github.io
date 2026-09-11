'use client'

import { useEffect, useRef } from 'react'

/**
 * Fluid particle cursor: a canvas particle system that trails the pointer.
 * Particles spawn proportional to movement velocity, drift outward with
 * drag + slight turbulence, then fade and shrink — like glowing fluid/smoke.
 * Additive blending gives a luminous, water-like glow over content.
 * Degrades on touch / reduced-motion (canvas stays empty).
 */

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
}

const MAX_PARTICLES = 600

export default function CursorGlow (): JSX.Element | null {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (ctx == null) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduce || !fine) return

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = window.innerWidth
    let h = window.innerHeight

    const resize = (): void => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    let mx = w / 2
    let my = h / 2
    let pmx = mx
    let pmy = my
    let active = false
    let raf = 0

    const particles: Particle[] = []

    const spawn = (x: number, y: number, vx: number, vy: number, count: number): void => {
      const speed = Math.hypot(vx, vy)
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) particles.shift()
        const ang = Math.random() * Math.PI * 2
        const spread = Math.random() * 1.6
        const baseLife = 0.7 + Math.random() * 0.8
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: vx * 0.18 + Math.cos(ang) * spread,
          vy: vy * 0.18 + Math.sin(ang) * spread - 0.3,
          life: baseLife,
          maxLife: baseLife,
          size: 4 + Math.random() * 10 + Math.min(speed * 0.25, 8),
          hue: 22 + Math.random() * 28
        })
      }
    }

    const onMove = (e: MouseEvent): void => {
      mx = e.clientX
      my = e.clientY
      active = true
    }

    const onLeave = (): void => { active = false }
    const onEnter = (): void => { active = true }

    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    const loop = (): void => {
      const dx = mx - pmx
      const dy = my - pmy
      const speed = Math.hypot(dx, dy)

      if (active && speed > 0.4) {
        const count = Math.min(8, Math.ceil(speed * 0.45))
        spawn(mx, my, dx, dy, count)
      } else if (active && speed <= 0.4) {
        if (Math.random() < 0.3) spawn(mx, my, 0, 0, 1)
      }

      pmx = mx
      pmy = my

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vx *= 0.94
        p.vy *= 0.94
        p.vy -= 0.04
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.016

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        const t = p.life / p.maxLife
        const r = p.size * t
        if (r < 0.3) continue

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
        const a = t * 0.7
        grad.addColorStop(0, `hsla(${p.hue}, 95%, 62%, ${a})`)
        grad.addColorStop(0.4, `hsla(${p.hue}, 90%, 55%, ${a * 0.5})`)
        grad.addColorStop(1, `hsla(${p.hue}, 90%, 55%, 0)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (active) {
        const cg = ctx.createRadialGradient(mx, my, 0, mx, my, 36)
        cg.addColorStop(0, 'rgba(255, 180, 90, 0.55)')
        cg.addColorStop(0.5, 'rgba(251, 146, 60, 0.18)')
        cg.addColorStop(1, 'rgba(251, 146, 60, 0)')
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(mx, my, 36, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="cursor-particles" />
}
