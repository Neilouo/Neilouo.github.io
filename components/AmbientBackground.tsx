'use client'

import { useRef } from 'react'
import { usePointerTracking } from '../hooks/usePointerTracking'

export default function AmbientBackground (): JSX.Element {
  const blobsRef = useRef<HTMLDivElement>(null)

  usePointerTracking(({ x, y }) => {
    if (blobsRef.current != null) {
      const dx = (x / window.innerWidth - 0.5) * 2
      const dy = (y / window.innerHeight - 0.5) * 2
      blobsRef.current.style.transform = `translate3d(${dx * -22}px, ${dy * -22}px, 0)`
    }
  }, 0.08)

  return (
    <div aria-hidden className="ambient-layer fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div ref={blobsRef} className="ambient-blobs">
        <span className="ambient-blob blob-1" />
        <span className="ambient-blob blob-2" />
        <span className="ambient-blob blob-3" />
        <span className="ambient-blob blob-4" />
      </div>
      <div className="ambient-grain" />
    </div>
  )
}
