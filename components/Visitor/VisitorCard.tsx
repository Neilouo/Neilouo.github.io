'use client'

import React, { useEffect, useState } from 'react'
import Visitors from './index'

interface VisitorCardProps {
  className?: string
  showTitle?: boolean
  titleText?: string
  showAnimation?: boolean
  compact?: boolean
}

const VisitorCard: React.FC<VisitorCardProps> = ({
  className = '',
  showTitle = true,
  titleText = 'Visitors',
  showAnimation = true,
  compact = false
}) => {
  const { count, loading, error } = Visitors()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`${className}`}>
        <p className="text-sm text-warm-400">---</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <p className="text-sm text-warm-400">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <p className="text-sm text-warm-400">{error}</p>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <p className="text-xs text-warm-400 dark:text-warm-500 uppercase tracking-wider mb-1">
          {titleText}
        </p>
      )}
      <p className="text-2xl font-semibold text-warm-800 dark:text-warm-100">
        {count.toLocaleString()}
      </p>
      <p className="text-xs text-warm-400 dark:text-warm-500 mt-1">Total Visitors</p>
    </div>
  )
}

export default VisitorCard
