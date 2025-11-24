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
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tables: {
        Row: {
          id: string
          user_id: string
          folder_id: string | null
          name: string
          columns: Json
          rows: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          folder_id?: string | null
          name: string
          columns?: Json
          rows?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          folder_id?: string | null
          name?: string
          columns?: Json
          rows?: Json
          created_at?: string
          updated_at?: string
        }
      }
      views: {
        Row: {
          id: string
          user_id: string
          table_id: string
          name: string
          type: 'grid' | 'gallery' | 'form' | 'kanban' | 'calendar'
          filters: Json
          sorts: Json
          color_rules: Json
          visible_columns: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          table_id: string
          name: string
          type: 'grid' | 'gallery' | 'form' | 'kanban' | 'calendar'
          filters?: Json
          sorts?: Json
          color_rules?: Json
          visible_columns?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          table_id?: string
          name?: string
          type?: 'grid' | 'gallery' | 'form' | 'kanban' | 'calendar'
          filters?: Json
          sorts?: Json
          color_rules?: Json
          visible_columns?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
