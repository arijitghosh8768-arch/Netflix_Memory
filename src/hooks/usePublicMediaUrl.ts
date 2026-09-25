import { useState, useEffect } from 'react'
import { publicMediaService } from '../services/publicMediaService'

export function usePublicMediaUrl(slug?: string, mediaId?: string) {
  const [url, setUrl] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true

    if (!slug || !mediaId) {
      setUrl(undefined)
      return
    }

    setLoading(true)
    setError(null)

    publicMediaService.getPublicMediaUrl(slug, mediaId)
      .then((resolvedUrl) => {
        if (active) {
          setUrl(resolvedUrl)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err : new Error('Failed to load media'))
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [slug, mediaId])

  return { url, loading, error }
}
