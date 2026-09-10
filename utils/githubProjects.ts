import { fallbackRepos } from './fallbackRepos'

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Neilouo'

export interface ProjectRepo {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string | null
  stargazers_count: number
  language: string | null
  topics: string[]
  updated_at: string
  banner: string
  forks_count?: number
}

interface GitHubApiRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  fork: boolean
  archived: boolean
  disabled: boolean
  visibility: string
}

const languageColors: Record<string, string> = {
  JavaScript: 'f7df1e',
  TypeScript: '3178c6',
  Python: '3776ab',
  Go: '00add8',
  Java: 'ed8b00',
  'C++': '00599c',
  HTML: 'e34f26',
  CSS: '1572b6',
  React: '61dafb',
  Vue: '4fc08d',
  PHP: '777bb4',
  Ruby: 'cc342d',
  Rust: 'dea584',
  Swift: 'fa7343',
  Kotlin: '7f52ff',
  'Jupyter Notebook': 'da5b0b'
}

function generateBanner (repo: GitHubApiRepo): string {
  const language = repo.language || 'Code'
  const color = languageColors[language] || '586069'
  const username = repo.full_name.split('/')[0]
  return `https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${repo.name}&theme=default&show_owner=false&bg_color=ffffff&title_color=2f80ed&text_color=333333&icon_color=${color}`
}

function transformRepos (repos: GitHubApiRepo[]): ProjectRepo[] {
  return repos
    .filter(repo =>
      !repo.fork &&
      !repo.archived &&
      !repo.disabled &&
      repo.visibility === 'public' &&
      repo.description &&
      repo.name !== GITHUB_USERNAME
    )
    .slice(0, 12)
    .map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || '暂无描述',
      html_url: repo.html_url,
      homepage: repo.homepage,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      topics: repo.topics,
      updated_at: repo.updated_at,
      banner: generateBanner(repo)
    }))
}

function getFallback (): ProjectRepo[] {
  return fallbackRepos.map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description || '暂无描述',
    html_url: repo.html_url,
    homepage: repo.homepage,
    stargazers_count: repo.stargazers_count,
    language: repo.language,
    topics: repo.topics,
    updated_at: repo.updated_at,
    banner: repo.banner
  }))
}

export async function fetchGitHubProjects (): Promise<ProjectRepo[]> {
  try {
    const staticRes = await fetch('/github-projects.json', {
      signal: AbortSignal.timeout(8000)
    })
    if (staticRes.ok) {
      const data = await staticRes.json() as { projects: ProjectRepo[] }
      if (data.projects?.length > 0) return data.projects
    }
  } catch {
    // fall through to direct API
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        },
        signal: AbortSignal.timeout(10000)
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${String(response.status)}`)
    }

    const repos: GitHubApiRepo[] = await response.json()
    const projects = transformRepos(repos)
    return projects.length > 0 ? projects : getFallback()
  } catch (error) {
    console.error('Error fetching GitHub repos, using fallback:', error)
    return getFallback()
  }
}
