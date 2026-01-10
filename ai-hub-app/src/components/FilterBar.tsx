'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Grid3X3, List, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  statusOptions?: FilterOption[]
  categoryOptions?: FilterOption[]
  sortOptions?: FilterOption[]
  defaultView?: 'grid' | 'list'
  basePath: string
}

export default function FilterBar({
  statusOptions,
  categoryOptions,
  sortOptions = [
    { value: 'newest', label: '新着順' },
    { value: 'popular', label: '人気順' },
  ],
  defaultView = 'grid',
  basePath,
}: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [view, setView] = useState<'grid' | 'list'>(
    (searchParams.get('view') as 'grid' | 'list') || defaultView
  )
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    router.push(`${basePath}?${newParams.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL({ q: search })
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="キーワードで検索..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {statusOptions && (
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              updateURL({ status: e.target.value })
            }}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべてのステータス</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {categoryOptions && (
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              updateURL({ category: e.target.value })
            }}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべてのカテゴリ</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value)
            updateURL({ sort: e.target.value })
          }}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* View Toggle */}
        <div className="flex ml-auto rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => {
              setView('grid')
              updateURL({ view: 'grid' })
            }}
            className={`p-2 ${
              view === 'grid'
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'bg-white dark:bg-slate-800 text-slate-500'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setView('list')
              updateURL({ view: 'list' })
            }}
            className={`p-2 ${
              view === 'list'
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'bg-white dark:bg-slate-800 text-slate-500'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
