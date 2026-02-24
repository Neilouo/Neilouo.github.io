import type { NextApiRequest, NextApiResponse } from 'next'

const KAGGLE_USERNAME = process.env.KAGGLE_USERNAME || ''
const KAGGLE_KEY = process.env.KAGGLE_KEY || ''

interface CacheRecord {
  data: unknown
  expires: number
}
let cache: CacheRecord | null = null

const fallbackData = {
  username: '',
  displayName: '',
  tier: 'Contributor',
  ranking: null as number | null,
  medals: { gold: 0, silver: 0, bronze: 0 },
  competitions: 0,
  datasets: 0,
  notebooks: 0,
  configured: false
}

// eslint-disable-next-line @typescript-eslint/require-await
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (!KAGGLE_USERNAME || !KAGGLE_KEY) {
    return res.status(200).json(fallbackData)
  }

  const now = Date.now()
  if (cache && cache.expires > now) {
    return res.status(200).json(cache.data)
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${KAGGLE_USERNAME}:${KAGGLE_KEY}`).toString('base64')}`
    const [profileRes, datasetsRes, kernelsRes] = await Promise.all([
      fetch('https://www.kaggle.com/api/v1/competitions/list?page=1&pageSize=1', {
        headers: { Authorization: authHeader }
      }),
      fetch(`https://www.kaggle.com/api/v1/datasets/list?user=${KAGGLE_USERNAME}&pageSize=100`, {
        headers: { Authorization: authHeader }
      }),
      fetch(`https://www.kaggle.com/api/v1/kernels/list?user=${KAGGLE_USERNAME}&pageSize=100`, {
        headers: { Authorization: authHeader }
      })
    ])

    const datasets = datasetsRes.ok ? await datasetsRes.json() : []
    const kernels = kernelsRes.ok ? await kernelsRes.json() : []

    const result = {
      username: KAGGLE_USERNAME,
      displayName: KAGGLE_USERNAME,
      tier: 'Contributor',
      ranking: null,
      medals: { gold: 0, silver: 0, bronze: 0 },
      competitions: 0,
      datasets: Array.isArray(datasets) ? datasets.length : 0,
      notebooks: Array.isArray(kernels) ? kernels.length : 0,
      configured: true
    }

    cache = { data: result, expires: now + 1000 * 60 * 30 }
    res.status(200).json(result)
  } catch (error) {
    console.error('[kaggle] fetch failed', error)
    res.status(200).json({ ...fallbackData, configured: true })
  }
}
