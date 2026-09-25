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

  counterEnabled?: boolean
  counterStartDate?: string
  endingTitle?: string
  endingQuote?: string
  backgroundAudioMediaId?: string
  endingAudioMediaId?: string

  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface Profile {
  id: string
  coupleId: string
  name: string
  mediaId?: string
  theme?: string
  sortOrder: number
}

export interface Memory {
  id: string
  coupleId: string
  title: string
  category: string
  description: string
  coverMediaId?: string
  videoMediaId?: string
  duration?: string
  featured?: boolean
  sortOrder: number
}

export interface TimelineEvent {
  id: string
  coupleId: string
  date: string
  title: string
  description: string
  mediaId?: string
  sortOrder: number
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
