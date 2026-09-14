'use client'

import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  startDelay?: number
  className?: string
}

export default function TypewriterText ({ text, speed = 80, startDelay = 400, className }: TypewriterTextProps): JSX.Element {
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
    let timer: ReturnType<typeof setTimeout>

    const startTimer = setTimeout(() => {
      const tick = (): void => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
          timer = setTimeout(tick, speed)
        } else {
          setDone(true)
        }
      }
      tick()
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(timer)
    }
  }, [text, speed, startDelay])

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </span>
  )
}
