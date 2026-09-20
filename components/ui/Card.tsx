import React from 'react'
import clsx from 'clsx'

interface BentoCardProps {
  className?: string
  children: React.ReactNode
  as?: 'div' | 'article' | 'section'
  hover?: boolean
}

/**
 * Bento grid tile. Warm translucent surface with optional hover lift.
 * Compose freely inside bento grids: `md:col-span-2`, `row-span-2`, etc.
 */
export function BentoCard ({
  className,
  children,
  as: Tag = 'div',
  hover = false
}: BentoCardProps): JSX.Element {
  return (
    <Tag
      className={clsx(
        'rounded-card border border-warm-100 dark:border-warm-800',
        'bg-white/80 dark:bg-warm-950/80 backdrop-blur-sm shadow-card',
        hover === true &&
          'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-accent/25 dark:hover:border-accent/25',
        className
      )}
    >
      {children}
    </Tag>
  )
}

interface BentoLabelProps {
  children: React.ReactNode
  className?: string
}

/** Small uppercase eyebrow used inside bento tiles */
export function BentoLabel ({ children, className }: BentoLabelProps): JSX.Element {
  return (
    <span
      className={clsx(
        'text-xs font-medium text-accent uppercase tracking-wider',
        className
      )}
    >
      {children}
    </span>
  )
}
