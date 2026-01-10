'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import GalleryCard from '@/components/GalleryCard'
import FilterBar from '@/components/FilterBar'
import { Newspaper, Plus } from 'lucide-react'
import Link from 'next/link'
import { getNews, type MockNews } from '@/lib/mockData'

const categoryOptions = [
  { value: 'LLM', label: 'LLM' },
  { value: '画像生成', label: '画像生成' },
  { value: '業界動向', label: '業界動向' },
]

function NewsContent() {
  const searchParams = useSearchParams()
  const [news, setNews] = useState<MockNews[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let filtered = getNews()

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

    setNews(filtered)
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
          basePath="/news"
        />
      </Suspense>

      {news.length > 0 ? (
        <div className={view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {news.map((item) => (
            <div key={item.id} className="stagger-item">
              <GalleryCard
                id={item.id}
                title={item.title}
                description={item.description}
                tags={item.tags}
                likes_count={item.likes_count}
                comments_count={item.comments_count}
                created_at={item.created_at}
                type="news"
                profile={item.profiles}
                category={item.category}
                impact_level={item.impact_level}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <Newspaper className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            まだニュースがありません
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            AI関連のニュースを共有しましょう
          </p>
          <Link
            href="/post?type=news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            ニュースを投稿
          </Link>
        </div>
      )}
    </>
  )
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                News
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                最新のAI動向とニュース
              </p>
            </div>
          </div>
          <Link
            href="/post?type=news"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-lg hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            投稿
          </Link>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-500">読み込み中...</div>}>
          <NewsContent />
        </Suspense>
      </main>
    </div>
  )
}
