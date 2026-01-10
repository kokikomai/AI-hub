'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import TagInput from '@/components/TagInput'
import VoiceInput from '@/components/VoiceInput'
import MediaInput from '@/components/MediaInput'
import { addIdea, addKnowledge, addOutput, addNews } from '@/lib/mockData'
import { Lightbulb, BookOpen, Wrench, Newspaper, Video } from 'lucide-react'

type PostType = 'idea' | 'knowledge' | 'output' | 'news'

const postTypes = [
  {
    type: 'idea' as const,
    name: 'Idea',
    nameJa: 'アイデア',
    icon: Lightbulb,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    type: 'knowledge' as const,
    name: 'Knowledge',
    nameJa: 'ナレッジ',
    icon: BookOpen,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    type: 'output' as const,
    name: 'Output',
    nameJa: 'アウトプット',
    icon: Wrench,
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    type: 'news' as const,
    name: 'News',
    nameJa: 'ニュース',
    icon: Newspaper,
    color: 'orange',
    gradient: 'from-orange-500 to-amber-500',
  },
]

function PostForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = (searchParams.get('type') as PostType) || 'idea'

  const [selectedType, setSelectedType] = useState<PostType>(initialType)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Common fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [mediaUrl, setMediaUrl] = useState('')

  // Idea specific
  const [status, setStatus] = useState('検討中')

  // Knowledge specific
  const [promptTemplate, setPromptTemplate] = useState('')
  const [knowledgeCategory, setKnowledgeCategory] = useState('')
  const [recommendedTool, setRecommendedTool] = useState('')

  // Output specific
  const [toolType, setToolType] = useState('')
  const [toolUrl, setToolUrl] = useState('')

  // News specific
  const [sourceUrl, setSourceUrl] = useState('')
  const [newsCategory, setNewsCategory] = useState('')
  const [impactLevel, setImpactLevel] = useState(3)
  const [aiSummary, setAiSummary] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const userId = 'dev-user-id'

      switch (selectedType) {
        case 'idea':
          addIdea({
            title,
            description: description || null,
            tags,
            user_id: userId,
            status,
            media_url: mediaUrl || null,
          })
          break
        case 'knowledge':
          addKnowledge({
            title,
            description: description || null,
            tags,
            user_id: userId,
            prompt_template: promptTemplate || null,
            category: knowledgeCategory || null,
            recommended_tool: recommendedTool || null,
            media_url: mediaUrl || null,
          })
          break
        case 'output':
          addOutput({
            title,
            description: description || null,
            tags,
            user_id: userId,
            tool_type: toolType || null,
            tool_url: toolUrl || null,
            media_url: mediaUrl || null,
          })
          break
        case 'news':
          addNews({
            title,
            description: description || null,
            tags,
            user_id: userId,
            source_url: sourceUrl || null,
            category: newsCategory || null,
            impact_level: impactLevel,
            ai_summary: aiSummary || null,
            media_url: mediaUrl || null,
          })
          break
      }

      // Redirect based on type
      const redirectPath = selectedType === 'idea' ? '/ideas' :
                          selectedType === 'knowledge' ? '/knowledge' :
                          selectedType === 'output' ? '/output' : '/news'
      router.push(redirectPath)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const selectedTypeInfo = postTypes.find(t => t.type === selectedType)!

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          新規投稿
        </h1>

        {/* Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {postTypes.map((type) => (
            <button
              key={type.type}
              onClick={() => setSelectedType(type.type)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedType === type.type
                  ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
              }`}
            >
              <type.icon
                className={`w-6 h-6 mx-auto mb-2 ${
                  selectedType === type.type ? `text-${type.color}-500` : 'text-slate-400'
                }`}
              />
              <p className={`text-sm font-medium ${
                selectedType === type.type
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}>
                {type.nameJa}
              </p>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Common Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="投稿のタイトルを入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  説明（音声入力対応）
                </label>
                <VoiceInput
                  value={description}
                  onChange={setDescription}
                  placeholder="詳細な説明を入力。音声で話した内容をAI整形ボタンで見やすく整形できます"
                  rows={5}
                  contentType={selectedType}
                />
              </div>

              {/* Media Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    動画・メディア
                  </span>
                </label>
                <MediaInput
                  value={mediaUrl}
                  onChange={setMediaUrl}
                />
              </div>

              {/* Type-specific Fields */}
              {selectedType === 'idea' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    ステータス
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="検討中">検討中</option>
                    <option value="開発中">開発中</option>
                    <option value="完了">完了</option>
                  </select>
                </div>
              )}

              {selectedType === 'knowledge' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      プロンプトテンプレート
                    </label>
                    <textarea
                      value={promptTemplate}
                      onChange={(e) => setPromptTemplate(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="プロンプトのテンプレートを入力"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        カテゴリ
                      </label>
                      <select
                        value={knowledgeCategory}
                        onChange={(e) => setKnowledgeCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">選択してください</option>
                        <option value="ライティング">ライティング</option>
                        <option value="コーディング">コーディング</option>
                        <option value="画像生成">画像生成</option>
                        <option value="分析">分析</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        推奨ツール
                      </label>
                      <input
                        type="text"
                        value={recommendedTool}
                        onChange={(e) => setRecommendedTool(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="ChatGPT, Claude など"
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedType === 'output' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      ツールタイプ
                    </label>
                    <select
                      value={toolType}
                      onChange={(e) => setToolType(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">選択してください</option>
                      <option value="GPTs">GPTs</option>
                      <option value="Dify">Dify</option>
                      <option value="Chrome拡張">Chrome拡張</option>
                      <option value="Webツール">Webツール</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      ツールURL
                    </label>
                    <input
                      type="url"
                      value={toolUrl}
                      onChange={(e) => setToolUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://"
                    />
                  </div>
                </div>
              )}

              {selectedType === 'news' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        カテゴリ
                      </label>
                      <select
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">選択してください</option>
                        <option value="LLM">LLM</option>
                        <option value="画像生成">画像生成</option>
                        <option value="業界動向">業界動向</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        影響度
                      </label>
                      <select
                        value={impactLevel}
                        onChange={(e) => setImpactLevel(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value={1}>★</option>
                        <option value={2}>★★</option>
                        <option value={3}>★★★</option>
                        <option value={4}>★★★★</option>
                        <option value={5}>★★★★★</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      ソースURL
                    </label>
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      AI要約
                    </label>
                    <textarea
                      value={aiSummary}
                      onChange={(e) => setAiSummary(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      placeholder="ニュースの要約を入力"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  タグ
                </label>
                <TagInput
                  value={tags}
                  onChange={setTags}
                  category={selectedType}
                  placeholder="タグを入力してEnter、または下のタグをクリック"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading || !title}
              className={`px-6 py-3 bg-gradient-to-r ${selectedTypeInfo.gradient} text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? '投稿中...' : '投稿する'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default function PostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    }>
      <PostForm />
    </Suspense>
  )
}
