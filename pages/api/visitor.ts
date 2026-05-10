import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lptqykocinwlojjzfqhy.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

const supabase = SUPABASE_SERVICE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) : null

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (!supabase) {
    return res.status(500).json({ message: 'Supabase not configured' })
  }

  try {
    // Read current count
    const { data: rows, error: fetchError } = await supabase
      .from('visitor')
      .select('count')
      .eq('id', 1)
      .limit(1)

    if (fetchError) {
      throw new Error(fetchError.message)
    }

    const current = rows?.[0] ?? null

    if (req.method === 'GET') {
      if (!current) {
        return res.status(200).json({ count: 0 })
      }
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
      return res.status(200).json({ count: Number(current.count) })
    }

    if (req.method === 'POST') {
      if (!current) {
        const { data: inserted, error: insertError } = await supabase
          .from('visitor')
          .insert([{ id: 1, count: 1 }])
          .select('count')
          .single()

        if (insertError) throw new Error(insertError.message)
        return res.status(200).json({ count: inserted.count })
      }

      const newCount = Number(current.count) + 1
      const { error: updateError } = await supabase
        .from('visitor')
        .update({ count: newCount })
        .eq('id', 1)

      if (updateError) throw new Error(updateError.message)

      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ count: newCount })
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Visitor API error:', msg)
    return res.status(500).json({ message: msg })
  }
}
