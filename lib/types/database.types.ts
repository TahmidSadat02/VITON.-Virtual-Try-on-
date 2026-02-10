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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dresses: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string
          category: string
          color: string
          size: string
          price: number | null
          is_visible: boolean
          is_featured: boolean
          gender: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url: string
          category: string
          color: string
          size: string
          price?: number | null
          is_visible?: boolean
          is_featured?: boolean
          gender?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string
          category?: string
          color?: string
          size?: string
          price?: number | null
          is_visible?: boolean
          is_featured?: boolean
          gender?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_photos: {
        Row: {
          id: string
          user_id: string
          photo_url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          photo_url: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          photo_url?: string
          created_at?: string
        }
      }
      try_on_sessions: {
        Row: {
          id: string
          user_id: string
          user_photo_id: string
          dress_id: string
          result_url: string | null
          text_prompt: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          error_message: string | null
          is_favorite: boolean
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          user_photo_id: string
          dress_id: string
          result_url?: string | null
          text_prompt?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
          is_favorite?: boolean
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          user_photo_id?: string
          dress_id?: string
          result_url?: string | null
          text_prompt?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
          is_favorite?: boolean
          created_at?: string
          completed_at?: string | null
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          role: 'super_admin' | 'moderator'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'super_admin' | 'moderator'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'super_admin' | 'moderator'
          created_at?: string
        }
      }
    }
  }
}
