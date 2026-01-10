// 開発用モックデータストア (localStorage使用)

export interface MockIdea {
  id: string
  title: string
  description: string | null
  tags: string[]
  status: string
  media_url: string | null
  user_id: string
  likes_count: number
  comments_count: number
  created_at: string
  profiles: { name: string; avatar_url: string | null }
}

export interface MockKnowledge {
  id: string
  title: string
  description: string | null
  tags: string[]
  prompt_template: string | null
  category: string | null
  recommended_tool: string | null
  media_url: string | null
  user_id: string
  likes_count: number
  comments_count: number
  created_at: string
  profiles: { name: string; avatar_url: string | null }
}

export interface MockOutput {
  id: string
  title: string
  description: string | null
  tags: string[]
  tool_type: string | null
  tool_url: string | null
  media_url: string | null
  user_id: string
  likes_count: number
  comments_count: number
  created_at: string
  profiles: { name: string; avatar_url: string | null }
}

export interface MockNews {
  id: string
  title: string
  description: string | null
  tags: string[]
  source_url: string | null
  category: string | null
  impact_level: number
  ai_summary: string | null
  media_url: string | null
  user_id: string
  likes_count: number
  comments_count: number
  created_at: string
  profiles: { name: string; avatar_url: string | null }
}

export interface MockComment {
  id: string
  content: string
  content_type: string
  content_id: string
  user_id: string
  parent_id: string | null
  likes_count: number
  created_at: string
  profiles: { name: string; avatar_url: string | null }
}

export interface MockCommentLike {
  id: string
  comment_id: string
  user_id: string
}

export interface MockLike {
  id: string
  content_type: string
  content_id: string
  user_id: string
}

export interface MockProfile {
  id: string
  name: string
  avatar_url: string | null
  departments: string[]
  staff_code: string | null
  bio: string | null
  email: string | null
  is_onboarded: boolean
  created_at: string
  updated_at: string
}

// プロフィール取得
export function getProfile(): MockProfile | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('mockProfile')
  if (!stored) return null
  return JSON.parse(stored)
}

// プロフィール保存
export function saveProfile(profile: Partial<MockProfile>): MockProfile {
  const existing = getProfile()
  const now = new Date().toISOString()

  const updated: MockProfile = {
    id: existing?.id || 'dev-user-id',
    name: profile.name ?? existing?.name ?? '',
    avatar_url: profile.avatar_url ?? existing?.avatar_url ?? null,
    departments: profile.departments ?? existing?.departments ?? [],
    staff_code: profile.staff_code ?? existing?.staff_code ?? null,
    bio: profile.bio ?? existing?.bio ?? null,
    email: profile.email ?? existing?.email ?? null,
    is_onboarded: profile.is_onboarded ?? existing?.is_onboarded ?? false,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('mockProfile', JSON.stringify(updated))
  }

  // 全ての投稿のプロフィール情報を更新
  updateAllUserContent(updated.id, { name: updated.name, avatar_url: updated.avatar_url })

  return updated
}

// ユーザーの全投稿のプロフィール情報を更新
function updateAllUserContent(userId: string, profileData: { name: string; avatar_url: string | null }) {
  if (typeof window === 'undefined') return

  // Ideas を更新
  const ideas = getFromStorage<MockIdea>('mockIdeas', [])
  ideas.forEach(idea => {
    if (idea.user_id === userId) {
      idea.profiles = profileData
    }
  })
  saveToStorage('mockIdeas', ideas)

  // Knowledge を更新
  const knowledge = getFromStorage<MockKnowledge>('mockKnowledge', [])
  knowledge.forEach(item => {
    if (item.user_id === userId) {
      item.profiles = profileData
    }
  })
  saveToStorage('mockKnowledge', knowledge)

  // Outputs を更新
  const outputs = getFromStorage<MockOutput>('mockOutputs', [])
  outputs.forEach(item => {
    if (item.user_id === userId) {
      item.profiles = profileData
    }
  })
  saveToStorage('mockOutputs', outputs)

  // News を更新
  const news = getFromStorage<MockNews>('mockNews', [])
  news.forEach(item => {
    if (item.user_id === userId) {
      item.profiles = profileData
    }
  })
  saveToStorage('mockNews', news)

  // Comments を更新
  const comments = getFromStorage<MockComment>('mockComments', [])
  comments.forEach(comment => {
    if (comment.user_id === userId) {
      comment.profiles = profileData
    }
  })
  saveToStorage('mockComments', comments)
}

