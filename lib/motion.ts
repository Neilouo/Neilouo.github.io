export const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

export const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
}

export const stagger = {
  initial: {},
  whileInView: 'animate',
  viewport: { once: true, margin: '-80px' },
  transition: { staggerChildren: 0.08 }
}

export const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
}

export const slideInRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
}

export const staggerCards = {
  initial: {},
  whileInView: 'animate',
  viewport: { once: true, margin: '-60px' },
  transition: { staggerChildren: 0.15 }
}

export const cardItem = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
}

export const gradientReveal = {
  initial: { opacity: 0, scale: 0.98 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
}
