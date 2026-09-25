import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

export const authService = {
  loginAdmin: async (email: string, password: string): Promise<boolean> => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check environment variables.')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    return true
  },

  logoutAdmin: async (): Promise<void> => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  getCurrentSession: async (): Promise<Session | null> => {
    if (!supabase) return null
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error fetching session:', error.message)
      return null
    }
    return session
  },

  getCurrentAdmin: async (): Promise<boolean> => {
    const session = await authService.getCurrentSession()
    return !!session
  },

  requireAdmin: async (): Promise<void> => {
    const isAdmin = await authService.getCurrentAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required.')
    }
  },

  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange(callback)
  }
}
