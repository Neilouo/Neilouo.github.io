import { type Repository } from '../types'

export default async function getGitHubRepoStar ({ username, repo }: { username: string, repo: number }): Promise<number> {
  let count = 0
  await fetch(`https://api.github.com/repos/${username}/${repo}`)
    .then(async response => await response.json())
    .then((repos: Repository) => {
      count = repos.stargazers_count
      return repos.stargazers_count
    }).catch(() => {
      return 0
    })
  return count
}
