import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const defaultUrl = 'https://placeholder.supabase.co'
const defaultKey = 'placeholder-anon-key'

export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseKey || defaultKey
)

export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          goal: string
          current_step: string
          answers: any
          template: string | null
          variables: any
          test_results: any
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          goal: string
          current_step: string
          answers?: any
          template?: string | null
          variables?: any
          test_results?: any
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          goal?: string
          current_step?: string
          answers?: any
          template?: string | null
          variables?: any
          test_results?: any
        }
      }
      prompts: {
        Row: {
          id: string
          created_at: string
          session_id: string
          template: string
          variables: any
          resolved_prompt: string
        }
        Insert: {
          id?: string
          created_at?: string
          session_id: string
          template: string
          variables?: any
          resolved_prompt: string
        }
        Update: {
          id?: string
          created_at?: string
          session_id?: string
          template?: string
          variables?: any
          resolved_prompt?: string
        }
      }
      results: {
        Row: {
          id: string
          created_at: string
          prompt_id: string
          model: string
          temperature: number
          response: string
          response_time: number
        }
        Insert: {
          id?: string
          created_at?: string
          prompt_id: string
          model: string
          temperature: number
          response: string
          response_time: number
        }
        Update: {
          id?: string
          created_at?: string
          prompt_id?: string
          model?: string
          temperature?: number
          response?: string
          response_time?: number
        }
      }
      models: {
        Row: {
          id: string
          name: string
          provider: string
          description: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          provider: string
          description: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          provider?: string
          description?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
