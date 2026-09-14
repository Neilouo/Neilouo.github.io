'use client'

import { useState, useEffect } from 'react'

const VISITOR_COUNT_KEY = 'visitor_counted'
const COUNT_EXPIRY = 24 * 60 * 60 * 1000

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

        const kvUrl = process.env.NEXT_PUBLIC_VERCEL_KV_URL
        const kvToken = process.env.NEXT_PUBLIC_VERCEL_KV_REST_API_TOKEN

        if (!kvUrl || !kvToken) {
          setCount(0)
          return
        }

        const baseUrl = `${kvUrl}/get/${encodeURIComponent('visitor:count')}`
        const getRes = await fetch(baseUrl, {
          headers: { Authorization: `Bearer ${kvToken}` },
          signal: AbortSignal.timeout(5000)
        })

        if (!getRes.ok) throw new Error('Failed to fetch visitor count')
        const getData = await getRes.json() as { result: number | null }
        const currentCount = getData.result ?? 0

        const shouldCount = checkShouldCount()

        if (shouldCount) {
          const incrUrl = `${kvUrl}/incr/${encodeURIComponent('visitor:count')}`
          const postRes = await fetch(incrUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${kvToken}` },
            signal: AbortSignal.timeout(5000)
          })
          if (!postRes.ok) throw new Error('Failed to update visitor count')
          const postData = await postRes.json() as { result: number }
          setCount(postData.result)
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
