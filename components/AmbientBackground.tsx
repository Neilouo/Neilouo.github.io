'use client'

import { useEffect, useRef } from 'react'

/**
 * Ambient background layer: warm aurora blobs + fine grain + cursor spotlight
 * with subtle parallax. Sits behind all content (fixed, negative z-index),
 * respects prefers-reduced-motion and degrades on touch (pointer: coarse).
 */
export default function AmbientBackground (): JSX.Element {
  const spotRef = useRef<HTMLDivElement>(null)
  const blobsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      if (spotRef.current != null) {
        spotRef.current.style.setProperty('--mx', `${cx}px`)
        spotRef.current.style.setProperty('--my', `${cy}px`)
      }
      if (blobsRef.current != null) {
        const dx = (cx / window.innerWidth - 0.5) * 2
        const dy = (cy / window.innerHeight - 0.5) * 2
        blobsRef.current.style.transform = `translate3d(${dx * -22}px, ${dy * -22}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div aria-hidden className="ambient-layer fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div ref={blobsRef} className="ambient-blobs">
        <span className="ambient-blob blob-1" />
        <span className="ambient-blob blob-2" />
        <span className="ambient-blob blob-3" />
        <span className="ambient-blob blob-4" />
      </div>
      <div className="ambient-grain" />
      <div ref={spotRef} className="ambient-spotlight" />
    </div>
  )
}
