'use client'

import { useState, useEffect } from 'react'
import { supabaseUrl, supabaseKey } from '../../utils/supabaseConfig'

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

        const baseUrl = supabaseUrl
        const headers: Record<string, string> = {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }

        const shouldCount = checkShouldCount()

        if (shouldCount) {
          const maxRes = await fetch(`${baseUrl}/rest/v1/visitor?select=count&order=count.desc&limit=1`, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
            signal: AbortSignal.timeout(5000)
          })
          if (!maxRes.ok) throw new Error('Failed to fetch current count')
          const maxData = await maxRes.json() as Array<{ count: number }>
          const nextCount = (maxData[0]?.count ?? 0) + 1

          const insertRes = await fetch(`${baseUrl}/rest/v1/visitor`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ count: nextCount }),
            signal: AbortSignal.timeout(5000)
          })
          if (!insertRes.ok) throw new Error('Failed to record visit')
          localStorage.setItem(VISITOR_COUNT_KEY, Date.now().toString())
          setCount(nextCount)
        } else {
          const countRes = await fetch(`${baseUrl}/rest/v1/visitor?select=count&order=count.desc&limit=1`, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
            signal: AbortSignal.timeout(5000)
          })
          if (!countRes.ok) throw new Error('Failed to fetch visitor count')
          const data = await countRes.json() as Array<{ count: number }>
          setCount(data[0]?.count ?? 0)
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
