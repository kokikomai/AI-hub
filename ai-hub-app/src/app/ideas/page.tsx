'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import GalleryCard from '@/components/GalleryCard'
import FilterBar from '@/components/FilterBar'
import { Lightbulb, Plus } from 'lucide-react'
import Link from 'next/link'
import { getIdeas, type MockIdea } from '@/lib/mockData'

const statusOptions = [
  { value: '検討中', label: '検討中' },
  { value: '開発中', label: '開発中' },
  { value: '完了', label: '完了' },
]

function IdeasContent() {
  const searchParams = useSearchParams()
  const [ideas, setIdeas] = useState<MockIdea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let filtered = getIdeas()

    // フィルター
    const status = searchParams.get('status')
    if (status) {
      filtered = filtered.filter(idea => idea.status === status)
    }

    const q = searchParams.get('q')
    if (q) {
      const query = q.toLowerCase()
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(query) ||
        (idea.description && idea.description.toLowerCase().includes(query))
      )
    }

    // ソート
    const sort = searchParams.get('sort')
    if (sort === 'popular') {
      filtered.sort((a, b) => b.likes_count - a.likes_count)
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setIdeas(filtered)
    setLoading(false)
  }, [searchParams])

  const view = searchParams.get('view') || 'grid'

  if (loading) {
    return <div className="text-center py-12 text-slate-500">読み込み中...</div>
  }

  return (
    <>
      <Suspense fallback={<div className="h-20" />}>
        <FilterBar
          statusOptions={statusOptions}
          basePath="/ideas"
        />
      </Suspense>

      {ideas.length > 0 ? (
        <div className={view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {ideas.map((idea) => (
            <div key={idea.id} className="stagger-item">
              <GalleryCard
                id={idea.id}
                title={idea.title}
                description={idea.description}
                tags={idea.tags}
                likes_count={idea.likes_count}
                comments_count={idea.comments_count}
                created_at={idea.created_at}
                type="ideas"
                profile={idea.profiles}
                status={idea.status}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            まだアイデアがありません
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            最初のアイデアを投稿してみましょう
          </p>
          <Link
            href="/post?type=idea"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            アイデアを投稿
          </Link>
        </div>
      )}
    </>
  )
}

export default function IdeasPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Ideas
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                AIを活用した新しいビジネスアイデア
              </p>
            </div>
          </div>
          <Link
            href="/post?type=idea"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            投稿
          </Link>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-500">読み込み中...</div>}>
          <IdeasContent />
        </Suspense>
      </main>
    </div>
  )
}
