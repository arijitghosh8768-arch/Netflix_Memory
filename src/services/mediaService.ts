import type { MediaAsset, MediaAssignment } from '../types/models'
import { authService } from './authService'

const ASSETS_KEY = 'our-story-media-assets'
const ASSIGNMENTS_KEY = 'our-story-media-assignments'

export const mediaService = {
  // DEVELOPMENT ONLY PERSISTENCE
  _loadAssets: (): MediaAsset[] => {
    try {
      const stored = localStorage.getItem(ASSETS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  _saveAssets: (assets: MediaAsset[]) => {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets))
  },

  _loadAssignments: (): MediaAssignment[] => {
    try {
      const stored = localStorage.getItem(ASSIGNMENTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  _saveAssignments: (assignments: MediaAssignment[]) => {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments))
  },

  // PUBLIC API

  getMediaForCouple: (coupleId: string): MediaAsset[] => {
    return mediaService._loadAssets().filter(a => a.coupleId === coupleId)
  },

  getMediaById: (mediaId: string): MediaAsset | undefined => {
    return mediaService._loadAssets().find(a => a.id === mediaId)
  },

  createMedia: (coupleId: string, data: Partial<MediaAsset>): MediaAsset => {
    authService.requireAdmin()
    const assets = mediaService._loadAssets()
    const newMedia: MediaAsset = {
      id: `media-${Date.now()}`,
      coupleId,
      type: data.type || "IMAGE",
      name: data.name || "Untitled",
      storageKey: data.storageKey || `/images/demo-${Date.now()}.jpg`, // Development fake path
      mimeType: data.mimeType || "image/jpeg",
      size: data.size || 1024,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    assets.push(newMedia)
    mediaService._saveAssets(assets)
    return newMedia
  },

  deleteMedia: (mediaId: string) => {
    authService.requireAdmin()
    const assets = mediaService._loadAssets()
    const updatedAssets = assets.filter(a => a.id !== mediaId)
    mediaService._saveAssets(updatedAssets)

    // Remove associated assignments
    const assignments = mediaService._loadAssignments()
    const updatedAssignments = assignments.filter(a => a.mediaId !== mediaId)
    mediaService._saveAssignments(updatedAssignments)
  },

  assignMedia: (data: Omit<MediaAssignment, 'id'>): MediaAssignment => {
    authService.requireAdmin()
    const assignments = mediaService._loadAssignments()
    const newAssignment: MediaAssignment = {
      id: `assignment-${Date.now()}`,
      ...data
    }
    assignments.push(newAssignment)
    mediaService._saveAssignments(assignments)
    return newAssignment
  },

  removeMediaAssignment: (assignmentId: string) => {
    authService.requireAdmin()
    const assignments = mediaService._loadAssignments()
    mediaService._saveAssignments(assignments.filter(a => a.id !== assignmentId))
  },

  getAssignmentsForCouple: (coupleId: string): MediaAssignment[] => {
    return mediaService._loadAssignments().filter(a => a.coupleId === coupleId)
  }
}
