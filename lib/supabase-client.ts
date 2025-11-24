import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Folder = {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export type Table = {
  id: string
  user_id: string
  folder_id: string | null
  name: string
  columns: any[]
  rows: any[]
  created_at: string
  updated_at: string
}

export type View = {
  id: string
  user_id: string
  table_id: string
  name: string
  type: 'grid' | 'gallery' | 'form' | 'kanban' | 'calendar'
  filters: any[]
  sorts: any[]
  color_rules: any[]
  visible_columns: any[]
  group_by: string | null
  created_at: string
  updated_at: string
}
