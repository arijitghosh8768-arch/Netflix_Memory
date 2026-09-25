export const allowedOrigins = [
  'http://localhost:5173',
  'https://netflix-memory-one.vercel.app'
]

export const getCorsHeaders = (reqOrigin: string | null) => {
  const origin = reqOrigin && allowedOrigins.includes(reqOrigin) ? reqOrigin : allowedOrigins[1]
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}
