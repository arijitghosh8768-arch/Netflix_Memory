import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const publicMediaService = {
  getPublicMediaUrl: async (slug: string, mediaId: string): Promise<string> => {
    if (!isSupabaseConfigured) {
      // Fallback for development without Supabase configured
      console.warn('[Public Media] Supabase not configured. Using fallback local path.')
      return `/images/demo-fallback-${mediaId}.jpg`
    }

    const { data, error } = await supabase!.functions.invoke('public-media-url', {
      body: { slug, mediaId }
    })

    if (error || !data?.url) {
      console.error('[Public Media] Failed to resolve media URL:', error)
      throw new Error('Could not load media')
    }

    return data.url
  }
}
