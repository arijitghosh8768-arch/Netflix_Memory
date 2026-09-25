import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { slug, mediaId } = await req.json()

    if (!slug || typeof slug !== 'string' || !mediaId || typeof mediaId !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Validate Couple exists & PUBLISHED
    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .select('id, status')
      .eq('slug', slug)
      .single()

    if (coupleError || !couple || couple.status !== 'PUBLISHED') {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 2. Validate Media exists & Ownership
    const { data: media, error: mediaError } = await supabase
      .from('media_assets')
      .select('id, couple_id, storage_key')
      .eq('id', mediaId)
      .single()

    if (mediaError || !media || media.couple_id !== couple.id) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 3. Validate Media is Assigned to Couple
    const { data: assignment, error: assignError } = await supabase
      .from('media_assignments')
      .select('id')
      .eq('couple_id', couple.id)
      .eq('media_id', mediaId)
      .limit(1)
      .single()

    if (assignError || !assignment) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 4. Generate Short-Lived Signed URL (1 hour)
    const { data: signedData, error: signedError } = await supabase
      .storage
      .from('our-story-media')
      .createSignedUrl(media.storage_key, 3600)

    if (signedError || !signedData?.signedUrl) {
      console.error('Storage error:', signedError)
      return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(
      JSON.stringify({ url: signedData.signedUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
