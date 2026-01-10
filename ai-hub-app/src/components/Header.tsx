'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getProfile, getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, type MockProfile, type MockNotification } from '@/lib/mockData'
import {
  Lightbulb,
  BookOpen,
  Wrench,
  Newspaper,
  Plus,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Bell,
  MessageCircle,
  Reply,
  Check,
} from 'lucide-react'

const navigation = [
  { name: 'Ideas', href: '/ideas', icon: Lightbulb, color: 'text-blue-500' },
  { name: 'Knowledge', href: '/knowledge', icon: BookOpen, color: 'text-purple-500' },
  { name: 'Output', href: '/output', icon: Wrench, color: 'text-green-500' },
  { name: 'News', href: '/news', icon: Newspaper, color: 'text-orange-500' },
]

export default function Header() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [mockProfile, setMockProfile] = useState<MockProfile | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<MockNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  const loadNotifications = () => {
    const profile = getProfile()
    if (profile) {
      setNotifications(getNotifications(profile.id))
      setUnreadCount(getUnreadNotificationCount(profile.id))
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    // Load mock profile
    const profile = getProfile()
    setMockProfile(profile)
    // Load notifications
    loadNotifications()
  }, [supabase.auth])

  // Refresh profile when menu opens
  useEffect(() => {
    if (showUserMenu) {
      const profile = getProfile()
      setMockProfile(profile)
    }
  }, [showUserMenu])

  // Refresh notifications when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      loadNotifications()
    }
  }, [showNotifications])

  const handleNotificationClick = (notification: MockNotification) => {
    markNotificationAsRead(notification.id)
    loadNotifications()
    setShowNotifications(false)
  }

  const handleMarkAllAsRead = () => {
    const profile = getProfile()
    if (profile) {
      markAllNotificationsAsRead(profile.id)
      loadNotifications()
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'たった今'
    if (diffMins < 60) return `${diffMins}分前`
    if (diffHours < 24) return `${diffHours}時間前`
    return `${diffDays}日前`
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">
              AI Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? item.color : ''}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Post Button */}
            <Link
              href="/post"
              className="btn-press hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              投稿
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setShowUserMenu(false)
                }}
                className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="animate-scaleIn absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                    <div className="sticky top-0 bg-white dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 dark:text-white">通知</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          すべて既読
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">通知はありません</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {notifications.slice(0, 20).map((notification) => (
                          <Link
                            key={notification.id}
                            href={`/${notification.content_type}/${notification.content_id}`}
                            onClick={() => handleNotificationClick(notification)}
                            className={`block p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                              !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <div className="flex gap-3">
                              {notification.from_user_avatar ? (
                                <img
                                  src={notification.from_user_avatar}
                                  alt=""
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                  <UserIcon className="w-5 h-5 text-white" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-900 dark:text-white">
                                  <span className="font-medium">{notification.from_user_name}</span>
                                  {notification.type === 'comment' ? (
                                    <span className="text-slate-600 dark:text-slate-400">
                                      {' '}があなたの投稿にコメントしました
                                    </span>
                                  ) : (
                                    <span className="text-slate-600 dark:text-slate-400">
                                      {' '}があなたのコメントに返信しました
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                                  「{notification.content_title}」
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  {notification.type === 'comment' ? (
                                    <MessageCircle className="w-3 h-3 text-blue-500" />
                                  ) : (
                                    <Reply className="w-3 h-3 text-purple-500" />
                                  )}
                                  <span className="text-xs text-slate-400">
                                    {formatTimeAgo(notification.created_at)}
                                  </span>
                                  {!notification.is_read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu)
                  setShowNotifications(false)
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mockProfile?.avatar_url || user?.user_metadata?.avatar_url ? (
                  <img
                    src={mockProfile?.avatar_url || user?.user_metadata?.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="animate-scaleIn absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {mockProfile?.name || user?.user_metadata?.full_name || user?.email || '開発ユーザー'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email || 'dev@example.com'}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <UserIcon className="w-4 h-4" />
                      プロフィール設定
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <LogOut className="w-4 h-4" />
                      ログアウト
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                  {item.name}
                </Link>
              )
            })}
            <Link
              href="/post"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 px-4 py-3 mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg"
            >
              <Plus className="w-5 h-5" />
              新規投稿
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
