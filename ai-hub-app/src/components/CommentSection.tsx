'use client'

import { useState, useEffect } from 'react'
import { Send, Reply, X, Heart } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { getComments, addComment, toggleCommentLike, getCommentLike, type MockComment } from '@/lib/mockData'

interface CommentSectionProps {
  contentType: 'idea' | 'knowledge' | 'output' | 'news'
  contentId: string
}

interface CommentItemProps {
  comment: MockComment
  replies: MockComment[]
  allComments: MockComment[]
  onReply: (parentId: string, parentName: string) => void
  onLike: (commentId: string) => void
  likedComments: Set<string>
  depth?: number
}

function CommentItem({ comment, replies, allComments, onReply, onLike, likedComments, depth = 0 }: CommentItemProps) {
  const maxDepth = 2
  const isLiked = likedComments.has(comment.id)
  const [animatingLike, setAnimatingLike] = useState(false)

  const handleLikeClick = () => {
    if (!isLiked) {
      setAnimatingLike(true)
      setTimeout(() => setAnimatingLike(false), 400)
    }
    onLike(comment.id)
  }

  return (
    <div className={`animate-fadeIn ${depth > 0 ? 'ml-8 mt-3' : ''}`}>
      <div className="flex gap-3">
        {comment.profiles?.avatar_url ? (
          <img
            src={comment.profiles.avatar_url}
            alt={comment.profiles.name || ''}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
        )}
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {comment.profiles?.name || '匿名'}
            </span>
            <span className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: ja,
              })}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {comment.content}
          </p>
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={handleLikeClick}
              className={`flex items-center gap-1 text-xs transition-all duration-200 ${
                isLiked
                  ? 'text-pink-500'
                  : 'text-slate-500 hover:text-pink-500'
              }`}
            >
              <Heart className={`w-3 h-3 transition-transform ${isLiked ? 'fill-current' : ''} ${animatingLike ? 'animate-heartBeat' : ''}`} />
              {(comment.likes_count || 0) > 0 && (comment.likes_count || 0)}
            </button>
            {depth < maxDepth && (
              <button
                type="button"
                onClick={() => onReply(comment.id, comment.profiles?.name || '匿名')}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-500 transition-colors"
              >
                <Reply className="w-3 h-3" />
                返信
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="border-l-2 border-slate-200 dark:border-slate-700 pl-2">
          {replies.map((reply) => {
            const nestedReplies = allComments.filter(c => c.parent_id === reply.id)
            return (
              <CommentItem
                key={reply.id}
                comment={reply}
                replies={nestedReplies}
                allComments={allComments}
                onReply={onReply}
                onLike={onLike}
                likedComments={likedComments}
                depth={depth + 1}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CommentSection({ contentType, contentId }: CommentSectionProps) {
  const [comments, setComments] = useState<MockComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null)
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchComments()
  }, [contentId])

  const fetchComments = () => {
    setLoading(true)
    const data = getComments(contentType, contentId)
    setComments(data)

    // Check which comments are liked by the current user
    const liked = new Set<string>()
    data.forEach(comment => {
      if (getCommentLike(comment.id, 'dev-user-id')) {
        liked.add(comment.id)
      }
    })
    setLikedComments(liked)
    setLoading(false)
  }

  const handleLike = (commentId: string) => {
    const isNowLiked = toggleCommentLike(commentId, 'dev-user-id')
    setLikedComments(prev => {
      const newSet = new Set(prev)
      if (isNowLiked) {
        newSet.add(commentId)
      } else {
        newSet.delete(commentId)
      }
      return newSet
    })
    fetchComments()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      addComment({
        content: newComment.trim(),
        content_type: contentType,
        content_id: contentId,
        user_id: 'dev-user-id',
        parent_id: replyingTo?.id || null,
      })
      setNewComment('')
      setReplyingTo(null)
      fetchComments()
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = (parentId: string, parentName: string) => {
    setReplyingTo({ id: parentId, name: parentName })
  }

  const cancelReply = () => {
    setReplyingTo(null)
  }

  // Get top-level comments (no parent)
  const topLevelComments = comments.filter(c => !c.parent_id)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        コメント ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        {replyingTo && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Reply className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {replyingTo.name} に返信中
            </span>
            <button
              type="button"
              onClick={cancelReply}
              className="ml-auto p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded"
            >
              <X className="w-4 h-4 text-blue-500" />
            </button>
          </div>
        )}
        <div className="flex gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyingTo ? '返信を入力...' : 'コメントを入力...'}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-slate-500">読み込み中...</div>
      ) : topLevelComments.length > 0 ? (
        <div className="space-y-4">
          {topLevelComments.map((comment) => {
            const replies = comments.filter(c => c.parent_id === comment.id)
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={replies}
                allComments={comments}
                onReply={handleReply}
                onLike={handleLike}
                likedComments={likedComments}
              />
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          まだコメントがありません
        </div>
      )}
    </div>
  )
}
