import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const storageService = {
  uploadMedia: async (coupleId: string, usageType: string, file: File): Promise<string> => {
    if (!isSupabaseConfigured) {
      console.warn('[Storage Foundation] Supabase not configured. Using development fake path.')
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return `/images/demo-${Date.now()}-${file.name}`
    }

    const uuid = crypto.randomUUID()
    const ext = file.name.split('.').pop()
    const storageKey = `couples/${coupleId}/${usageType}/${uuid}.${ext}`

    const { data, error } = await supabase!.storage
      .from('our-story-media')
      .upload(storageKey, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(`Failed to upload media: ${error.message}`)
    }

    return data.path
  },

  createSignedUrl: async (storageKey: string, coupleId: string): Promise<string> => {
    if (!isSupabaseConfigured || storageKey.startsWith('/images/') || storageKey.startsWith('/videos/') || storageKey.startsWith('/audio/')) {
      // Fallback for development static files
      return storageKey
    }

    // In a fully secure setup, we would verify coupleId authorization via a backend edge function here,
    // or rely on Supabase Storage RLS policies where the authenticated user (Admin) is granted SELECT.
    console.log(`[Storage] Generating signed URL for tenant: ${coupleId}`)

    const { data, error } = await supabase!.storage
      .from('our-story-media')
      .createSignedUrl(storageKey, 3600) // 1 hour expiry

    if (error || !data) {
      console.error('[Storage Error] Could not generate signed URL', error)
      return storageKey // Fallback to raw string, which will break safely (403)
    }

    return data.signedUrl
  },

  deleteMedia: async (storageKey: string): Promise<void> => {
    if (!isSupabaseConfigured || storageKey.startsWith('/')) {
      console.warn(`[Storage Foundation] Deleted mock file ${storageKey}`)
      return
    }

    const { error } = await supabase!.storage
      .from('our-story-media')
      .remove([storageKey])
      
    if (error) {
      throw new Error(`Failed to delete media: ${error.message}`)
    }
  }
}
