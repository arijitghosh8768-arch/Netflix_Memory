/**
 * Authentication & Authorization Foundation
 * 
 * Selected Architecture: Supabase
 * In a Vite SPA, Supabase Auth utilizes local storage or session storage for the JWT.
 * For this foundational step, we simulate the credential validation, session creation, 
 * and authorization checks before full cloud integration.
 */

const SESSION_KEY = 'admin-session-foundation'

export const authService = {
  /**
   * Validates credentials and creates an admin session.
   */
  loginAdmin: async (email: string, password: string): Promise<boolean> => {
    // Development Foundation Mock
    // Production will call Supabase: supabase.auth.signInWithPassword({ email, password })
    if (email === 'admin@ourstory.com' && password === 'admin') {
      sessionStorage.setItem(SESSION_KEY, 'true')
      return true
    }
    throw new Error('Invalid email or password.')
  },

  /**
   * Invalidates session and clears local credentials.
   */
  logoutAdmin: async (): Promise<void> => {
    // Production: supabase.auth.signOut()
    sessionStorage.removeItem(SESSION_KEY)
  },

  /**
   * Returns current authenticated status.
   */
  getCurrentAdmin: (): boolean => {
    // Production: supabase.auth.getSession()
    return sessionStorage.getItem(SESSION_KEY) === 'true'
  },

  /**
   * Enforces server-side authorization conceptually for API methods.
   * Throws if unauthorized.
   */
  requireAdmin: (): void => {
    if (!authService.getCurrentAdmin()) {
      throw new Error('Unauthorized: Admin access required.')
    }
  }
}
