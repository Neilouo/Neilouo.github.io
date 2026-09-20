import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

/**
 * Legacy route shim: the standalone CV page was removed.
 * Redirect old bookmarks/links to the resume section on the About page.
 */
export default function CurriculumVitaeRedirect (): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    void router.replace('/about#resume')
  }, [router])

  return (
    <div className="max-w-3xl mx-auto px-4 pt-32 pb-32 text-center">
      <p className="text-warm-600 dark:text-warm-300">
        页面已迁移，正在跳转到{' '}
        <a href="/about#resume" className="text-accent underline underline-offset-4">
          关于 · 简历
        </a>
        …
      </p>
    </div>
  )
}
