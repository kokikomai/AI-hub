'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import GalleryCard from '@/components/GalleryCard'
import FilterBar from '@/components/FilterBar'
import { BookOpen, Plus } from 'lucide-react'
import Link from 'next/link'
import { getKnowledge, type MockKnowledge } from '@/lib/mockData'

const categoryOptions = [
  { value: 'ライティング', label: 'ライティング' },
  { value: 'コーディング', label: 'コーディング' },
  { value: '画像生成', label: '画像生成' },
  { value: '分析', label: '分析' },
]

function KnowledgeContent() {
  const searchParams = useSearchParams()
  const [knowledge, setKnowledge] = useState<MockKnowledge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let filtered = getKnowledge()

    const category = searchParams.get('category')
    if (category) {
      filtered = filtered.filter(item => item.category === category)
    }

    const q = searchParams.get('q')
    if (q) {
      const query = q.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      )
    }

    const sort = searchParams.get('sort')
    if (sort === 'popular') {
      filtered.sort((a, b) => b.likes_count - a.likes_count)
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setKnowledge(filtered)
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
          categoryOptions={categoryOptions}
          basePath="/knowledge"
        />
      </Suspense>

      {knowledge.length > 0 ? (
        <div className={view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {knowledge.map((item) => (
            <div key={item.id} className="stagger-item">
              <GalleryCard
                id={item.id}
                title={item.title}
                description={item.description}
                tags={item.tags}
                likes_count={item.likes_count}
                comments_count={item.comments_count}
                created_at={item.created_at}
                type="knowledge"
                profile={item.profiles}
                category={item.category}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            まだナレッジがありません
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            プロンプトやノウハウを共有しましょう
          </p>
          <Link
            href="/post?type=knowledge"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            ナレッジを投稿
          </Link>
        </div>
      )}
    </>
  )
}

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Knowledge
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                プロンプトやAI活用ノウハウ
              </p>
            </div>
          </div>
          <Link
            href="/post?type=knowledge"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            投稿
          </Link>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-500">読み込み中...</div>}>
          <KnowledgeContent />
        </Suspense>
      </main>
    </div>
  )
}
