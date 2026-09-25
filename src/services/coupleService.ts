import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Couple, Template, Profile, Memory, TimelineEvent } from '../types/models'
import { authService } from './authService'

const INITIAL_TEMPLATES: Template[] = [
  { id: 'cinematic', name: 'Cinematic', description: 'The original immersive cinematic experience.', version: '1.0', supportedFeatures: ['video', 'timeline'] }
]

// Mapping helper to convert DB snake_case to TS camelCase
const mapToCouple = (row: any): Couple => ({
  id: row.id,
  slug: row.slug,
  person1Name: row.person1_name,
  person2Name: row.person2_name,
  relationshipStart: row.relationship_start,
  heroTitle: row.hero_title,
  description: row.description,
  finalMessage: row.final_message,
  templateId: row.template_id,
  status: row.status,
  heroMediaId: row.hero_media_id,
  profileMediaId: row.profile_media_id,
  counterEnabled: row.counter_enabled,
  counterStartDate: row.counter_start_date,
  endingTitle: row.ending_title,
  endingQuote: row.ending_quote,
  backgroundAudioMediaId: row.background_audio_media_id,
  endingAudioMediaId: row.ending_audio_media_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  publishedAt: row.published_at
})

// Mapping helper to convert TS camelCase to DB snake_case
const mapFromCouple = (data: Partial<Couple>): any => {
  const row: any = {}
  if (data.slug !== undefined) row.slug = data.slug
  if (data.person1Name !== undefined) row.person1_name = data.person1Name
  if (data.person2Name !== undefined) row.person2_name = data.person2Name
  if (data.relationshipStart !== undefined) row.relationship_start = data.relationshipStart
  if (data.heroTitle !== undefined) row.hero_title = data.heroTitle
  if (data.description !== undefined) row.description = data.description
  if (data.finalMessage !== undefined) row.final_message = data.finalMessage
  if (data.templateId !== undefined) row.template_id = data.templateId
  if (data.status !== undefined) row.status = data.status
  if (data.heroMediaId !== undefined) row.hero_media_id = data.heroMediaId
  if (data.profileMediaId !== undefined) row.profile_media_id = data.profileMediaId
  if (data.counterEnabled !== undefined) row.counter_enabled = data.counterEnabled
  if (data.counterStartDate !== undefined) row.counter_start_date = data.counterStartDate
  if (data.endingTitle !== undefined) row.ending_title = data.endingTitle
  if (data.endingQuote !== undefined) row.ending_quote = data.endingQuote
  if (data.backgroundAudioMediaId !== undefined) row.background_audio_media_id = data.backgroundAudioMediaId
  if (data.endingAudioMediaId !== undefined) row.ending_audio_media_id = data.endingAudioMediaId
  if (data.publishedAt !== undefined) row.published_at = data.publishedAt
  return row
}

export const coupleService = {
  getTemplates: (): Template[] => {
    return INITIAL_TEMPLATES
  },

  getAllCouples: async (): Promise<Couple[]> => {
    if (!isSupabaseConfigured) {
      console.warn('Development: Returning local fallback array for couples')
      return JSON.parse(localStorage.getItem('our-story-couples') || '[]')
    }
    const { data, error } = await supabase!.from('couples').select('*').order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data.map(mapToCouple)
  },

  getCoupleBySlug: async (slug: string): Promise<Couple | undefined> => {
    if (!isSupabaseConfigured) {
      const arr = JSON.parse(localStorage.getItem('our-story-couples') || '[]') as Couple[]
      return arr.find(c => c.slug === slug)
    }
    const { data, error } = await supabase!.from('couples').select('*').eq('slug', slug).single()
    if (error) return undefined // Not found or error
    return mapToCouple(data)
  },

  getCoupleById: async (id: string): Promise<Couple | undefined> => {
    if (!isSupabaseConfigured) {
      const arr = JSON.parse(localStorage.getItem('our-story-couples') || '[]') as Couple[]
      return arr.find(c => c.id === id)
    }
    const { data, error } = await supabase!.from('couples').select('*').eq('id', id).single()
    if (error) return undefined
    return mapToCouple(data)
  },

  createCouple: async (data: Partial<Couple>): Promise<Couple> => {
    await authService.requireAdmin()
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured.')
    }
    const row = mapFromCouple(data)
    const { data: result, error } = await supabase!.from('couples').insert([row]).select().single()
    if (error) throw new Error(error.message)
    return mapToCouple(result)
  },

  updateCouple: async (id: string, data: Partial<Couple>): Promise<Couple> => {
    await authService.requireAdmin()
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured.')
    }
    const row = mapFromCouple(data)
    row.updated_at = new Date().toISOString()
    const { data: result, error } = await supabase!.from('couples').update(row).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return mapToCouple(result)
  }
}

export const contentService = {
  getProfiles: async (coupleId: string): Promise<Profile[]> => {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase!.from('profiles').select('*').eq('couple_id', coupleId).order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    return data.map((r: any) => ({ ...r, coupleId: r.couple_id, mediaId: r.media_id, sortOrder: r.sort_order }))
  },
  
  getMemories: async (coupleId: string): Promise<Memory[]> => {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase!.from('memories').select('*').eq('couple_id', coupleId).order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    return data.map((r: any) => ({ ...r, coupleId: r.couple_id, coverMediaId: r.cover_media_id, videoMediaId: r.video_media_id, sortOrder: r.sort_order }))
  },
  
  getTimelineEvents: async (coupleId: string): Promise<TimelineEvent[]> => {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase!.from('timeline_events').select('*').eq('couple_id', coupleId).order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    return data.map((r: any) => ({ ...r, coupleId: r.couple_id, mediaId: r.media_id, sortOrder: r.sort_order }))
  }
}
