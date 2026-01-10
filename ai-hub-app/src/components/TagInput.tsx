'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

// カテゴリ別のタグ候補
const tagSuggestions: Record<string, string[]> = {
  idea: [
    'ChatGPT', 'Claude', 'GPT-4', 'Gemini', 'LLM',
    '業務効率化', '自動化', 'コスト削減', '生産性向上',
    'マーケティング', '営業支援', 'カスタマーサポート',
    '分析', 'レポート', 'データ活用', 'AI活用',
  ],
  knowledge: [
    'プロンプト', 'テンプレート', 'ベストプラクティス',
    'ChatGPT', 'Claude', 'Midjourney', 'DALL-E',
    'ライティング', 'コーディング', '画像生成', '翻訳',
    '要約', '分析', 'アイデア出し', 'ブレスト',
  ],
  output: [
    'GPTs', 'Dify', 'Chrome拡張', 'Webツール',
    'API', 'ノーコード', 'ローコード', 'オープンソース',
    '無料', '有料', 'ベータ版', '正式版',
  ],
  news: [
    'OpenAI', 'Anthropic', 'Google', 'Meta', 'Microsoft',
    'LLM', '画像生成', '動画生成', '音声',
    'リリース', 'アップデート', '買収', '提携',
    '規制', 'セキュリティ', '研究', '論文',
  ],
}

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  category?: 'idea' | 'knowledge' | 'output' | 'news'
  placeholder?: string
}

export default function TagInput({ value, onChange, category = 'idea', placeholder = 'タグを追加...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = tagSuggestions[category] || tagSuggestions.idea

  // 入力値でフィルタリングされた候補
  const filteredSuggestions = suggestions.filter(
    tag => !value.includes(tag) && tag.toLowerCase().includes(inputValue.toLowerCase())
  )

  const addTag = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag])
    }
    setInputValue('')
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue.trim())
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="space-y-3">
      {/* 選択されたタグ */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-blue-900 dark:hover:text-blue-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 入力フィールド */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* タグ候補 */}
      <div>
        <p className="text-xs text-slate-500 mb-2">おすすめタグ（クリックで追加）</p>
        <div className="flex flex-wrap gap-2">
          {(showSuggestions ? filteredSuggestions : suggestions.filter(tag => !value.includes(tag)).slice(0, 8)).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
