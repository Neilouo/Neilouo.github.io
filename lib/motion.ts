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
 * Parent spread for stagger groups — intentionally EMPTY.
 *
 * We do NOT use variants-based parent/child orchestration here:
 * with `whileInView + once: true`, children mounted LATER (e.g. expanding
 * a collapsed list) may never inherit the parent's "visible" variant and
 * stay stuck at opacity 0. Instead, every `item` observes the viewport
 * independently, so dynamically added items always animate in.
 */
export const stagger = {}

/**
 * Self-contained viewport reveal for list items.
 * Each item triggers on its own when scrolled into view, which also
 * produces a natural stagger between siblings.
 */
export const item = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45, ease: 'easeOut' }
}
