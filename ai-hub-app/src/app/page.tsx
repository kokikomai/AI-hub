'use client'

import { useState, useEffect, Suspense } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { Lightbulb, BookOpen, Wrench, Newspaper, ArrowRight, Heart, MessageCircle } from 'lucide-react'
import NetworkCanvas from '@/components/NetworkCanvas'
import { getIdeas, getKnowledge, getOutputs, getNews, saveProfile, getProfile, type MockIdea, type MockKnowledge, type MockOutput, type MockNews } from '@/lib/mockData'
import { createClient } from '@/lib/supabase/client'

const categories = [
  {
    name: 'Ideas',
    nameJa: 'アイデア',
    description: 'AIを活用した新しいビジネスアイデアやサービス提案',
    href: '/ideas',
    icon: Lightbulb,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
  },
  {
    name: 'Knowledge',
    nameJa: 'ナレッジ',
    description: 'プロンプトテンプレートやAI活用のベストプラクティス',
    href: '/knowledge',
    icon: BookOpen,
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
  },
  {
    name: 'Output',
    nameJa: 'アウトプット',
    description: 'GPTs、Dify、Chrome拡張などの制作物を共有',
    href: '/output',
    icon: Wrench,
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
  },
  {
    name: 'News',
    nameJa: 'ニュース',
    description: '最新のAI動向やリリース情報をキャッチアップ',
    href: '/news',
    icon: Newspaper,
    gradient: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
  },
]

function HomePageContent() {
  const [ideas, setIdeas] = useState<MockIdea[]>([])
  const [knowledgeList, setKnowledgeList] = useState<MockKnowledge[]>([])
  const [outputs, setOutputs] = useState<MockOutput[]>([])
  const [newsList, setNewsList] = useState<MockNews[]>([])

  useEffect(() => {
    // Supabaseのセッションを確認してプロフィールを同期
    const supabase = createClient()

    const syncProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const existingProfile = getProfile()

          // まだプロフィールが設定されていない、または名前が違う場合は更新
          if (!existingProfile || existingProfile.email !== user.email) {
            const name = user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        user.email?.split('@')[0] ||
                        'ユーザー'
            const avatarUrl = user.user_metadata?.avatar_url ||
                             user.user_metadata?.picture ||
                             null

            saveProfile({
              name,
              avatar_url: avatarUrl,
              email: user.email || null,
              is_onboarded: true,
            })

            // ページをリロードしてヘッダーを更新
            window.location.reload()
          }
        }
      } catch (e) {
        console.error('Failed to sync profile:', e)
      }
    }

    syncProfile()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        syncProfile()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    setIdeas(getIdeas().slice(0, 3))
    setKnowledgeList(getKnowledge().slice(0, 3))
    setOutputs(getOutputs().slice(0, 3))
    setNewsList(getNews().slice(0, 3))
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-32">
        <NetworkCanvas />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Hub
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            AIアイデア、ナレッジ、ツールを共有する
            <br className="hidden sm:block" />
            SNS Clubメンバー専用プラットフォーム
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/ideas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              探索を始める
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/post"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              投稿する
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              カテゴリ
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              4つのカテゴリでAIに関する情報を整理・共有しています
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group card-hover p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
              >
                <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <category.icon className={`w-6 h-6 ${category.textColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {category.nameJa}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                  <span className={category.textColor}>詳しく見る</span>
                  <ArrowRight className={`w-4 h-4 ${category.textColor}`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Content Section */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              最新の投稿
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              メンバーが共有した最新のコンテンツをチェック
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ideas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  Ideas
                </h3>
                <Link href="/ideas" className="text-sm text-blue-500 hover:underline">
                  すべて見る
                </Link>
              </div>
              <div className="space-y-3">
                {ideas.length ? (
                  ideas.map((idea) => (
                    <ContentCard key={idea.id} item={idea} type="ideas" />
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>

            {/* Knowledge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Knowledge
                </h3>
                <Link href="/knowledge" className="text-sm text-purple-500 hover:underline">
                  すべて見る
                </Link>
              </div>
              <div className="space-y-3">
                {knowledgeList.length ? (
                  knowledgeList.map((knowledge) => (
                    <ContentCard key={knowledge.id} item={knowledge} type="knowledge" />
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>

            {/* Output */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <Wrench className="w-5 h-5 text-green-500" />
                  Output
                </h3>
                <Link href="/output" className="text-sm text-green-500 hover:underline">
                  すべて見る
                </Link>
              </div>
              <div className="space-y-3">
                {outputs.length ? (
                  outputs.map((output) => (
                    <ContentCard key={output.id} item={output} type="output" />
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>

            {/* News */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <Newspaper className="w-5 h-5 text-orange-500" />
                  News
                </h3>
                <Link href="/news" className="text-sm text-orange-500 hover:underline">
                  すべて見る
                </Link>
              </div>
              <div className="space-y-3">
                {newsList.length ? (
                  newsList.map((news) => (
                    <ContentCard key={news.id} item={news} type="news" />
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500">
            &copy; 2026 AI Hub - SNS Club. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function ContentCard({ item, type }: { item: { id: string; title: string; description?: string | null; likes_count: number; comments_count: number; profiles?: { name: string | null; avatar_url: string | null } | null }; type: string }) {
  return (
    <Link
      href={`/${type}/${item.id}`}
      className="block p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
    >
      <h4 className="font-medium text-slate-900 dark:text-white mb-1 line-clamp-1">
        {item.title}
      </h4>
      {item.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
          {item.description}
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{item.profiles?.name || '匿名'}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {item.likes_count}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            {item.comments_count}
          </span>
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
      <p className="text-sm text-slate-500">まだ投稿がありません</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}
