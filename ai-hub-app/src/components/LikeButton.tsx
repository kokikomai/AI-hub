'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { getLikes, toggleLike } from '@/lib/mockData'

interface LikeButtonProps {
  contentType: 'idea' | 'knowledge' | 'output' | 'news'
  contentId: string
  initialLikesCount: number
}

export default function LikeButton({ contentType, contentId, initialLikesCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [loading, setLoading] = useState(false)
  const [animating, setAnimating] = useState(false)
  const userId = 'dev-user-id'

  useEffect(() => {
    checkLiked()
  }, [contentId])

  const checkLiked = () => {
    const existingLike = getLikes(contentType, contentId, userId)
    setLiked(!!existingLike)
  }

  const handleLike = () => {
    if (loading) return

    setLoading(true)
    try {
      const isNowLiked = toggleLike(contentType, contentId, userId)
      setLiked(isNowLiked)
      setLikesCount(prev => isNowLiked ? prev + 1 : prev - 1)

      // Trigger animation only when liking
      if (isNowLiked) {
        setAnimating(true)
        setTimeout(() => setAnimating(false), 400)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`btn-press flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
        liked
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
      }`}
    >
      <Heart className={`w-5 h-5 transition-transform ${liked ? 'fill-current' : ''} ${animating ? 'animate-heartBeat' : ''}`} />
      <span className="font-medium">{likesCount}</span>
    </button>
  )
}
