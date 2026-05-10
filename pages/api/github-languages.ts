import { NextApiRequest, NextApiResponse } from 'next'

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'NanSang2000'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

type LanguageBytes = Record<string, number>

interface LanguageResult {
  name: string
  bytes: number
  percentage: number
}

// Fallback data when GitHub API is unavailable
const FALLBACK_LANGUAGES: LanguageResult[] = [
  { name: 'TypeScript', bytes: 0, percentage: 35 },
  { name: 'JavaScript', bytes: 0, percentage: 25 },
  { name: 'Python', bytes: 0, percentage: 20 },
  { name: 'Go', bytes: 0, percentage: 8 },
  { name: 'Java', bytes: 0, percentage: 7 },
  { name: 'HTML', bytes: 0, percentage: 5 }
]

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Website'
  }
  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`
  }

  try {
    // 1. Fetch user's public repos
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&type=public`,
      { headers, signal: AbortSignal.timeout(10000) }
    )
    if (!reposRes.ok) throw new Error(`GitHub repos API ${reposRes.status}`)
    const repos: Array<{ name: string, fork: boolean, language: string | null }> = await reposRes.json()

    // 2. Fetch language bytes for each non-fork repo (concurrency limited)
    const nonForkRepos = repos.filter(r => !r.fork).slice(0, 30)
    const aggregated: LanguageBytes = {}

    const fetchLangs = nonForkRepos.map(async (repo) => {
      try {
        const r = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`,
          { headers, signal: AbortSignal.timeout(8000) }
        )
        if (!r.ok) return
        const langs: LanguageBytes = await r.json()
        for (const [lang, bytes] of Object.entries(langs)) {
          aggregated[lang] = (aggregated[lang] || 0) + bytes
        }
      } catch {
        // Skip individual repo failures
      }
    })

    await Promise.all(fetchLangs)

    // 3. Calculate percentages
    const totalBytes = Object.values(aggregated).reduce((a, b) => a + b, 0)
    if (totalBytes === 0) {
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
      return res.status(200).json({ languages: FALLBACK_LANGUAGES, source: 'fallback' })
    }

    const sorted = Object.entries(aggregated)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Math.round((bytes / totalBytes) * 100)
      }))

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200')
    res.status(200).json({ languages: sorted, source: 'github' })
  } catch (err) {
    console.error('GitHub languages API error:', err)
    res.setHeader('X-Data-Source', 'fallback')
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    res.status(200).json({ languages: FALLBACK_LANGUAGES, source: 'fallback' })
  }
}
