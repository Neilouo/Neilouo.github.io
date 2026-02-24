import { NextApiRequest, NextApiResponse } from 'next'

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'NanSang2000'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

interface GitHubUser {
  avatar_url: string
  login: string
  name: string | null
  public_repos: number
  followers: number
}

interface GitHubRepo {
  stargazers_count: number
  forks_count: number
  fork: boolean
}

export interface GitHubStats {
  avatar: string
  username: string
  name: string
  stars: number
  forks: number
  repos: number
  followers: number
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Website-NanSang2000'
  }
  if (GITHUB_TOKEN) headers.Authorization = `token ${GITHUB_TOKEN}`

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers,
        signal: AbortSignal.timeout(8000)
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, {
        headers,
        signal: AbortSignal.timeout(8000)
      })
    ])

    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error')

    const user: GitHubUser = await userRes.json()
    const repos: GitHubRepo[] = await reposRes.json()

    const ownRepos = repos.filter(r => !r.fork)
    const stars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0)
    const forks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0)

    const stats: GitHubStats = {
      avatar: user.avatar_url,
      username: user.login,
      name: user.name || user.login,
      stars,
      forks,
      repos: user.public_repos,
      followers: user.followers
    }

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200')
    res.status(200).json(stats)
  } catch (err) {
    const fallback: GitHubStats = {
      avatar: 'https://avatars.githubusercontent.com/u/125345731',
      username: 'Neilouo',
      name: 'Nan Sang',
      stars: 18,
      forks: 2,
      repos: 27,
      followers: 5
    }
    res.setHeader('X-Data-Source', 'fallback')
    res.status(200).json(fallback)
  }
}
