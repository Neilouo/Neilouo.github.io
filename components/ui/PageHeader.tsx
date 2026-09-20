import React from 'react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { reveal } from '../../lib/motion'

interface PageHeaderProps {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
}

/**
 * Unified inner-page header (editorial serif title).
 * A+C fusion: warm structure, magazine-style display type.
 */
export default function PageHeader ({ eyebrow, title, description }: PageHeaderProps): JSX.Element {
  return (
    <motion.header {...reveal} className="mb-12">
      {eyebrow != null && eyebrow !== '' && (
        <p className="text-xs font-medium text-accent uppercase tracking-[0.2em] mb-3">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-4xl md:text-5xl font-semibold text-warm-900 dark:text-warm-50 tracking-tight">
        {title}
      </h1>
      {description != null && (
        <p className="mt-3 text-base md:text-lg text-warm-600 dark:text-warm-300 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </motion.header>
  )
}

interface SectionHeaderProps {
  title: React.ReactNode
  linkHref?: string
  linkText?: React.ReactNode
  className?: string
}

/** Home-page section header: serif title + optional "view all" link */
export function SectionHeader ({ title, linkHref, linkText, className }: SectionHeaderProps): JSX.Element {
  return (
    <div className={`flex items-end justify-between gap-4 mb-8 ${className ?? ''}`}>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-warm-900 dark:text-warm-50 tracking-tight">
        {title}
      </h2>
      {linkHref != null && (
        <Link
          href={linkHref}
          className="group inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline underline-offset-4 flex-shrink-0 pb-1"
        >
          {linkText}
          <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
