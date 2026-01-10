'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Wand2 } from 'lucide-react'

type ContentType = 'idea' | 'knowledge' | 'output' | 'news' | 'general'

interface VoiceInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  contentType?: ContentType
}

// コンテンツタイプ別の整形プロンプト
const formatPrompts: Record<ContentType, { intro: string; structure: string[] }> = {
  idea: {
    intro: 'このアイデアは',
    structure: ['背景・課題', '解決策', '期待される効果', '実現方法']
  },
  knowledge: {
    intro: 'このナレッジでは',
    structure: ['概要', '使い方', 'ポイント', '注意点']
  },
  output: {
    intro: 'このツールは',
    structure: ['概要', '主な機能', '使用方法', '活用シーン']
  },
  news: {
    intro: 'このニュースは',
    structure: ['概要', 'ポイント', '影響・意義', '今後の展望']
  },
  general: {
    intro: '',
    structure: []
  }
}

export default function VoiceInput({
  value,
  onChange,
  placeholder = 'テキストを入力...',
  rows = 4,
  contentType = 'general'
}: VoiceInputProps) {
  const [isFormatting, setIsFormatting] = useState(false)
  const [formatMode, setFormatMode] = useState<'simple' | 'structured'>('simple')

  // シンプル整形（基本的な文章整形）
  const simpleFormat = (text: string): string => {
    let formatted = text
      .replace(/\s+/g, ' ')
      .trim()

    // 文末に句点がない場合は追加
    if (formatted && !formatted.match(/[。！？]$/)) {
      formatted += '。'
    }

    // 重複読点を削除
    formatted = formatted.replace(/、{2,}/g, '、')

    // 長い文章は段落分け（3文ごと）
    const sentences = formatted.split(/([。！？])/)
    let result = ''
    let sentenceCount = 0

    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i]
      const punctuation = sentences[i + 1] || ''
      if (sentence.trim()) {
        result += sentence.trim() + punctuation
        sentenceCount++
        if (sentenceCount % 3 === 0 && i < sentences.length - 2) {
          result += '\n\n'
        }
      }
    }

    return result.trim()
  }

  // 構造化整形（コンテンツタイプに応じた整形）
  const structuredFormat = (text: string): string => {
    const cleanText = text.replace(/\s+/g, ' ').trim()
    const config = formatPrompts[contentType]

    if (contentType === 'general' || !config.structure.length) {
      return simpleFormat(text)
    }

    // テキストを文に分割
    const sentences = cleanText.split(/[。！？]/).filter(s => s.trim())

    if (sentences.length < 2) {
      return simpleFormat(text)
    }

    // 文章を構造化してセクションに分ける
    const sections = config.structure
    const sentencesPerSection = Math.max(1, Math.ceil(sentences.length / sections.length))

    let result = ''
    let sentenceIndex = 0

    sections.forEach((section, i) => {
      if (sentenceIndex >= sentences.length) return

      const sectionSentences: string[] = []
      const count = i === sections.length - 1
        ? sentences.length - sentenceIndex
        : sentencesPerSection

      for (let j = 0; j < count && sentenceIndex < sentences.length; j++) {
        sectionSentences.push(sentences[sentenceIndex].trim())
        sentenceIndex++
      }

      if (sectionSentences.length > 0) {
        result += `【${section}】\n`
        result += sectionSentences.join('。') + '。\n\n'
      }
    })

    return result.trim()
  }

  const formatTextWithAI = async () => {
    if (!value.trim()) return

    setIsFormatting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 600))

      const formatted = formatMode === 'structured'
        ? structuredFormat(value)
        : simpleFormat(value)

      onChange(formatted)
    } finally {
      setIsFormatting(false)
    }
  }

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {value.trim() && (
        <div className="flex flex-wrap items-center gap-2">
          {/* シンプル整形ボタン */}
          <button
            type="button"
            onClick={() => {
              setFormatMode('simple')
              formatTextWithAI()
            }}
            disabled={isFormatting}
            className="btn-press flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
          >
            {isFormatting && formatMode === 'simple' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                整形中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                シンプル整形
              </>
            )}
          </button>

          {/* 構造化整形ボタン（コンテンツタイプがある場合のみ） */}
          {contentType !== 'general' && (
            <button
              type="button"
              onClick={() => {
                setFormatMode('structured')
                formatTextWithAI()
              }}
              disabled={isFormatting}
              className="btn-press flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 shadow-sm"
            >
              {isFormatting && formatMode === 'structured' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI整形中...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  AI構造化
                </>
              )}
            </button>
          )}

          <span className="text-xs text-slate-500">
            {contentType !== 'general'
              ? '音声入力後のテキストを見やすく整形します'
              : '音声入力後のテキストを整形します'}
          </span>
        </div>
      )}
    </div>
  )
}
