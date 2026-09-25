# AUTHENTICATION & SECURITY ARCHITECTURE

This document outlines the foundation for securing the multi-tenant architecture.

## Authentication
Admin authentication will rely on **Supabase Auth**. This provides secure credential validation and session handling out of the box, reducing custom security code footprint.

## Session management
In the Vite SPA context, Supabase handles session tokens (JWTs) via browser storage. The API layer (Supabase PostgREST) natively validates these JWTs on every request.

## Admin authorization
Protected routes (e.g., `/admin/*`) use UI protection (`AdminLayout.tsx` redirecting to `/admin/login`) combined with API protection (`authService.requireAdmin()`).

## Database security & Tenant isolation
Supabase provides Row Level Security (RLS). When the backend is fully connected, every query will automatically scope to the authenticated user's permissions, ensuring Couple A's data can never be accessed or modified unless the admin is authorized for it.

## API security
Direct database access is abstracted behind API services (`coupleService.ts`, `mediaService.ts`) which enforce role checks before mutation. 

## Private storage & Signed URLs
`storageService.ts` abstracts the storage mechanism. Media will be uploaded to Supabase Storage with bucket-level policies blocking public reads. The application will generate short-lived signed URLs (`createSignedUrl()`) allowing authenticated viewers temporary access to media files.

## Secrets management & Environment variables
Secrets are strictly separated between client and server. Only `VITE_*` prefixed variables (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are exposed to the client bundle. Service role keys and database URLs are never shipped to the client and reside strictly in `.env`.

## Development vs production
In development, the UI operates using `localStorage` persistence wrapped by security checks (`authService`). In production, this layer swaps for real network requests to the secure backend, ensuring a smooth transition without rewriting the UI logic.

---

## Threat Model

**Unauthenticated admin access**
- *Impact*: Full control over all couples.
- *Mitigation*: UI route guards + API/RLS protections requiring valid JWT.
- *Status*: FOUNDATION IMPLEMENTED.

**Session theft**
- *Impact*: Attacker can impersonate admin.
- *Mitigation*: Short-lived JWTs, secure cookie configurations in SSR (if adopted), or standard Supabase SPA token rotation.
- *Status*: DOCUMENTED (Pending Supabase integration).

**Credential leakage**
- *Impact*: Database compromise.
- *Mitigation*: No secrets in frontend bundle. Use `.env`.
- *Status*: IMPLEMENTED.

**Cross-couple data access (IDOR)**
- *Impact*: Couple sees another's private photos.
- *Mitigation*: Database RLS policies and backend parameter validation.
- *Status*: FOUNDATION IMPLEMENTED.

**Direct media URL access**
- *Impact*: Unauthorized viewing of private photos.
- *Mitigation*: Private buckets.
- *Status*: FOUNDATION IMPLEMENTED.

**Signed URL leakage**
- *Impact*: Unauthorized viewing.
- *Mitigation*: Short expiration times (e.g. 60 seconds).
- *Status*: FOUNDATION IMPLEMENTED.

**Unauthorized media deletion / publishing**
- *Impact*: Data loss / premature visibility.
- *Mitigation*: API endpoints require Admin JWT.
- *Status*: FOUNDATION IMPLEMENTED.

**Brute-force login attempts**
- *Impact*: Password compromise.
- *Mitigation*: Supabase Auth built-in rate limiting and captcha support.
- *Status*: DOCUMENTED.


## STEP 23 - PRODUCTION AUDIT

Authentication structure has been audited. RLS policies have been designed to protect tenant data at the database tier.
