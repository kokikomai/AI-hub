'use client'

import { useState, useEffect, use } from 'react'
import Header from '@/components/Header'
import CommentSection from '@/components/CommentSection'
import LikeButton from '@/components/LikeButton'
import ShareButton from '@/components/ShareButton'
import { MediaPreview } from '@/components/MediaInput'
import { Newspaper, ArrowLeft, Calendar, User, ExternalLink, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { getNewsById, type MockNews } from '@/lib/mockData'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function NewsDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [news, setNews] = useState<MockNews | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = getNewsById(id)
    if (found) {
      setNews(found)
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

  if (!news) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-slate-500 mb-4">ニュースが見つかりませんでした</p>
          <Link href="/news" className="text-orange-500 hover:underline">
            News一覧に戻る
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          News一覧に戻る
        </Link>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
              {/* Title First */}
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {news.title}
              </h1>

              {/* Category & Impact Badge (smaller) */}
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-4 h-4 text-orange-500" />
                {news.category && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                    {news.category}
                  </span>
                )}
                {news.impact_level && (
                  <span className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: news.impact_level }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </span>
                )}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                {news.profiles?.avatar_url ? (
                  <img
                    src={news.profiles.avatar_url}
                    alt={news.profiles.name || ''}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {news.profiles?.name || '匿名'}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(new Date(news.created_at), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </p>
                </div>
              </div>

              {news.ai_summary && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl mb-6">
                  <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-2">
                    AI要約
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-200">
                    {news.ai_summary}
                  </p>
                </div>
              )}

              {news.description && (
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  {news.description}
                </p>
              )}

              {/* Media */}
              {news.media_url && (
                <div className="mt-6">
                  <MediaPreview url={news.media_url} />
                </div>
              )}

              {news.source_url && (
                <a
                  href={news.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:opacity-90"
                >
                  <ExternalLink className="w-4 h-4" />
                  元記事を読む
                </a>
              )}

              {news.tags && news.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {news.tags.map((tag: string) => (
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
                  contentType="news"
                  contentId={id}
                  initialLikesCount={news.likes_count}
                />
                <ShareButton title={news.title} />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {news.comments_count} コメント
                </span>
              </div>
            </div>
          </div>

          <CommentSection contentType="news" contentId={id} />
        </div>
      </main>
    </div>
  )
}
