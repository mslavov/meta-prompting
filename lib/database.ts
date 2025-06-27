import { supabase } from './supabase'

export interface Session {
  id: string
  created_at: string
  updated_at: string
  goal: string
  current_step: 'landing' | 'goal' | 'questions' | 'template' | 'testing'
  answers: Record<string, any>
  template: string | null
  variables: Record<string, any>
  test_results: any[]
}

export interface Prompt {
  id: string
  created_at: string
  session_id: string
  template: string
  variables: Record<string, any>
  resolved_prompt: string
}

export interface Result {
  id: string
  created_at: string
  prompt_id: string
  model: string
  temperature: number
  response: string
  response_time: number
}

export interface Model {
  id: string
  name: string
  provider: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export class DatabaseService {
  static async createSession(goal: string): Promise<Session> {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        goal,
        current_step: 'goal',
        answers: {},
        variables: {},
        test_results: []
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateSession(id: string, updates: Partial<Session>): Promise<Session> {
    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getSession(id: string): Promise<Session | null> {
    const { data, error } = await supabase
      .from('sessions')
      .select()
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }

  static async createPrompt(sessionId: string, template: string, variables: Record<string, any>, resolvedPrompt: string): Promise<Prompt> {
    const { data, error } = await supabase
      .from('prompts')
      .insert({
        session_id: sessionId,
        template,
        variables,
        resolved_prompt: resolvedPrompt
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async createResult(promptId: string, model: string, temperature: number, response: string, responseTime: number): Promise<Result> {
    const { data, error } = await supabase
      .from('results')
      .insert({
        prompt_id: promptId,
        model,
        temperature,
        response,
        response_time: responseTime
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getResultsForPrompt(promptId: string): Promise<Result[]> {
    const { data, error } = await supabase
      .from('results')
      .select()
      .eq('prompt_id', promptId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getActiveModels(): Promise<Model[]> {
    const { data, error } = await supabase
      .from('models')
      .select()
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  }

  static async getAllModels(): Promise<Model[]> {
    const { data, error } = await supabase
      .from('models')
      .select()
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  }
}
