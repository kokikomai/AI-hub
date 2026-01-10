'use client'

import { useState, useEffect, useRef } from 'react'
import { Video, Link, X, Play, Upload, Image } from 'lucide-react'

interface MediaInputProps {
  value: string
  onChange: (value: string) => void
}

type MediaType = 'youtube' | 'video' | 'image' | 'none'
type InputMode = 'url' | 'file'

function getMediaType(url: string): MediaType {
  if (!url) return 'none'

  // YouTube URL patterns
  if (url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)/)) {
    return 'youtube'
  }

  // Direct video file extensions or data URLs
  if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.startsWith('data:video/')) {
    return 'video'
  }

  // Image file extensions or data URLs
  if (url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) || url.startsWith('data:image/')) {
    return 'image'
  }

  return 'none'
}

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }
  return null
}

export default function MediaInput({ value, onChange }: MediaInputProps) {
  const [inputMode, setInputMode] = useState<InputMode>('url')
  const [inputValue, setInputValue] = useState(value)
  const [mediaType, setMediaType] = useState<MediaType>('none')
  const [showPreview, setShowPreview] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(value)
    const type = getMediaType(value)
    setMediaType(type)
    setShowPreview(type !== 'none')
  }, [value])

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    const type = getMediaType(newValue)
    setMediaType(type)
    if (type !== 'none') {
      onChange(newValue)
      setShowPreview(true)
    } else if (!newValue) {
      onChange('')
      setShowPreview(false)
    }
  }

  const handleBlur = () => {
    if (inputValue && mediaType !== 'none') {
      onChange(inputValue)
    }
  }

  const clearMedia = () => {
    setInputValue('')
    onChange('')
    setShowPreview(false)
    setMediaType('none')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']

    if (!validTypes.includes(file.type)) {
      alert('対応していないファイル形式です。動画（mp4, webm, ogg, mov）または画像（jpg, png, gif, webp）をアップロードしてください。')
      return
    }

    // Check file size (50MB limit for videos, 10MB for images)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`ファイルサイズが大きすぎます。${file.type.startsWith('video/') ? '50MB' : '10MB'}以下のファイルをアップロードしてください。`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      onChange(dataUrl)
      setInputValue(dataUrl)
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image')
      setShowPreview(true)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const renderPreview = () => {
    if (!showPreview || mediaType === 'none') return null

    if (mediaType === 'youtube') {
      const embedUrl = getYouTubeEmbedUrl(value)
      if (!embedUrl) return null

      return (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button
            type="button"
            onClick={clearMedia}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    }

    if (mediaType === 'video') {
      return (
        <div className="relative rounded-xl overflow-hidden bg-black">
          <video
            src={value}
            controls
            className="w-full max-h-[400px]"
            preload="metadata"
          >
            お使いのブラウザは動画再生に対応していません。
          </video>
          <button
            type="button"
            onClick={clearMedia}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    }

    if (mediaType === 'image') {
      return (
        <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-[400px] object-contain"
          />
          <button
            type="button"
            onClick={clearMedia}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            inputMode === 'url'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          <Link className="w-4 h-4" />
          URLを入力
        </button>
        <button
          type="button"
          onClick={() => setInputMode('file')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            inputMode === 'file'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          <Upload className="w-4 h-4" />
          ファイルをアップロード
        </button>
      </div>

      {/* URL Input */}
      {inputMode === 'url' && !showPreview && (
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {mediaType === 'youtube' ? (
              <Play className="w-5 h-5 text-red-500" />
            ) : mediaType === 'video' ? (
              <Video className="w-5 h-5 text-blue-500" />
            ) : mediaType === 'image' ? (
              <Image className="w-5 h-5 text-green-500" />
            ) : (
              <Link className="w-5 h-5" />
            )}
          </div>
          <input
            type="url"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="YouTube URL または動画/画像ファイルのURLを入力"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* File Upload */}
      {inputMode === 'file' && !showPreview && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <Video className="w-8 h-8 text-slate-400" />
              <Image className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                ファイルをドラッグ＆ドロップ
              </p>
              <p className="text-xs text-slate-500 mt-1">
                またはクリックして選択
              </p>
            </div>
            <p className="text-xs text-slate-400">
              動画: mp4, webm, ogg, mov (50MBまで) / 画像: jpg, png, gif, webp (10MBまで)
            </p>
          </div>
        </div>
      )}

      {/* Supported formats hint for URL mode */}
      {inputMode === 'url' && !showPreview && (
        <p className="text-xs text-slate-500">
          対応形式: YouTube, .mp4, .webm, .ogg, .mov, .jpg, .png, .gif, .webp
        </p>
      )}

      {/* Preview */}
      {renderPreview()}
    </div>
  )
}

// Export helper for use in detail pages
export function MediaPreview({ url, className = '' }: { url: string; className?: string }) {
  const mediaType = getMediaType(url)

  if (mediaType === 'none' || !url) return null

  if (mediaType === 'youtube') {
    const embedUrl = getYouTubeEmbedUrl(url)
    if (!embedUrl) return null

    return (
      <div className={`aspect-video rounded-xl overflow-hidden bg-black ${className}`}>
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (mediaType === 'video') {
    return (
      <div className={`rounded-xl overflow-hidden bg-black ${className}`}>
        <video
          src={url}
          controls
          className="w-full max-h-[500px]"
          preload="metadata"
        >
          お使いのブラウザは動画再生に対応していません。
        </video>
      </div>
    )
  }

  if (mediaType === 'image') {
    return (
      <div className={`rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
        <img
          src={url}
          alt="Media"
          className="w-full max-h-[500px] object-contain"
        />
      </div>
    )
  }

  return null
}
