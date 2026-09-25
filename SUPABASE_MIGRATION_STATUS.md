# SUPABASE MIGRATION STATUS

## Current Status: STEP 24

### 1. Authentication
**Status:** IMPLEMENTED
**Details:** `authService.ts` relies on `supabase.auth.signInWithPassword()` and `supabase.auth.getSession()`. The admin UI is securely guarded by `authService.onAuthStateChange()`, removing the mock dev session.

### 2. Database Schema & RLS
**Status:** IMPLEMENTED
**Details:** `supabase/migrations/` holds the production schemas. RLS policies secure tenant access and public read operations (PUBLISHED only).

### 3. Couple Persistence
**Status:** IMPLEMENTED
**Details:** `coupleService.ts` queries the PostgreSQL database via `@supabase/supabase-js`. 

### 4. Content Persistence (Profiles, Memories, Timeline)
**Status:** IMPLEMENTED
**Details:** `contentService.ts` fetches and stores related tenant data using async database queries.

### 5. Media Persistence & Storage
**Status:** IMPLEMENTED
**Details:** Binaries upload to the `our-story-media` private bucket. Metadata is synced to the database. Render paths use short-lived Signed URLs.

### 6. Development Fallback
**Status:** FOUNDATION / DEVELOPMENT ONLY
**Details:** If `VITE_SUPABASE_URL` is omitted, the `isSupabaseConfigured` flag allows the application to fall back to `localStorage` JSON arrays, ensuring the repo can be run without an immediate cloud setup for V1 previewers.

### Known Limitations
- The remaining content mutations (`saveProfile`, `saveMemory`) inside `contentService.ts` have not yet been rewritten to `supabase.from('...').upsert(...)`. They currently just read from Supabase asynchronously but mutative functions might need further async adaptation.


## STEP 25 - MUTATIONS

The content mutator gap is closed. All UI edits to content lists map securely to PostgreSQL tables via RLS.


## STEP 27 - DEPLOYMENT READY

All architectures and mutations are now structurally complete for a real Vercel + Supabase deployment. The codebase successfully builds to a production bundle free of credential leaks.


## STEP 28 - LIVE MIGRATION VERIFICATION

Status: NOT EXECUTED - ENVIRONMENT NOT CONFIGURED. Migrations are prepared locally in \supabase/migrations/\ but await execution against a live configured project.


## STEP 29 - LIVE MIGRATION

Status: APPLIED. Schema and RLS policies successfully applied to production project.


## STEP 30 — MEDIA E2E

Status: BLOCKED. Storage bucket not configured.
