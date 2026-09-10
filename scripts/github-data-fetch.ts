/**
 * 构建时抓取 GitHub 仓库列表 + 用户统计，输出:
 *   public/github-projects.json  — 精选仓库列表（供 GitHubProjects 组件使用）
 *   public/github-stats.json     — star/fork/repo/follower 统计（供 GitHubStatsCard 组件使用）
 * 用法: pnpm run fetch:github
 * 在 next build / next dev 前自动运行，保证静态导出站点（GitHub Pages）可用。
 * 定时刷新由 .github/workflows/refresh-data.yml 每日触发。
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { fallbackRepos } from '../utils/fallbackRepos'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'public')
const SCRIPT_TIMEOUT_MS = 120000

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Neilouo'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

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

interface GitHubUser {
  avatar_url: string
  login: string
  name: string | null
  public_repos: number
  followers: number
}

interface ProjectRepo {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  banner: string
}

interface GitHubStats {
  avatar: string
  username: string
  name: string
  stars: number
  forks: number
  repos: number
  followers: number
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

function getFallbackProjects (): ProjectRepo[] {
  return fallbackRepos.map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description || '暂无描述',
    html_url: repo.html_url,
    homepage: repo.homepage,
    stargazers_count: repo.stargazers_count,
    forks_count: 0,
    language: repo.language,
    topics: repo.topics,
    updated_at: repo.updated_at,
    banner: repo.banner
  }))
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

async function main (): Promise<void> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Website-NanSang2000'
  }
  if (GITHUB_TOKEN) headers.Authorization = `token ${GITHUB_TOKEN}`

  let projects: ProjectRepo[]
  let stats: GitHubStats

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers,
        signal: AbortSignal.timeout(15000)
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`, {
        headers,
        signal: AbortSignal.timeout(15000)
      })
    ])

    if (!userRes.ok || !reposRes.ok) {
      throw new Error(`GitHub API error: ${String(userRes.status)}/${String(reposRes.status)}`)
    }

    const user: GitHubUser = await userRes.json()
    const repos: GitHubApiRepo[] = await reposRes.json()

    const transformed = transformRepos(repos)
    projects = transformed.length > 0 ? transformed : getFallbackProjects()

    const ownRepos = repos.filter(r => !r.fork)
    const stars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0)
    const forks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0)

    stats = {
      avatar: user.avatar_url,
      username: user.login,
      name: user.name || user.login,
      stars,
      forks,
      repos: user.public_repos,
      followers: user.followers
    }

    console.log(`[github-data] fetched ${projects.length} projects, ${stars} stars, ${user.public_repos} repos`)
  } catch (e) {
    console.warn('[github-data] fetch failed, using fallback:', e instanceof Error ? e.message : e)
    projects = getFallbackProjects()
    stats = fallbackStats
  }

  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(join(OUT_DIR, 'github-projects.json'), JSON.stringify({ projects }, null, 2), 'utf8')
  writeFileSync(join(OUT_DIR, 'github-stats.json'), JSON.stringify(stats, null, 2), 'utf8')
  console.log('[github-data] wrote public/github-projects.json and public/github-stats.json')
}

const globalTimeoutId = setTimeout(() => {
  console.error(`[github-data] Global timeout ${SCRIPT_TIMEOUT_MS}ms, force exit.`)
  process.exit(1)
}, SCRIPT_TIMEOUT_MS)

main()
  .then(() => {
    clearTimeout(globalTimeoutId)
    process.exit(0)
  })
  .catch((e) => {
    clearTimeout(globalTimeoutId)
    console.error(e)
    process.exit(1)
  })