// オンボーディング完了チェック
export function isOnboarded(): boolean {
  const profile = getProfile()
  return profile?.is_onboarded ?? false
}

// プロフィール情報を取得してDEV_USERを更新
function getCurrentUserProfile(): { name: string; avatar_url: string | null } {
  const profile = getProfile()
  if (profile && profile.name) {
    return { name: profile.name, avatar_url: profile.avatar_url }
  }
  return { name: '開発ユーザー', avatar_url: null }
}

const DEV_USER = {
  id: 'dev-user-id',
  name: '開発ユーザー',
  avatar_url: null,
}

// 初期サンプルデータ
const initialIdeas: MockIdea[] = [
  {
    id: '1',
    title: 'AIチャットボットで社内問い合わせを自動化',
    description: '社内のよくある質問をAIチャットボットで自動応答することで、問い合わせ対応の工数を80%削減できるアイデア',
    tags: ['ChatGPT', '業務効率化', '自動化'],
    status: '検討中',
    media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    user_id: 'sample-user',
    likes_count: 12,
    comments_count: 3,
    created_at: new Date().toISOString(),
    profiles: { name: 'サンプルユーザー', avatar_url: null },
  },
  {
    id: '2',
    title: 'AIによる議事録自動生成システム',
    description: '会議の音声をリアルタイムで文字起こしし、要点をまとめた議事録を自動生成するシステム',
    tags: ['Whisper', '議事録', '音声認識'],
    status: '開発中',
    media_url: null,
    user_id: 'sample-user',
    likes_count: 8,
    comments_count: 2,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    profiles: { name: 'サンプルユーザー', avatar_url: null },
  },
]

const initialKnowledge: MockKnowledge[] = [
  {
    id: '1',
    title: '効果的なプロンプト設計の基本パターン',
    description: 'AIからより良い回答を引き出すためのプロンプト設計テクニック集',
    tags: ['プロンプト', 'ベストプラクティス'],
    prompt_template: '# 役割\nあなたは[専門分野]の専門家です。\n\n# タスク\n以下の[入力]に対して、[出力形式]で回答してください。\n\n# 制約\n- 箇条書きで回答\n- 300文字以内',
    category: 'ライティング',
    recommended_tool: 'ChatGPT',
    media_url: null,
    user_id: 'sample-user',
    likes_count: 25,
    comments_count: 5,
    created_at: new Date().toISOString(),
    profiles: { name: 'サンプルユーザー', avatar_url: null },
  },
]

const initialOutputs: MockOutput[] = [
  {
    id: '1',
    title: 'コードレビュー支援GPTs',
    description: 'GitHubのPRを分析して、改善点やセキュリティリスクを指摘してくれるGPTs',
    tags: ['GPTs', 'コードレビュー', 'GitHub'],
    tool_type: 'GPTs',
    tool_url: 'https://chat.openai.com/g/example',
    media_url: null,
    user_id: 'sample-user',
    likes_count: 15,
    comments_count: 4,
    created_at: new Date().toISOString(),
    profiles: { name: 'サンプルユーザー', avatar_url: null },
  },
]

const initialNews: MockNews[] = [
  {
    id: '1',
    title: 'GPT-5の開発が進行中、2025年後半にリリース予定',
    description: 'OpenAIがGPT-5の開発状況について言及。従来モデルを大幅に上回る性能が期待される。',
    tags: ['OpenAI', 'GPT-5', 'LLM'],
    source_url: 'https://example.com/news/gpt5',
    category: 'LLM',
    impact_level: 5,
    ai_summary: 'OpenAIが次世代モデルGPT-5を開発中。マルチモーダル性能の向上と推論能力の強化が主な特徴。',
    media_url: null,
    user_id: 'sample-user',
    likes_count: 42,
    comments_count: 8,
    created_at: new Date().toISOString(),
    profiles: { name: 'サンプルユーザー', avatar_url: null },
  },
]

// ローカルストレージ操作
function getFromStorage<T>(key: string, initialData: T[]): T[] {
  if (typeof window === 'undefined') return initialData
  const stored = localStorage.getItem(key)
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initialData))
    return initialData
  }
  return JSON.parse(stored)
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

