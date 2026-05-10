'use client'

import { useState, useEffect } from 'react'

const VISITOR_COUNT_KEY = 'visitor_counted'
const COUNT_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

interface VisitorResult {
  count: number
  loading: boolean
  error: string | null
}

function Visitors (): VisitorResult {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndUpdate = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        // Read current count
        const getRes = await fetch('/api/visitor')
        if (!getRes.ok) throw new Error('Failed to fetch visitor count')
        const { count: currentCount } = await getRes.json() as { count: number }

        // Check if we should increment (once per 24h per browser)
        const shouldCount = checkShouldCount()

        if (shouldCount) {
          const postRes = await fetch('/api/visitor', { method: 'POST' })
          if (!postRes.ok) throw new Error('Failed to update visitor count')
          const { count: newCount } = await postRes.json() as { count: number }
          setCount(newCount)
          localStorage.setItem(VISITOR_COUNT_KEY, Date.now().toString())
        } else {
          setCount(currentCount)
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Visitor count error'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    void fetchAndUpdate()
  }, [])

  return { count, loading, error }
}

function checkShouldCount (): boolean {
  if (typeof window === 'undefined') return true
  const lastCounted = localStorage.getItem(VISITOR_COUNT_KEY)
  if (lastCounted === null) return true
  return Date.now() - parseInt(lastCounted, 10) >= COUNT_EXPIRY
}

export default Visitors
