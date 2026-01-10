'use client'

import { useState, useEffect, use } from 'react'
import Header from '@/components/Header'
import CommentSection from '@/components/CommentSection'
import LikeButton from '@/components/LikeButton'
import ShareButton from '@/components/ShareButton'
import { MediaPreview } from '@/components/MediaInput'
import { Lightbulb, ArrowLeft, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { getIdeaById, type MockIdea } from '@/lib/mockData'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function IdeaDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [idea, setIdea] = useState<MockIdea | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = getIdeaById(id)
    if (found) {
      setIdea(found)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-500">読み込み中...</p>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-slate-500 mb-4">アイデアが見つかりませんでした</p>
          <Link href="/ideas" className="text-blue-500 hover:underline">
            Ideas一覧に戻る
          </Link>
        </main>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    '検討中': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    '開発中': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    '完了': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/ideas"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Ideas一覧に戻る
        </Link>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Main Content */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            {/* Title First */}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {idea.title}
            </h1>

            {/* Status Badge (smaller) */}
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-blue-500" />
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[idea.status] || ''}`}>
                {idea.status}
              </span>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              {idea.profiles?.avatar_url ? (
                <img
                  src={idea.profiles.avatar_url}
                  alt={idea.profiles.name || ''}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {idea.profiles?.name || '匿名'}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(new Date(idea.created_at), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </p>
              </div>
            </div>

            {idea.description && (
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {idea.description}
              </p>
            )}

            {/* Media */}
            {idea.media_url && (
              <div className="mt-6">
                <MediaPreview url={idea.media_url} />
              </div>
            )}

            {/* Tags */}
            {idea.tags && idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {idea.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <LikeButton
                contentType="idea"
                contentId={id}
                initialLikesCount={idea.likes_count}
              />
              <ShareButton title={idea.title} />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {idea.comments_count} コメント
              </span>
            </div>
          </div>

          {/* Comments */}
          <CommentSection contentType="idea" contentId={id} />
        </div>
      </main>
    </div>
  )
}
