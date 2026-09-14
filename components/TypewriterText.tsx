'use client'

import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  startDelay?: number
  className?: string
  loop?: boolean
  pauseDuration?: number
  deleteSpeed?: number
}

export default function TypewriterText ({
  text,
  speed = 80,
  startDelay = 400,
  className,
  loop = false,
  pauseDuration = 2500,
  deleteSpeed = 40
}: TypewriterTextProps): JSX.Element {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplayed(text)
      setDone(true)
      return
    }

    let i = 0
    let phase: 'typing' | 'pausing' | 'deleting' = 'typing'
    let timer: ReturnType<typeof setTimeout>

    const startTimer = setTimeout(() => {
      const tick = (): void => {
        if (phase === 'typing') {
          if (i < text.length) {
            setDisplayed(text.slice(0, i + 1))
            i++
            timer = setTimeout(tick, speed)
          } else {
            setDone(true)
            if (loop) {
              phase = 'pausing'
              timer = setTimeout(tick, pauseDuration)
            }
          }
        } else if (phase === 'pausing') {
          phase = 'deleting'
          setDone(false)
          timer = setTimeout(tick, deleteSpeed)
        } else if (phase === 'deleting') {
          if (i > 0) {
            i--
            setDisplayed(text.slice(0, i))
            timer = setTimeout(tick, deleteSpeed)
          } else {
            phase = 'typing'
            timer = setTimeout(tick, speed)
          }
        }
      }
      tick()
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(timer)
    }
  }, [text, speed, startDelay, loop, pauseDuration, deleteSpeed])

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </span>
  )
}
