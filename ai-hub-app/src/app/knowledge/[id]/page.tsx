'use client'

import { useState, useEffect, use } from 'react'
import Header from '@/components/Header'
import CommentSection from '@/components/CommentSection'
import LikeButton from '@/components/LikeButton'
import ShareButton from '@/components/ShareButton'
import { MediaPreview } from '@/components/MediaInput'
import { BookOpen, ArrowLeft, Calendar, User, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { getKnowledgeById, type MockKnowledge } from '@/lib/mockData'

interface PageProps {
  params: Promise<{ id: string }>
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 text-green-500" />
          <span className="font-medium text-green-600">コピー済み</span>
        </>
      ) : (
        <>
          <Copy className="w-5 h-5" />
          <span className="font-medium">コピー</span>
        </>
      )}
    </button>
  )
}

export default function KnowledgeDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [knowledge, setKnowledge] = useState<MockKnowledge | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = getKnowledgeById(id)
    if (found) {
      setKnowledge(found)
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

  if (!knowledge) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-slate-500 mb-4">ナレッジが見つかりませんでした</p>
          <Link href="/knowledge" className="text-purple-500 hover:underline">
            Knowledge一覧に戻る
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
          href="/knowledge"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Knowledge一覧に戻る
        </Link>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            {/* Title First */}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {knowledge.title}
            </h1>

            {/* Category Badge (smaller) */}
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-purple-500" />
              {knowledge.category && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {knowledge.category}
                </span>
              )}
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              {knowledge.profiles?.avatar_url ? (
                <img
                  src={knowledge.profiles.avatar_url}
                  alt={knowledge.profiles.name || ''}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {knowledge.profiles?.name || '匿名'}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(new Date(knowledge.created_at), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </p>
              </div>
            </div>

            {knowledge.description && (
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap mb-6">
                {knowledge.description}
              </p>
            )}

            {/* Media */}
            {knowledge.media_url && (
              <div className="mb-6">
                <MediaPreview url={knowledge.media_url} />
              </div>
            )}

            {/* Prompt Template */}
            {knowledge.prompt_template && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    プロンプトテンプレート
                  </h3>
                  <CopyButton text={knowledge.prompt_template} />
                </div>
                <div className="relative">
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                    {knowledge.prompt_template}
                  </pre>
                </div>
              </div>
            )}

            {knowledge.recommended_tool && (
              <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                推奨ツール: <span className="font-medium text-slate-900 dark:text-white">{knowledge.recommended_tool}</span>
              </div>
            )}

            {knowledge.tags && knowledge.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {knowledge.tags.map((tag: string) => (
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
                contentType="knowledge"
                contentId={id}
                initialLikesCount={knowledge.likes_count}
              />
              <ShareButton title={knowledge.title} />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {knowledge.comments_count} コメント
              </span>
            </div>
          </div>

          <CommentSection contentType="knowledge" contentId={id} />
        </div>
      </main>
    </div>
  )
}
