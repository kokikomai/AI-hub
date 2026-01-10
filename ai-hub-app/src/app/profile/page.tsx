'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Save, ArrowLeft } from 'lucide-react'
import { getProfile, saveProfile, type MockProfile } from '@/lib/mockData'
import DepartmentSelect from '@/components/DepartmentSelect'

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<MockProfile | null>(null)
  const [name, setName] = useState('')
  const [departments, setDepartments] = useState<string[]>([])
  const [staffCode, setStaffCode] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const existingProfile = getProfile()
    if (existingProfile) {
      setProfile(existingProfile)
      setName(existingProfile.name || '')
      setDepartments(existingProfile.departments || [])
      setStaffCode(existingProfile.staff_code || '')
      setAvatarUrl(existingProfile.avatar_url)
    } else {
      setName('開発ユーザー')
    }
  }, [])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください')
      return
    }

    // Convert to data URL
    const reader = new FileReader()
    reader.onload = (event) => {
      setAvatarUrl(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      saveProfile({
        name,
        departments,
        staff_code: staffCode || null,
        avatar_url: avatarUrl,
        is_onboarded: true,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            プロフィール設定
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                onClick={handleImageClick}
                className="relative group"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="プロフィール画像"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-lg">
                    <span className="text-4xl text-white font-bold">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              クリックして画像を変更
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                表示名 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名前を入力"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                所属部署
              </label>
              <DepartmentSelect
                value={departments}
                onChange={setDepartments}
              />
            </div>

            <div>
              <label
                htmlFor="staffCode"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                スタッフID
              </label>
              <input
                id="staffCode"
                type="text"
                value={staffCode}
                onChange={(e) => setStaffCode(e.target.value)}
                placeholder="例: EMP-12345"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className={`btn-press w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saved ? (
                <>保存しました!</>
              ) : saving ? (
                <>保存中...</>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  保存する
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