// 初期部署リスト
const initialDepartments = [
  '営業部',
  '開発部',
  '企画部',
  'マーケティング部',
  '人事部',
  '総務部',
  '経理部',
  'カスタマーサポート部',
]

// 部署管理
export function getDepartments(): string[] {
  return getFromStorage<string>('mockDepartments', initialDepartments)
}

export function addDepartment(department: string): void {
  if (!department.trim()) return
  const departments = getDepartments()
  if (!departments.includes(department.trim())) {
    departments.push(department.trim())
    saveToStorage('mockDepartments', departments)
  }
}

// データ取得
export function getIdeas(): MockIdea[] {
  return getFromStorage('mockIdeas', initialIdeas)
}

export function getKnowledge(): MockKnowledge[] {
  return getFromStorage('mockKnowledge', initialKnowledge)
}

export function getOutputs(): MockOutput[] {
  return getFromStorage('mockOutputs', initialOutputs)
}

export function getNews(): MockNews[] {
  return getFromStorage('mockNews', initialNews)
}

export function getComments(contentType: string, contentId: string): MockComment[] {
  const all = getFromStorage<MockComment>('mockComments', [])
  return all.filter(c => c.content_type === contentType && c.content_id === contentId)
}

export function getLikes(contentType: string, contentId: string, userId: string): MockLike | null {
  const all = getFromStorage<MockLike>('mockLikes', [])
  return all.find(l => l.content_type === contentType && l.content_id === contentId && l.user_id === userId) || null
}

// データ追加
export function addIdea(idea: Omit<MockIdea, 'id' | 'likes_count' | 'comments_count' | 'created_at' | 'profiles'>): MockIdea {
  const ideas = getIdeas()
  const userProfile = getCurrentUserProfile()
  const newIdea: MockIdea = {
    ...idea,
    media_url: idea.media_url || null,
    id: Date.now().toString(),
    likes_count: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
    profiles: userProfile,
  }
  ideas.unshift(newIdea)
  saveToStorage('mockIdeas', ideas)
  return newIdea
}

export function addKnowledge(knowledge: Omit<MockKnowledge, 'id' | 'likes_count' | 'comments_count' | 'created_at' | 'profiles'>): MockKnowledge {
  const list = getKnowledge()
  const userProfile = getCurrentUserProfile()
  const newItem: MockKnowledge = {
    ...knowledge,
    media_url: knowledge.media_url || null,
    id: Date.now().toString(),
    likes_count: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
    profiles: userProfile,
  }
  list.unshift(newItem)
  saveToStorage('mockKnowledge', list)
  return newItem
}

export function addOutput(output: Omit<MockOutput, 'id' | 'likes_count' | 'comments_count' | 'created_at' | 'profiles'>): MockOutput {
  const list = getOutputs()
  const userProfile = getCurrentUserProfile()
  const newItem: MockOutput = {
    ...output,
    media_url: output.media_url || null,
    id: Date.now().toString(),
    likes_count: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
    profiles: userProfile,
  }
  list.unshift(newItem)
  saveToStorage('mockOutputs', list)
  return newItem
}

export function addNews(news: Omit<MockNews, 'id' | 'likes_count' | 'comments_count' | 'created_at' | 'profiles'>): MockNews {
  const list = getNews()
  const userProfile = getCurrentUserProfile()
  const newItem: MockNews = {
    ...news,
    media_url: news.media_url || null,
    id: Date.now().toString(),
    likes_count: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
    profiles: userProfile,
  }
  list.unshift(newItem)
  saveToStorage('mockNews', list)
  return newItem
}

export function addComment(comment: Omit<MockComment, 'id' | 'created_at' | 'profiles' | 'likes_count'>): MockComment {
  const comments = getFromStorage<MockComment>('mockComments', [])
  const userProfile = getCurrentUserProfile()
  const newComment: MockComment = {
    ...comment,
    parent_id: comment.parent_id || null,
    likes_count: 0,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    profiles: userProfile,
  }
  comments.push(newComment)
  saveToStorage('mockComments', comments)

  // コメント数を更新
  updateCommentCount(comment.content_type, comment.content_id, 1)

  return newComment
}

