import { NextApiRequest, NextApiResponse } from 'next'
import { kv } from '@vercel/kv'

const VISITOR_KEY = 'visitor:count'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    if (req.method === 'GET') {
      const count = (await kv.get<number>(VISITOR_KEY)) ?? 0
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
      return res.status(200).json({ count })
    }

    if (req.method === 'POST') {
      const count = await kv.incr(VISITOR_KEY)
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ count })
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Visitor API error:', msg)
    return res.status(500).json({ message: msg })
  }
}
