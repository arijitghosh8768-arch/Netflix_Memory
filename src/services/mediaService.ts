import type { MediaAsset, MediaAssignment } from '../types/models'
import { authService } from './authService'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const mediaService = {
  getMediaForCouple: async (coupleId: string): Promise<MediaAsset[]> => {
    if (!isSupabaseConfigured) {
      return JSON.parse(localStorage.getItem('our-story-media-assets') || '[]').filter((a: any) => a.coupleId === coupleId)
    }
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
  },

  getAssignmentsForCouple: async (coupleId: string): Promise<MediaAssignment[]> => {
    if (!isSupabaseConfigured) {
      return JSON.parse(localStorage.getItem('our-story-media-assignments') || '[]').filter((a: any) => a.coupleId === coupleId)
    }
    const { data, error } = await supabase!.from('media_assignments').select('*').eq('couple_id', coupleId)
    if (error) throw new Error(error.message)
    return data.map((r: any) => ({
      id: r.id,
      coupleId: r.couple_id,
      mediaId: r.media_id,
      usage: r.usage,
      referenceId: r.reference_id,
      sortOrder: r.sort_order
    }))
  },

  assignMedia: async (data: Partial<MediaAssignment>): Promise<MediaAssignment> => {
    await authService.requireAdmin()
    if (!isSupabaseConfigured) {
      const fallback = JSON.parse(localStorage.getItem('our-story-media-assignments') || '[]')
      const newAssignment = {
        id: `assignment-${Date.now()}`,
        coupleId: data.coupleId!,
        mediaId: data.mediaId!,
        usage: data.usage!,
        referenceId: data.referenceId,
        sortOrder: data.sortOrder || 0
      }
      fallback.push(newAssignment)
      localStorage.setItem('our-story-media-assignments', JSON.stringify(fallback))
      return newAssignment
    }
    const row = {
      couple_id: data.coupleId,
      media_id: data.mediaId,
      usage: data.usage,
      reference_id: data.referenceId,
      sort_order: data.sortOrder || 0
    }
    
    // Application-level tenant isolation check
    // We fetch the media asset to ensure it belongs to the couple
    const { data: mediaAsset, error: mediaError } = await supabase!.from('media_assets').select('couple_id').eq('id', data.mediaId).single()
    if (mediaError || !mediaAsset) throw new Error('Media asset not found')
    if (mediaAsset.couple_id !== data.coupleId) throw new Error('Tenant isolation violation: Media does not belong to this couple.')

    const { data: result, error } = await supabase!.from('media_assignments').insert([row]).select().single()
    if (error) throw new Error(error.message)
    return {
      id: result.id,
      coupleId: result.couple_id,
      mediaId: result.media_id,
      usage: result.usage,
      referenceId: result.reference_id,
      sortOrder: result.sort_order
    }
  },

  removeMediaAssignment: async (assignmentId: string): Promise<void> => {
    await authService.requireAdmin()
    if (!isSupabaseConfigured) {
      let fallback = JSON.parse(localStorage.getItem('our-story-media-assignments') || '[]')
      fallback = fallback.filter((a: any) => a.id !== assignmentId)
      localStorage.setItem('our-story-media-assignments', JSON.stringify(fallback))
      return
    }
    const { error } = await supabase!.from('media_assignments').delete().eq('id', assignmentId)
    if (error) throw new Error(error.message)
  }
}
