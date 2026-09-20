export const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

export const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: 'easeOut' }
}

/**
 * Parent/child stagger orchestration (variants-driven).
 * Parent spreads {...stagger}, children spread {...item}.
 * Children must NOT set their own initial/animate props —
 * they inherit the orchestration state names from the parent.
 */
export const stagger = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-80px' },
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } }
  }
}

export const item = {
  variants: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  }
}
