'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import GalleryCard from '@/components/GalleryCard'
import FilterBar from '@/components/FilterBar'
import { Wrench, Plus } from 'lucide-react'
import Link from 'next/link'
import { getOutputs, type MockOutput } from '@/lib/mockData'

const categoryOptions = [
  { value: 'GPTs', label: 'GPTs' },
  { value: 'Dify', label: 'Dify' },
  { value: 'Chrome拡張', label: 'Chrome拡張' },
  { value: 'Webツール', label: 'Webツール' },
]

function OutputContent() {
  const searchParams = useSearchParams()
  const [outputs, setOutputs] = useState<MockOutput[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let filtered = getOutputs()

    const category = searchParams.get('category')
    if (category) {
      filtered = filtered.filter(item => item.tool_type === category)
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

    setOutputs(filtered)
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
          basePath="/output"
        />
      </Suspense>

      {outputs.length > 0 ? (
        <div className={view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {outputs.map((output) => (
            <div key={output.id} className="stagger-item">
              <GalleryCard
                id={output.id}
                title={output.title}
                description={output.description}
                tags={output.tags}
                likes_count={output.likes_count}
                comments_count={output.comments_count}
                created_at={output.created_at}
                type="output"
                profile={output.profiles}
                tool_type={output.tool_type}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Wrench className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            まだアウトプットがありません
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            制作したツールを共有しましょう
          </p>
          <Link
            href="/post?type=output"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            アウトプットを投稿
          </Link>
        </div>
      )}
    </>
  )
}

export default function OutputPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Output
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                メンバーが制作したAIツール
              </p>
            </div>
          </div>
          <Link
            href="/post?type=output"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            投稿
          </Link>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-500">読み込み中...</div>}>
          <OutputContent />
        </Suspense>
      </main>
    </div>
  )
}
