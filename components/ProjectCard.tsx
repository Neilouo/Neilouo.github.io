'use client'

import React from 'react'
import { AiFillStar, AiOutlineGithub, AiOutlineLink } from 'react-icons/ai'
import { BiGitRepoForked } from 'react-icons/bi'

export interface ProjectMeta {
  id: number
  name: string
  description: string
  stars: number
  forks: number
  language?: string | null
  topics?: string[]
  updatedAt: string
  htmlUrl: string
  homepage?: string | null
  bannerUrl?: string
  author?: string
}

interface ProjectCardProps {
  project: ProjectMeta
  index?: number
}

const languageColors: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  Go: '#00add8',
  Java: '#ed8b00',
  'C++': '#00599c',
  HTML: '#e34f26',
  CSS: '#1572b6',
  Rust: '#dea584',
  Swift: '#fa7343'
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const color = project.language ? (languageColors[project.language] || '#6b7280') : '#6b7280'

  const formatDate = (date: string) => new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <article className="group rounded-card border border-warm-100 dark:border-warm-800 bg-white dark:bg-warm-950 hover:border-accent/30 dark:hover:border-accent/30 hover:shadow-card-hover transition-all overflow-hidden h-full flex flex-col">
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-warm-900 dark:text-warm-50 tracking-tight leading-tight font-mono truncate">
            {project.name}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {project.language && (
              <span className="inline-flex items-center gap-1 text-xs text-warm-500 dark:text-warm-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                {project.language}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-warm-600 dark:text-warm-300 leading-relaxed line-clamp-2 flex-1">
          {project.description}
        </p>

        {project.topics && project.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.topics.slice(0, 4).map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-xs bg-warm-50 dark:bg-warm-900 text-warm-600 dark:text-warm-300 border border-warm-100 dark:border-warm-800">
                {t}
              </span>
            ))}
            {project.topics.length > 4 && (
              <span className="px-2 py-0.5 rounded text-xs text-warm-400">
                +{project.topics.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-warm-50 dark:border-warm-900">
          <div className="flex items-center gap-3 text-xs text-warm-400 dark:text-warm-500">
            {project.stars > 0 && (
              <span className="inline-flex items-center gap-1">
                <AiFillStar className="text-amber-400" /> {project.stars}
              </span>
            )}
            {project.forks > 0 && (
              <span className="inline-flex items-center gap-1">
                <BiGitRepoForked /> {project.forks}
              </span>
            )}
            <span>{formatDate(project.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-warm-900 dark:bg-warm-700 text-white hover:bg-warm-800 dark:hover:bg-warm-600 transition-colors"
            >
              <AiOutlineGithub /> GitHub
            </a>
            {project.homepage && (
              <a
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent text-white hover:bg-accent-dark transition-colors"
              >
                <AiOutlineLink /> Live
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