export function getCommentLike(commentId: string, userId: string): MockCommentLike | null {
  const all = getFromStorage<MockCommentLike>('mockCommentLikes', [])
  return all.find(l => l.comment_id === commentId && l.user_id === userId) || null
}

export function toggleCommentLike(commentId: string, userId: string): boolean {
  const likes = getFromStorage<MockCommentLike>('mockCommentLikes', [])
  const existingIndex = likes.findIndex(
    l => l.comment_id === commentId && l.user_id === userId
  )

  const comments = getFromStorage<MockComment>('mockComments', [])
  const comment = comments.find(c => c.id === commentId)

  if (existingIndex >= 0) {
    likes.splice(existingIndex, 1)
    saveToStorage('mockCommentLikes', likes)
    if (comment) {
      comment.likes_count = Math.max(0, (comment.likes_count || 0) - 1)
      saveToStorage('mockComments', comments)
    }
    return false
  } else {
    likes.push({
      id: Date.now().toString(),
      comment_id: commentId,
      user_id: userId,
    })
    saveToStorage('mockCommentLikes', likes)
    if (comment) {
      comment.likes_count = (comment.likes_count || 0) + 1
      saveToStorage('mockComments', comments)
    }
    return true
  }
}

export function toggleLike(contentType: string, contentId: string, userId: string): boolean {
  const likes = getFromStorage<MockLike>('mockLikes', [])
  const existingIndex = likes.findIndex(
    l => l.content_type === contentType && l.content_id === contentId && l.user_id === userId
  )

  if (existingIndex >= 0) {
    likes.splice(existingIndex, 1)
    saveToStorage('mockLikes', likes)
    updateLikeCount(contentType, contentId, -1)
    return false
  } else {
    likes.push({
      id: Date.now().toString(),
      content_type: contentType,
      content_id: contentId,
      user_id: userId,
    })
    saveToStorage('mockLikes', likes)
    updateLikeCount(contentType, contentId, 1)
    return true
  }
}

function updateLikeCount(contentType: string, contentId: string, delta: number) {
  switch (contentType) {
    case 'idea': {
      const ideas = getIdeas()
      const idea = ideas.find(i => i.id === contentId)
      if (idea) {
        idea.likes_count += delta
        saveToStorage('mockIdeas', ideas)
      }
      break
    }
    case 'knowledge': {
      const list = getKnowledge()
      const item = list.find(i => i.id === contentId)
      if (item) {
        item.likes_count += delta
        saveToStorage('mockKnowledge', list)
      }
      break
    }
    case 'output': {
      const list = getOutputs()
      const item = list.find(i => i.id === contentId)
      if (item) {
        item.likes_count += delta
        saveToStorage('mockOutputs', list)
      }
      break
    }
    case 'news': {
      const list = getNews()
      const item = list.find(i => i.id === contentId)
      if (item) {
        item.likes_count += delta
        saveToStorage('mockNews', list)
      }
      break
    }
  }
}

function updateCommentCount(contentType: string, contentId: string, delta: number) {
  switch (contentType) {
    case 'idea': {
      const ideas = getIdeas()
      const idea = ideas.find(i => i.id === contentId)
      if (idea) {
        idea.comments_count += delta
        saveToStorage('mockIdeas', ideas)
      }
      break
    }
    case 'knowledge': {
      const list = getKnowledge()
      const item = list.find(i => i.id === contentId)
      if (item) {
        item.comments_count += delta
        saveToStorage('mockKnowledge', list)
      }
      break
    }
    case 'output': {
      const list = getOutputs()
      const item = list.find(i => i.id === contentId)
      if (item) {
        item.comments_count += delta
        saveToStorage('mockOutputs', list)
      }
      break
    }
    case 'news': {
      const list = getNews()
      const item = list.find(i => i.id === contentId)
      if (item) {
        item.comments_count += delta
        saveToStorage('mockNews', list)
      }
      break
    }
  }
}

// 個別アイテム取得
export function getIdeaById(id: string): MockIdea | null {
  return getIdeas().find(i => i.id === id) || null
}

export function getKnowledgeById(id: string): MockKnowledge | null {
  return getKnowledge().find(i => i.id === id) || null
}

export function getOutputById(id: string): MockOutput | null {
  return getOutputs().find(i => i.id === id) || null
}

export function getNewsById(id: string): MockNews | null {
  return getNews().find(i => i.id === id) || null
}
