'use client'

import { useEffect, useRef } from 'react'

interface PointerState {
  x: number
  y: number
}

interface Subscriber {
  onUpdate: (state: PointerState) => void
  easing: number
}

let globalSubscribers: Subscriber[] = []
let globalRaf = 0
let globalTx = 0
let globalTy = 0
let globalCx = 0
let globalCy = 0
let globalInitialized = false

function ensureTracking (): void {
  if (globalInitialized) return
  globalInitialized = true

  if (typeof window === 'undefined') return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine = window.matchMedia('(pointer: fine)').matches
  if (reduce || !fine) return

  globalTx = window.innerWidth / 2
  globalTy = window.innerHeight / 2
  globalCx = globalTx
  globalCy = globalTy

  const onMove = (e: MouseEvent): void => {
    globalTx = e.clientX
    globalTy = e.clientY
  }

  const loop = (): void => {
    for (const sub of globalSubscribers) {
      const easedX = globalCx + (globalTx - globalCx) * sub.easing
      const easedY = globalCy + (globalTy - globalCy) * sub.easing
      sub.onUpdate({ x: easedX, y: easedY })
    }
    globalCx += (globalTx - globalCx) * 0.1
    globalCy += (globalTy - globalCy) * 0.1
    globalRaf = requestAnimationFrame(loop)
  }

  window.addEventListener('mousemove', onMove, { passive: true })
  globalRaf = requestAnimationFrame(loop)
}

export function usePointerTracking (
  onUpdate: (state: PointerState) => void,
  easing = 0.1
): void {
  const callbackRef = useRef(onUpdate)
  callbackRef.current = onUpdate

  useEffect(() => {
    const subscriber: Subscriber = {
      onUpdate: (state) => callbackRef.current(state),
      easing
    }
    globalSubscribers.push(subscriber)
    ensureTracking()

    return () => {
      globalSubscribers = globalSubscribers.filter(s => s !== subscriber)
      if (globalSubscribers.length === 0 && globalRaf !== 0) {
        cancelAnimationFrame(globalRaf)
        globalRaf = 0
        globalInitialized = false
      }
    }
  }, [easing])
}
