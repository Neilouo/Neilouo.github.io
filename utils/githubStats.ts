const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Neilouo'

export interface GitHubStats {
  avatar: string
  username: string
  name: string
  stars: number
  forks: number
  repos: number
  followers: number
}

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

const fallbackStats: GitHubStats = {
  avatar: 'https://avatars.githubusercontent.com/u/125345731',
  username: 'Neilouo',
  name: 'Nan Sang',
  stars: 18,
  forks: 2,
  repos: 27,
  followers: 5
}

export async function fetchGitHubStats (): Promise<GitHubStats> {
  try {
    const staticRes = await fetch('/github-stats.json', {
      signal: AbortSignal.timeout(8000)
    })
    if (staticRes.ok) {
      return await staticRes.json() as GitHubStats
    }
  } catch {
    // fall through to direct API
  }

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json'
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers,
        signal: AbortSignal.timeout(10000)
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, {
        headers,
        signal: AbortSignal.timeout(10000)
      })
    ])

    if (!userRes.ok || !reposRes.ok) {
      throw new Error(`GitHub API error: ${String(userRes.status)}/${String(reposRes.status)}`)
    }

    const user: GitHubUser = await userRes.json()
    const repos: GitHubRepo[] = await reposRes.json()

    const ownRepos = repos.filter(r => !r.fork)
    const stars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0)
    const forks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0)

    return {
      avatar: user.avatar_url,
      username: user.login,
      name: user.name || user.login,
      stars,
      forks,
      repos: user.public_repos,
      followers: user.followers
    }
  } catch (error) {
    console.error('Error fetching GitHub stats, using fallback:', error)
    return fallbackStats
  }
}
