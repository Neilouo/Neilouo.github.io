import React, { useEffect, useState } from 'react'
import ProjectCard, { ProjectMeta } from './ProjectCard'
import ProjectCarousel from './ProjectCarousel'
import { useI18n } from './I18nProvider'

interface GitHubRepo {
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

interface GitHubProjectsProps {
  onActiveChange?: (index: number, repo: GitHubRepo) => void
  onLoaded?: (repos: GitHubRepo[]) => void
  variant?: 'grid' | 'carousel'
  autoPlay?: boolean
  intervalMs?: number
  limit?: number
}

const GitHubProjects: React.FC<GitHubProjectsProps> = ({
  onActiveChange,
  onLoaded,
  variant = 'grid',
  autoPlay = true,
  intervalMs = 4000,
  limit
}) => {
  const { t } = useI18n()
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('/api/github-repos')
        if (!response.ok) throw new Error('Failed to fetch repositories')
        const data = await response.json()
        onLoaded?.(data)
        setRepos(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    void fetchRepos()
  }, [onLoaded])

  if (loading) {
    const skeletonCount = limit || 6
    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {[...Array(skeletonCount)].map((_, i) => (
          <div key={i} className="h-48 rounded-card bg-warm-100 dark:bg-warm-900 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-warm-500 dark:text-warm-400">{t('load_failed')}: {error}</p>
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-warm-500 dark:text-warm-400">{t('no_projects')}</p>
      </div>
    )
  }

  const projects: ProjectMeta[] = repos.map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count || 0,
    language: repo.language,
    topics: repo.topics,
    updatedAt: repo.updated_at,
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    bannerUrl: repo.banner,
    author: repo.html_url.split('/')[3]
  }))

  if (variant === 'carousel') {
    return (
      <ProjectCarousel
        projects={projects}
        autoPlay={autoPlay}
        intervalMs={intervalMs}
        itemsPerView={3}
        onActiveChange={(index, project) => {
          setActiveIndex(index)
          const originalRepo = repos[index]
          if (originalRepo) onActiveChange?.(index, originalRepo)
        }}
      />
    )
  }

  const displayProjects = limit ? projects.slice(0, limit) : projects

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {displayProjects.map((project, index) => (
        <div
          key={project.id}
          className="h-full"
          onMouseEnter={() => {
            setActiveIndex(index)
            onActiveChange?.(index, repos[index])
          }}
        >
          <ProjectCard project={project} index={index} />
        </div>
      ))}
    </div>
  )
}

export default GitHubProjects
