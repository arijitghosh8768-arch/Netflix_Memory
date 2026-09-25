import type { MediaAsset } from '../types/models'
import { authService } from './authService'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const mediaService = {
  getMediaForCouple: async (coupleId: string): Promise<MediaAsset[]> => {
    if (!isSupabaseConfigured) return JSON.parse(localStorage.getItem('our-story-media-assets') || '[]').filter((a: any) => a.coupleId === coupleId)
    const { data, error } = await supabase!.from('media_assets').select('*').eq('couple_id', coupleId)
    if (error) throw new Error(error.message)
    return data.map((r: any) => ({ ...r, coupleId: r.couple_id, storageKey: r.storage_key, mimeType: r.mime_type }))
  },

  createMedia: async (coupleId: string, data: Partial<MediaAsset>): Promise<MediaAsset> => {
    await authService.requireAdmin()
    if (!isSupabaseConfigured) {
      const fallback = JSON.parse(localStorage.getItem('our-story-media-assets') || '[]')
      const newMedia = { id: `media-${Date.now()}`, coupleId, type: data.type || "IMAGE", name: data.name || "Untitled", storageKey: data.storageKey || "", mimeType: data.mimeType || "", size: data.size || 1024, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      fallback.push(newMedia)
      localStorage.setItem('our-story-media-assets', JSON.stringify(fallback))
      return newMedia
    }
    const row = { couple_id: coupleId, type: data.type, name: data.name, storage_key: data.storageKey, mime_type: data.mimeType, size: data.size }
    const { data: result, error } = await supabase!.from('media_assets').insert([row]).select().single()
    if (error) throw new Error(error.message)
    return { ...result, coupleId: result.couple_id, storageKey: result.storage_key, mimeType: result.mime_type }
  },

  deleteMedia: async (mediaId: string): Promise<void> => {
    await authService.requireAdmin()
    if (!isSupabaseConfigured) return
    const { error } = await supabase!.from('media_assets').delete().eq('id', mediaId)
    if (error) throw new Error(error.message)
  }
}
