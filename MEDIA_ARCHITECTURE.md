# MEDIA ARCHITECTURE

This document outlines the foundation and future requirements for managing media within the multi-tenant architecture.

## 1. Media model
`MediaAsset` defines a storage-agnostic asset belonging strictly to a `coupleId`, recording size, mimeType, type, and dimensions.

## 2. Media assignment model
`MediaAssignment` maps a `MediaAsset` to a specific `MediaUsage` (e.g. `HERO`, `PROFILE`, `MEMORY_COVER`). Media is reusable without duplicating files.

## 3. Couple isolation
Every asset belongs to one couple. Storage paths are scoped (e.g., `couples/{coupleId}/hero/...`). The backend API must explicitly authorize access to assets.

## 4. Media service
A unified API (`mediaService.ts`) abstracts storage operations. Components fetch data via this service instead of direct bucket requests.

## 5. Development storage
Currently, `localStorage` holds media metadata. Binary blobs aren't uploaded; instead, mock local paths (`/images/hero/hero.webp`) are assigned for development UI validation.

## 6. Future cloud storage
In production, media will be uploaded to an S3-compatible private bucket (or Supabase Storage). 

## 7. Future private storage
Buckets will enforce `public-read = false`. Direct GET requests to the bucket will fail.

## 8. Signed URLs
The backend will generate short-lived signed URLs for rendering the `MediaAsset`.

## 9. Storage key design
Files will be stored under `couples/{coupleId}/{usageType}/{uuid}.ext`. No user-provided filenames will be used in keys.

## 10. File validation
Future upload routes must strictly enforce MIME types (jpeg, webp, mp4), file sizes, and scan for malicious payloads.

## 11. Media limits
Future plans include per-couple total size quotas and duration limits for videos to control bandwidth costs.

## 12. Delete safety
Deletions will check `MediaAssignment`. If a photo is assigned to a memory, a warning or cascaded update will happen to prevent broken images.

## 13. Template integration
UI templates consume assigned assets from the `Couple` model instead of hardcoding paths.

## 14. Migration plan
When integrating the backend API, `mediaService.ts` will simply swap its `localStorage` internals with `fetch()` calls to the new backend. No UI components will need rewriting.


## STEP 20 - STORAGE SECURITY FOUNDATION

Private storage and Signed URL abstractions have been implemented in storageService.ts, laying the groundwork for secure media delivery.


## STEP 22 - PRODUCTION SUPABASE STORAGE

Media is now fully integrated with Supabase Storage (Private Buckets). All file operations are authenticated, validated, and stored via short-lived Signed URLs.


## STEP 23 - PRODUCTION SECURITY

Storage policies are configured for strictly private buckets. Unauthenticated requests are denied. Signed URLs are enforced.
## STEP 30C — SECURE PUBLIC SIGNED-MEDIA DELIVERY

Status: BLOCKED. 

Architecture audit completed. The database schema (`001_initial_schema.sql`) does not contain a `media_assignments` table, which is required to securely enforce whether a specific media asset is actually assigned/used by published content. As instructed, I have stopped before implementing the Edge Function to prevent insecure shortcuts.

## STEP 30D — MEDIA ASSIGNMENT DATABASE FOUNDATION

Status: PARTIALLY VERIFIED / BLOCKED. 
- Created `004_media_assignments.sql` migration defining the `media_assignments` table.
- Added foreign keys for `couple_id` and `media_id` with `ON DELETE CASCADE`.
- Added `usage` CHECK constraint for valid usage types (`HERO`, `GALLERY`, etc.).
- Created a unique index to prevent duplicate assignments: `(couple_id, media_id, usage, coalesce(reference_id, ''))`.
- Enabled RLS with Admin-only access, maintaining the V1 authorization model.
- Integrated frontend service `mediaService.ts` to handle assignments, including an application-level tenant isolation check verifying media ownership before assignment.
- Build verified and security audit passed with no credential exposure.
- Cannot apply migration live (`supabase db push`) because we are intentionally not using the exposed database password/scratch scripts.
- Schema foundation is verified locally and READY for the public media Edge Function logic.

## STEP 30E — SECURE PUBLIC MEDIA EDGE FUNCTION

Status: BLOCKED (Awaiting live migration 004 & function deployment)
- Designed and implemented `public-media-url` Edge Function in Deno to provide short-lived (1 hr) signed URLs to anonymous visitors of published couples.
- Edge function validates couple status (`PUBLISHED`), media ownership (`media_assets.couple_id`), and explicit media assignment (`media_assignments`) before invoking the privileged admin Storage client to generate the signed URL.
- Added frontend integration via `publicMediaService.ts` and `usePublicMediaUrl.ts` Hook.
- Security Audit PASSED: No service-role or database credentials exposed in the React code. The edge function relies strictly on secure server-side environment variables (`SUPABASE_SERVICE_ROLE_KEY`).
- Live tests are BLOCKED until `004_media_assignments.sql` is manually applied and the edge function is pushed to the live Supabase project by an authenticated administrator.

## STEP 30F — LIVE SUPABASE + EDGE FUNCTION E2E

Status: BLOCKED (Requires User Action)
- CLI link and authentication is intentionally decoupled from the development environment to protect credentials. 
- Migration `004` and the Edge Function cannot be deployed by the agent directly.
- Testing of anonymous signed URLs and private media loading is pending the live deployment of these components.
- Frontend builds successfully and credential boundaries are completely secure.
- **Required User Actions**:
  1. `npx supabase login`
  2. `npx supabase link --project-ref ruxinzqymhlypxivyjbp`
  3. `npx supabase db push`
  4. `npx supabase functions deploy public-media-url`
  5. `npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`

