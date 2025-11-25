import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchExternalArticlesWithCache } from '../../lib/externalFeedFetcher'
import { externalArticles as sampleArticles } from '../../data/externalArticles'

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method ?? 'UNKNOWN'} Not Allowed`)
    return
  }

  try {
    const maxAgeMs = req.query.maxAgeMs ? Number(req.query.maxAgeMs) : undefined
    const articles = await fetchExternalArticlesWithCache({ maxAgeMs })
    res.status(200).json({ articles })
  } catch (error) {
    console.error('[external-feed] 聚合失败', error)
    res.status(500).json({ articles: sampleArticles, error: '无法获取外部文章，已返回示例数据' })
  }
}
