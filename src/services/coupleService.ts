import type { Couple, Template } from '../types/models'
import { authService } from './authService'

const INITIAL_TEMPLATES: Template[] = [
  { id: 'cinematic', name: 'Cinematic', description: 'The original immersive cinematic experience.', version: '1.0', supportedFeatures: ['video', 'timeline'] },
  { id: 'romantic', name: 'Romantic', description: 'Coming soon', version: '1.0', supportedFeatures: [] },
  { id: 'minimal', name: 'Minimal', description: 'Coming soon', version: '1.0', supportedFeatures: [] },
  { id: 'luxury', name: 'Luxury', description: 'Coming soon', version: '1.0', supportedFeatures: [] }
]

const INITIAL_COUPLES: Couple[] = [
  { id: 'couple-001', slug: 'rahul-priya', person1Name: 'Rahul', person2Name: 'Priya', relationshipStart: '2023-01-01', heroTitle: 'The Story of Rahul & Priya', description: 'A collection of moments, laughter, and everything that made this story special.', finalMessage: 'Our story continues...', templateId: 'cinematic', status: 'PUBLISHED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'couple-002', slug: 'amit-sneha', person1Name: 'Amit', person2Name: 'Sneha', relationshipStart: '2022-05-15', heroTitle: 'The Story of Amit & Sneha', description: 'Every moment spent with you is a moment I treasure.', finalMessage: 'Forever and always.', templateId: 'cinematic', status: 'PUBLISHED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'couple-003', slug: 'arijit-rim', person1Name: 'Arijit', person2Name: 'Rim', relationshipStart: '2024-02-14', heroTitle: 'The Story of Arijit & Rim', description: 'Our beautiful journey together.', finalMessage: 'To be continued...', templateId: 'cinematic', status: 'DRAFT', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
]

const STORAGE_KEY = 'our-story-couples'

export const coupleService = {
  // INTERNAL: Load data from localStorage (Development Persistence Only)
  _loadCouples: (): Couple[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COUPLES))
        return INITIAL_COUPLES
      }
      return JSON.parse(stored)
    } catch {
      return INITIAL_COUPLES
    }
  },

  _saveCouples: (couples: Couple[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(couples))
  },

  // PUBLIC API
  getTemplates: (): Template[] => {
    return INITIAL_TEMPLATES
  },

  getAllCouples: (): Couple[] => {
    return coupleService._loadCouples()
  },

  getCoupleBySlug: (slug: string): Couple | undefined => {
    return coupleService._loadCouples().find((c) => c.slug === slug)
  },

  getCoupleById: (id: string): Couple | undefined => {
    return coupleService._loadCouples().find((c) => c.id === id)
  },

  createCouple: (data: Partial<Couple>): Couple => {
    authService.requireAdmin()
    const couples = coupleService._loadCouples()
    const newCouple: Couple = {
      id: `couple-${Date.now()}`,
      slug: data.slug || '',
      person1Name: data.person1Name || '',
      person2Name: data.person2Name || '',
      relationshipStart: data.relationshipStart || '',
      heroTitle: data.heroTitle || '',
      description: data.description || '',
      finalMessage: data.finalMessage || '',
      templateId: data.templateId || 'cinematic',
      status: data.status || 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    couples.push(newCouple)
    coupleService._saveCouples(couples)
    return newCouple
  },

  updateCouple: (id: string, data: Partial<Couple>): Couple | undefined => {
    authService.requireAdmin()
    const couples = coupleService._loadCouples()
    const index = couples.findIndex((c) => c.id === id)
    if (index === -1) return undefined

    couples[index] = {
      ...couples[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    coupleService._saveCouples(couples)
    return couples[index]
  },
}

const PROFILES_KEY = 'our-story-profiles'
const MEMORIES_KEY = 'our-story-memories'
const TIMELINE_KEY = 'our-story-timeline'

export const contentService = {
  // Profiles
  getProfiles: (coupleId: string): any[] => {
    try { const data = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]'); return data.filter((d:any) => d.coupleId === coupleId).sort((a:any, b:any) => a.sortOrder - b.sortOrder); } catch { return []; }
  },
  saveProfile: (profile: any) => {
    authService.requireAdmin();
    try {
      const data = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
      const filtered = data.filter((d:any) => d.id !== profile.id);
      filtered.push(profile);
      localStorage.setItem(PROFILES_KEY, JSON.stringify(filtered));
    } catch {}
  },
  deleteProfile: (id: string) => {
    authService.requireAdmin();
    try {
      const data = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
      localStorage.setItem(PROFILES_KEY, JSON.stringify(data.filter((d:any) => d.id !== id)));
    } catch {}
  },

  // Memories
  getMemories: (coupleId: string): any[] => {
    try { const data = JSON.parse(localStorage.getItem(MEMORIES_KEY) || '[]'); return data.filter((d:any) => d.coupleId === coupleId).sort((a:any, b:any) => a.sortOrder - b.sortOrder); } catch { return []; }
  },
  saveMemory: (memory: any) => {
    authService.requireAdmin();
    try {
      const data = JSON.parse(localStorage.getItem(MEMORIES_KEY) || '[]');
      const filtered = data.filter((d:any) => d.id !== memory.id);
      filtered.push(memory);
      localStorage.setItem(MEMORIES_KEY, JSON.stringify(filtered));
    } catch {}
  },
  deleteMemory: (id: string) => {
    authService.requireAdmin();
    try {
      const data = JSON.parse(localStorage.getItem(MEMORIES_KEY) || '[]');
      localStorage.setItem(MEMORIES_KEY, JSON.stringify(data.filter((d:any) => d.id !== id)));
    } catch {}
  },

  // Timeline
  getTimelineEvents: (coupleId: string): any[] => {
    try { const data = JSON.parse(localStorage.getItem(TIMELINE_KEY) || '[]'); return data.filter((d:any) => d.coupleId === coupleId).sort((a:any, b:any) => a.sortOrder - b.sortOrder); } catch { return []; }
  },
  saveTimelineEvent: (event: any) => {
    authService.requireAdmin();
    try {
      const data = JSON.parse(localStorage.getItem(TIMELINE_KEY) || '[]');
      const filtered = data.filter((d:any) => d.id !== event.id);
      filtered.push(event);
      localStorage.setItem(TIMELINE_KEY, JSON.stringify(filtered));
    } catch {}
  },
  deleteTimelineEvent: (id: string) => {
    authService.requireAdmin();
    try {
      const data = JSON.parse(localStorage.getItem(TIMELINE_KEY) || '[]');
      localStorage.setItem(TIMELINE_KEY, JSON.stringify(data.filter((d:any) => d.id !== id)));
    } catch {}
  }
}
