'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress (): JSX.Element {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[100] bg-gradient-to-r from-accent via-violet-500 to-emerald-500"
    />
  )
}
