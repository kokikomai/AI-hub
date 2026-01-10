'use client'

import { useState } from 'react'
import { Link as LinkIcon, Check } from 'lucide-react'

interface ShareButtonProps {
  title: string
  url?: string
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopyLink}
      className={`btn-press flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
        copied
          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-5 h-5" />
          <span className="font-medium">コピー済み</span>
        </>
      ) : (
        <>
          <LinkIcon className="w-5 h-5" />
          <span className="font-medium">共有</span>
        </>
      )}
    </button>
  )
}
