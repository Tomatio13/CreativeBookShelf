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
      books: {
        Row: {
          id: number
          title: string
          author: string
          cover_image: string | null
          description: string | null
          pdf_path: string | null
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          author: string
          cover_image?: string | null
          description?: string | null
          pdf_path?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          author?: string
          cover_image?: string | null
          description?: string | null
          pdf_path?: string | null
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: number
          book_id: number
          user_id: string
          created_at: string
        }
        Insert: {
          id?: number
          book_id: number
          user_id: string
          created_at?: string
        }
        Update: {
          id?: number
          book_id?: number
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}
