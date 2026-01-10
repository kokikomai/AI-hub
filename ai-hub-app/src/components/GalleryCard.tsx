'use client'

import Link from 'next/link'
import { Heart, MessageCircle, Copy, Users, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

interface GalleryCardProps {
  id: string
  title: string
  description?: string | null
  image_url?: string | null
  tags?: string[] | null
  likes_count: number
  comments_count: number
  created_at: string
  type: 'ideas' | 'knowledge' | 'output' | 'news'
  profile?: {
    name: string | null
    avatar_url: string | null
  } | null
  // カテゴリ固有のフィールド
  status?: string | null
  category?: string | null
  tool_type?: string | null
  copy_count?: number
  users_count?: number
  impact_level?: number | null
}

const typeColors = {
  ideas: {
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    accent: 'text-blue-500',
  },
  knowledge: {
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    accent: 'text-purple-500',
  },
  output: {
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    accent: 'text-green-500',
  },
  news: {
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    accent: 'text-orange-500',
  },
}

export default function GalleryCard({
  id,
  title,
  description,
  image_url,
  tags,
  likes_count,
  comments_count,
  created_at,
  type,
  profile,
  status,
  category,
  tool_type,
  copy_count,
  users_count,
  impact_level,
}: GalleryCardProps) {
  const colors = typeColors[type]

  return (
    <Link
      href={`/${type}/${id}`}
      className="group block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden card-hover"
    >
      {/* Image */}
      {image_url && (
        <div className="aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {status && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
              {status}
            </span>
          )}
          {category && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
              {category}
            </span>
          )}
          {tool_type && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
              {tool_type}
            </span>
          )}
          {impact_level && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
              影響度: {'★'.repeat(impact_level)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-slate-500">+{tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          {/* Author */}
          <div className="flex items-center gap-2">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name || ''}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            )}
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {profile?.name || '匿名'}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {likes_count}
            </span>
            {typeof copy_count === 'number' && (
              <span className="flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" />
                {copy_count}
              </span>
            )}
            {typeof users_count === 'number' && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {users_count}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {comments_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
