export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      ideas: {
        Row: {
          id: string
          title: string
          description: string | null
          status: '検討中' | '開発中' | '完了'
          tags: string[] | null
          image_url: string | null
          user_id: string
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: '検討中' | '開発中' | '完了'
          tags?: string[] | null
          image_url?: string | null
          user_id: string
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: '検討中' | '開発中' | '完了'
          tags?: string[] | null
          image_url?: string | null
          user_id?: string
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      knowledge: {
        Row: {
          id: string
          title: string
          description: string | null
          prompt_template: string | null
          category: 'ライティング' | 'コーディング' | '画像生成' | '分析' | null
          recommended_tool: string | null
          tags: string[] | null
          user_id: string
          likes_count: number
          copy_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          prompt_template?: string | null
          category?: 'ライティング' | 'コーディング' | '画像生成' | '分析' | null
          recommended_tool?: string | null
          tags?: string[] | null
          user_id: string
          likes_count?: number
          copy_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          prompt_template?: string | null
          category?: 'ライティング' | 'コーディング' | '画像生成' | '分析' | null
          recommended_tool?: string | null
          tags?: string[] | null
          user_id?: string
          likes_count?: number
          copy_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      outputs: {
        Row: {
          id: string
          title: string
          description: string | null
          tool_type: 'GPTs' | 'Dify' | 'Chrome拡張' | 'Webツール' | null
          tool_url: string | null
          image_url: string | null
          tags: string[] | null
          user_id: string
          likes_count: number
          users_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          tool_type?: 'GPTs' | 'Dify' | 'Chrome拡張' | 'Webツール' | null
          tool_url?: string | null
          image_url?: string | null
          tags?: string[] | null
          user_id: string
          likes_count?: number
          users_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          tool_type?: 'GPTs' | 'Dify' | 'Chrome拡張' | 'Webツール' | null
          tool_url?: string | null
          image_url?: string | null
          tags?: string[] | null
          user_id?: string
          likes_count?: number
          users_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          description: string | null
          ai_summary: string | null
          source_url: string | null
          category: 'LLM' | '画像生成' | '業界動向' | null
          impact_level: number | null
          tags: string[] | null
          image_url: string | null
          user_id: string
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          ai_summary?: string | null
          source_url?: string | null
          category?: 'LLM' | '画像生成' | '業界動向' | null
          impact_level?: number | null
          tags?: string[] | null
          image_url?: string | null
          user_id: string
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          ai_summary?: string | null
          source_url?: string | null
          category?: 'LLM' | '画像生成' | '業界動向' | null
          impact_level?: number | null
          tags?: string[] | null
          image_url?: string | null
          user_id?: string
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          content_type: 'idea' | 'knowledge' | 'output' | 'news'
          content_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          content_type: 'idea' | 'knowledge' | 'output' | 'news'
          content_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          content_type?: 'idea' | 'knowledge' | 'output' | 'news'
          content_id?: string
          user_id?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          content_type: 'idea' | 'knowledge' | 'output' | 'news'
          content_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content_type: 'idea' | 'knowledge' | 'output' | 'news'
          content_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content_type?: 'idea' | 'knowledge' | 'output' | 'news'
          content_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ヘルパー型
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Idea = Database['public']['Tables']['ideas']['Row']
export type Knowledge = Database['public']['Tables']['knowledge']['Row']
export type Output = Database['public']['Tables']['outputs']['Row']
export type News = Database['public']['Tables']['news']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Like = Database['public']['Tables']['likes']['Row']

// 投稿者情報付きの型
export type IdeaWithProfile = Idea & { profiles: Profile }
export type KnowledgeWithProfile = Knowledge & { profiles: Profile }
export type OutputWithProfile = Output & { profiles: Profile }
export type NewsWithProfile = News & { profiles: Profile }
export type CommentWithProfile = Comment & { profiles: Profile }
