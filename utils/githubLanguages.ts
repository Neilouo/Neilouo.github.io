export interface LanguageData {
  name: string
  bytes: number
  percentage: number
}

export interface LanguageResult {
  languages: LanguageData[]
  source: 'github' | 'fallback'
}

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'NanSang2000'

type LanguageBytes = Record<string, number>

// Fallback data when GitHub API is unavailable
const FALLBACK_LANGUAGES: LanguageData[] = [
  { name: 'TypeScript', bytes: 0, percentage: 35 },
  { name: 'JavaScript', bytes: 0, percentage: 25 },
  { name: 'Python', bytes: 0, percentage: 20 },
  { name: 'Go', bytes: 0, percentage: 8 },
  { name: 'Java', bytes: 0, percentage: 7 },
  { name: 'HTML', bytes: 0, percentage: 5 }
]

interface GitHubApiRepo {
  name: string
  fork: boolean
}

export async function fetchGitHubLanguages (): Promise<LanguageResult> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json'
    }

    // 1. Fetch user's public repos
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&type=public`,
      { headers, signal: AbortSignal.timeout(10000) }
    )
    if (!reposRes.ok) throw new Error(`GitHub repos API ${String(reposRes.status)}`)
    const repos: GitHubApiRepo[] = await reposRes.json()

    // 2. Fetch language bytes for each non-fork repo (concurrency limited)
    const nonForkRepos = repos.filter(r => !r.fork).slice(0, 30)
    const aggregated: LanguageBytes = {}

    await Promise.all(nonForkRepos.map(async (repo) => {
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
    }))

    // 3. Calculate percentages
    const totalBytes = Object.values(aggregated).reduce((a, b) => a + b, 0)
    if (totalBytes === 0) {
      return { languages: FALLBACK_LANGUAGES, source: 'fallback' }
    }

    const sorted: LanguageData[] = Object.entries(aggregated)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Math.round((bytes / totalBytes) * 100)
      }))

    return { languages: sorted, source: 'github' }
  } catch (error) {
    console.error('Error fetching GitHub languages, using fallback:', error)
    return { languages: FALLBACK_LANGUAGES, source: 'fallback' }
  }
}
