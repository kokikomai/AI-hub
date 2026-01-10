'use client'

import { useState, useEffect, use } from 'react'
import Header from '@/components/Header'
import CommentSection from '@/components/CommentSection'
import LikeButton from '@/components/LikeButton'
import ShareButton from '@/components/ShareButton'
import { MediaPreview } from '@/components/MediaInput'
import { Wrench, ArrowLeft, Calendar, User, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { getOutputById, type MockOutput } from '@/lib/mockData'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function OutputDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [output, setOutput] = useState<MockOutput | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = getOutputById(id)
    if (found) {
      setOutput(found)
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

  if (!output) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-slate-500 mb-4">アウトプットが見つかりませんでした</p>
          <Link href="/output" className="text-green-500 hover:underline">
            Output一覧に戻る
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
          href="/output"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Output一覧に戻る
        </Link>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
              {/* Title First */}
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {output.title}
              </h1>

              {/* Tool Type Badge (smaller) */}
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4 text-green-500" />
                {output.tool_type && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {output.tool_type}
                  </span>
                )}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                {output.profiles?.avatar_url ? (
                  <img
                    src={output.profiles.avatar_url}
                    alt={output.profiles.name || ''}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {output.profiles?.name || '匿名'}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(new Date(output.created_at), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </p>
                </div>
              </div>

              {output.description && (
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  {output.description}
                </p>
              )}

              {/* Media */}
              {output.media_url && (
                <div className="mt-6">
                  <MediaPreview url={output.media_url} />
                </div>
              )}

              {output.tool_url && (
                <a
                  href={output.tool_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:opacity-90"
                >
                  <ExternalLink className="w-4 h-4" />
                  ツールを開く
                </a>
              )}

              {output.tags && output.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {output.tags.map((tag: string) => (
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
                  contentType="output"
                  contentId={id}
                  initialLikesCount={output.likes_count}
                />
                <ShareButton title={output.title} />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {output.comments_count} コメント
                </span>
              </div>
            </div>
          </div>

          <CommentSection contentType="output" contentId={id} />
        </div>
      </main>
    </div>
  )
}
