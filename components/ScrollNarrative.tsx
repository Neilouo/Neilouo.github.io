'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, type MotionProps } from 'framer-motion'

export function GradientHeading ({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const hue = useTransform(scrollYProgress, [0, 1], [0, 60])
  const hueSpring = useSpring(hue, { stiffness: 80, damping: 20 })
  const bg = useTransform(hueSpring, (h) => `linear-gradient(90deg, hsl(${220 + h} 80% 55%), hsl(${265 + h} 80% 60%), hsl(${165 + h} 70% 45%))`)
  return (
    <motion.h2
      ref={ref}
      style={{ backgroundImage: bg, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}
      className={className ?? 'text-3xl md:text-4xl font-bold tracking-tight'}
    >
      {children}
    </motion.h2>
  )
}

export function SectionDivider () {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 origin-left bg-gradient-to-r from-transparent via-accent/30 to-transparent"
      />
    </div>
  )
}

export function ScrollGradientBg () {
  const { scrollYProgress } = useScroll()
  const hue = useTransform(scrollYProgress, [0, 0.5, 1], [220, 265, 165])
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0.06, 0.06, 0])
  const bg = useTransform(hue, (h) => `radial-gradient(ellipse 80% 50% at 50% 0%, hsl(${h} 80% 50% / 1), transparent 70%)`)
  return (
    <motion.div
      style={{ backgroundImage: bg, opacity }}
      className="fixed inset-0 -z-20 pointer-events-none"
    />
  )
}
