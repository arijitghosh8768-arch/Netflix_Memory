export interface Couple {
  id: string
  slug: string

  person1Name: string
  person2Name: string

  relationshipStart: string

  heroTitle: string
  description: string
  finalMessage: string

  templateId: string

  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  
  heroMediaId?: string
  profileMediaId?: string

  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export type MediaType = "IMAGE" | "VIDEO" | "AUDIO"

export type MediaUsage =
  | "HERO"
  | "PROFILE"
  | "MEMORY_COVER"
  | "MEMORY_VIDEO"
  | "TIMELINE"
  | "GALLERY"
  | "BACKGROUND_AUDIO"
  | "ENDING_AUDIO"

export interface MediaAsset {
  id: string
  coupleId: string

  type: MediaType

  name: string
  storageKey: string

  mimeType: string
  size: number

  width?: number
  height?: number
  duration?: number

  thumbnailKey?: string

  createdAt: string
  updatedAt: string
}

export interface MediaAssignment {
  id: string
  coupleId: string
  mediaId: string
  usage: MediaUsage
  referenceId?: string
  sortOrder?: number
}

export interface Template {
  id: string
  name: string
  description: string
  previewImage?: string
  version: string
  supportedFeatures: string[]
}
