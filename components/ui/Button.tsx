import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonBaseProps {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent-solid text-white hover:bg-accent-solid-hover shadow-sm hover:shadow-card-hover hover:-translate-y-px',
  secondary:
    'border border-warm-200 dark:border-warm-700 text-warm-700 dark:text-warm-200 bg-white/60 dark:bg-warm-900/60 hover:border-accent/40 hover:text-accent dark:hover:text-accent',
  ghost:
    'text-warm-600 dark:text-warm-300 hover:text-accent dark:hover:text-accent hover:bg-accent/5'
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2'
}

const baseClasses =
  'inline-flex items-center justify-center font-medium rounded-card transition-all duration-200 select-none'

interface ButtonAsLink extends ButtonBaseProps {
  href: string
  external?: boolean
  onClick?: never
  type?: never
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never
  external?: never
  onClick?: () => void
  type?: 'button' | 'submit'
}

export type ButtonProps = ButtonAsLink | ButtonAsButton

export default function Button (props: ButtonProps): JSX.Element {
  const { variant = 'primary', size = 'md', className, children } = props
  const classes = clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)

  if (props.href != null) {
    const { href, external } = props
    if (external === true) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={props.type ?? 'button'} onClick={props.onClick} className={classes}>
      {children}
    </button>
  )
}
